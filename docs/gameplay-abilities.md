# Gameplay Abilities

A `GameplayAbility` is an asset-backed action with a replicated grant, an authority policy, activation
checks, optional cost and cooldown policies, input binding, and tick-driven execution. Use it when an
action must be granted or revoked dynamically, gated by tags, interrupted, or attached to equipment.

![Placeholder: populated GameplayAbility inspector](/images/gameplay-ability-inspector-placeholder.svg)

## Ability lifecycle

An ability moves through this pipeline:

1. `GrantAbility` creates a replicated ability slot and calls `OnGranted`;
2. assigned input or game code calls `TryActivateAbility`;
3. `CanActivate` checks active state, tag requirements, cooldown, and cost;
4. `CommitAbility` applies the configured cost;
5. `Activate` runs through the ability processor on Fusion ticks;
6. the coroutine finishes or is interrupted;
7. the removal policy keeps or revokes the grant;
8. `RevokeAbility` eventually calls `OnRevoked`.

![Placeholder: ability activation pipeline](/images/gameplay-ability-pipeline-placeholder.svg)

## Authoring settings

### Policy

- `ServerAuthority` runs only on state authority.
- `LocalPredicted` can also run for input authority and must remain safe under prediction and rollback.
- `RetriggerAbility` allows activation while already active.
- `Interruptible` controls whether external interruption is accepted.
- removal policy decides whether the grant remains, disappears after completion, or cancels
  immediately when revoked.

### Commit

`TagRequirements` blocks activation when required tags are absent or forbidden tags are present.
`DurationAbilityCooldown` supplies a cooldown in seconds, evaluated against Fusion ticks.
`AttributeAbilityCostPolicy` applies one or more instant gameplay effects after validating that every
modifier can be paid.

### Input

An ability can read a fixed `NetworkInputTarget` directly or use a typed `AbilityInputTag` binding. On
the press edge, `OnButtonPressed` activates by default. On release, the ability can continue or request
interruption through `InterruptOnInputReleased`.

## Grant and activate

```csharp
AbilityHandle dash = abilitySystem.GrantAbility(
    dashAbility,
    inputTag: "Ability.Movement.Dash",
    sourceObject: equipment.Object);

if (!abilitySystem.TryActivateAbility(dash, out var failure))
    hud.ShowAbilityFailure(failure);
```

Keep the handle when later code needs to activate, interrupt, or revoke that exact grant. Equipment can
also revoke all abilities associated with its source object.

## Extended example: reload ability

The weapon module demonstrates the full pattern. It resolves its source when granted, adds
weapon-specific validation, waits using simulation ticks, and reacts to interruption.

```csharp
public sealed class WeaponReloadAbility : GameplayAbility
{
    [NonSerialized] private Weapon? _weapon;

    public override void OnGranted(AbilityGrantContext context)
    {
        base.OnGranted(context);
        context.TryGetSource(out _weapon);
    }

    public override void OnRevoked(AbilityGrantContext context)
    {
        base.OnRevoked(context);
        _weapon = null;
    }

    public override bool CanActivate(
        in AbilityExecutionContext context,
        out AbilityFailureReason failure)
    {
        if (!_weapon)
        {
            failure = AbilityFailureReasons.InvalidSource;
            return false;
        }

        if (_weapon.IsReloading)
        {
            failure = WeaponAbilityFailureReasons.Reloading;
            return false;
        }

        if (_weapon.AmmoInMagazine >= _weapon.MagazineCapacity)
        {
            failure = WeaponAbilityFailureReasons.MagazineFull;
            return false;
        }

        if (_weapon.ReserveAmmo <= 0)
        {
            failure = WeaponAbilityFailureReasons.NoReserveAmmo;
            return false;
        }

        return base.CanActivate(context, out failure);
    }

    public override IEnumerator Activate(AbilityCoroutine context)
    {
        if (!_weapon || !_weapon.CanReload())
            yield break;

        _weapon.BeginReload();
        yield return new AbilityWaitSeconds(_weapon.CalculateReloadTime());

        if (context.Interrupted)
            _weapon.CancelReload();
        else
            _weapon.CompleteReload();
    }
}
```

Calling the base `CanActivate` after project checks preserves the common tag, cooldown, cost, and
already-active rules.

## Tick-driven coroutine tools

Ability routines are not Unity coroutines. `DefaultAbilityProcessor` advances them during
`FixedUpdateNetwork` and supports:

- `AbilityWaitTicks`;
- `AbilityWaitSeconds`, converted through the runner tick rate;
- `AbilityWaitUntil`, optionally with a tick-derived timeout;
- `AbilityWaitInputReleased`.

Use these yields for ordered ability work, but keep the authoritative result in networked gameplay
state. Local coroutine position is not itself rollback state; predicted abilities must be able to
reproduce their result when Fusion resimulates.

## Failure handling and presentation

Override `ActivationFailed` for ability-specific feedback, or subscribe to
`OnAbilityActivateFailed`. Presentation events should be emitted only on forward simulation; the
component already gates its public events with `Runner.IsForward`.

`PresentationBehaviour` assets can attach pooled audio or particle feedback to an effect/ability
result without making the presentation object authoritative.

Next: [Inventory, Equipment, and Interaction](gameplay-items.md).
