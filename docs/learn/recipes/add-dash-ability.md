# Recipe: Add a Dash Ability

**Outcome:** pressing one network input starts a short deterministic dash.

**Before you start:** your character already has `AbilitySystemComponent`, the
RedEngine movement controller, and working network input.

::: info Execution model
- **Authority** — State Authority owns the grant and confirms the resulting movement.
- **Prediction** — safe for Input Authority only when the ability uses `LocalPredicted` policy.
- **Replicated** — ability grant and the character's resulting simulation pose.
- **Local only** — dash trail, sound, camera impulse, and button feedback.
:::

## 1. Create the ability asset

Create **RedEngine > Movement > Dash Ability**. Set a conservative speed and duration, for example
`16` and `0.18` seconds. Keep the default authority policy until the basic version works.

## 2. Choose the input

In the ability asset, assign an unused `NetworkInputTarget` or an `AbilityInputTag`. Map the matching
Input Action in `InputSettings`.

The built-in ability chooses movement intent first, then look direction, then character forward. It
starts controlled motion through the movement controller rather than translating the transform.

## 3. Grant it

Grant the asset when the character spawns, alongside the character's other default abilities:

```csharp
[SerializeField] private GameplayAbility dashAbility = null!;

public override void Spawned()
{
    base.Spawned();
    if (HasAuthority && dashAbility)
        abilitySystem.GrantAbility(dashAbility);
}
```

## Verify

Run two peers. Dash forward, sideways, and from rest. Both peers should agree on the resulting
position. If input does nothing, verify the grant and input target before changing movement settings.

## Understand the system

Continue with [Manual: Abilities](../../manual/abilities.md) for policies, costs, cooldowns,
cancellation, and equipment-granted abilities.
