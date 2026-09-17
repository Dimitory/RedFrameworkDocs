# Character Controller, Weapon, and Feedback

Start from the showcase character before tuning a controller from scratch. Once movement behaves the
same on two peers, add one weapon path and only then layer camera shake, particles, audio, or other
feedback on top of the replicated result.

## RedEngine.Gameplay.Movement

`CharacterController` is a deterministic kinematic controller. The engine separates the
motor, surface, environment, movement base, and trigger contracts.

```csharp
using RedEngine.Gameplay.Movement;
using UnityEngine;

public sealed class WindVolume : MonoBehaviour, IMotionEnvironment
{
    public void Evaluate(ref MotionEnvironmentState state)
    {
        state.Gravity += Vector3.right * 3f;
    }
}
```

Use the built-in `MotionEnvironmentVolume` and `MovementSurfaceVolume` for ordinary zones.
Moving platforms implement `IMovementBase`. Jump and dash are already represented by
`CharacterJumpAbility` and `CharacterDashAbility`.

For a replicated moving platform, drive its pose from Fusion ticks and add `MovementBase` to the
same NetworkObject. Periodic hazards should use `ICharacterTrigger` plus Gameplay Effects;
reactions such as a bounce use `CharacterController.AddImpulse` so prediction and rollback retain
the result.

A scene containing ramps, stairs, a lift, teleporters, and environment volumes is available
in `Samples~/CompactShowcase`.

## RedEngine.Gameplay.Weapon

`RangedWeapon`, `MeleeWeapon`, and `ThrowableWeapon` are focused equipment instances sharing
fire modes, ammo, and ability-driven fire/reload behavior. `RangedWeapon` performs an immediate
trace, `MeleeWeapon` performs a short trace, and `ThrowableWeapon` launches a local
`ProjectileVisual`. Weapons replicate only immutable attack parameters; projectile motion and
presentation are not replicated, and only authoritative damage enters network state.

```csharp
using RedEngine.Gameplay.Weapon;
using UnityEngine;

public sealed class BoltAppearance : MonoBehaviour
{
    private void LateUpdate()
    {
        // Optional visual-only customization alongside ProjectileVisual.
        transform.Rotate(Vector3.forward, 360f * Time.deltaTime, Space.Self);
    }
}
```

Assign a `ProjectileVisual` prefab directly to `ThrowableWeapon`. Configure speed, homing, gravity,
bounce, lifetime, collision, and feedback on that prefab. `ProjectileLaunchParameters` carries the
constant per-shot origin, direction, target, damage, radius, collision mask, tick, and sequence into
`ProjectileVisual.Shoot` as one value.

## RedEngine.Gameplay.Feedback

Feedback separates non-deterministic presentation from simulation. `FeedbackManager` is a
world subsystem; `FeedbackDefinition` describes audio, particles, bindings, and lifetime.
Its lifetime callbacks use the non-replicated world timer and never own gameplay state.

```csharp
using RedEngine.Gameplay.Feedback;

FeedbackManager feedback = World.GetSubsystem<FeedbackManager>();
FeedbackHandle handle = feedback.PlayFeedback(definition, parameters);

if (feedback.IsActive(handle))
    feedback.StopFeedback(handle);
```

Do not put damage or other authoritative state changes in a feedback callback:
presentation may be replayed or canceled during reconciliation.
