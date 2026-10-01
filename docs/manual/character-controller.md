# Character Controller

Start from the showcase character before tuning a controller from scratch. Verify every movement
change with two peers so authority, prediction, collision, and rendered interpolation remain aligned.

## Runtime model

`CharacterController` owns its predicted `CharacterMovementState` and delegates collision movement to
a plain C# `KinematicMotor`. The motor is a runtime object rather than a component, so it does not add
a separate Inspector entry.

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

Call `CharacterController.SetSprinting` for the sprint state and
`CharacterController.SetExternalSpeedMultiplier` for temporary replicated boosts. The two multipliers
compose, so a pickup or gameplay effect does not need to overwrite sprint state.

For a replicated moving platform, drive its pose from Fusion ticks and add `MovementBase` to the
same NetworkObject. Periodic hazards should use `ICharacterTrigger` plus Gameplay Effects. Implement
`ICharacterStayTrigger` when the effect duration must be refreshed while the character remains inside;
reactions such as a bounce use `CharacterController.AddImpulse` so prediction and rollback retain
the result.

Keep the mesh under a child transform and use it as `Character.ViewTarget`. The motor moves the
character root during Fusion simulation ticks. `CharacterController.Render` interpolates replicated
movement snapshots and applies the render pose to that same root, so its capsule and child visuals
stay together. The next simulation tick restores the networked motor pose before movement runs.

The motor treats other characters' trigger capsules as solid obstacles while ordinary trigger volumes
remain passable. Characters stop or slide at contact and separate after an overlap. On state authority,
moving into another character also transfers a bounded movement impulse to that character through its
networked pending impulse; `characterPushStrength` controls the transfer in the Inspector. The motor's
collision mask must include the layers used by other characters.

Grounded locomotion follows the walkable ground plane, including its vertical component. Gravity is
applied only while airborne. A character that was grounded remains snapped to walkable ground while
it is not moving away from the ground normal, including when its velocity points upward along a ramp.
This prevents separation and jitter on ramps. Jump and dash motion away from the ground remains
airborne until the character can land.

The motor's `minSlopeAngle` defaults to 30 degrees. Slopes below this angle hold an idle character
in place; slopes at or above it apply gravity along the surface. `maxGroundAngle` still controls
which surfaces count as walkable ground.

Dynamic Rigidbody contacts are evaluated in the same Fusion simulation tick. A moving body contributes
an external positional displacement before the character's own sweep, while penetration resolution is
reserved for overlaps that still remain. Rigidbody gameplay that interacts with predicted characters
must therefore run from `FixedUpdateNetwork`, with Unity Rigidbody interpolation disabled.

A scene containing ramps, stairs, a lift, teleporters, and environment volumes is available
in `Samples~/CompactShowcase`.

Next: [Weapon](weapon.md) · [Feedback](feedback.md).
