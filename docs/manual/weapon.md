# Weapon

`RangedWeapon`, `MeleeWeapon`, and `ThrowableWeapon` are focused equipment instances sharing fire
modes, ammo, and ability-driven fire/reload behavior.

## Weapon types

- `RangedWeapon` performs an immediate trace.
- `MeleeWeapon` performs a short trace.
- `ThrowableWeapon` launches a local `ProjectileVisual`.

Weapons replicate immutable attack parameters and authoritative gameplay state. Projectile motion and
presentation are not replicated; only authoritative hits, damage, ammo, and reload results enter
network state.
Remote weapons play each received shot during `Render`, since Fusion proxies do not necessarily run
`FixedUpdateNetwork`. The state authority still resolves hits and damage during network ticks.

## Projectile presentation

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

## Aim and hit resolution

`AimedWeapon` can acquire a visible actor inside its configured auto-aim range and cone. The fire
ability uses this helper only while `PreciseAimInput` is not held; an explicit target lock still takes
priority. PhysX hits are resolved through either the Fusion hit GameObject or its Collider.
The built-in kinematic character motor uses a trigger capsule. World raycasts include actor triggers
so shots and target locking can hit characters, while unrelated trigger volumes do not block traces.
Sphere overlaps include triggers for auto aim and interaction scans.
World physics queries synchronize moved colliders before tracing, including after a character respawns
in a client physics scene.

See [Equipment](equipment.md) for weapon ownership and granted abilities. Continue with
[Feedback](feedback.md) for particles, audio, and other local responses.
