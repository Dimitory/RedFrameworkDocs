# Subsystems

A subsystem is a service whose lifetime follows a RedEngine owner. It is created once, initialized
with that owner, retrieved by type, and deinitialized automatically. Use one when several unrelated
actors need the same service but the service should not become a static global.

RedEngine has two subsystem lifetimes:

| Base type | Owner | Lifetime | Good for |
| --- | --- | --- | --- |
| `GameInstanceSubsystem` | `GameInstance` | Across world travel | UI, local timers, messages, account/session presentation |
| `WorldSubsystem` | `World` | Current Fusion world | Scene queries, replicated presentation, projectile simulation |

## How creation works

When a `GameInstance` or `World` initializes, its `SubsystemCollection` discovers concrete types that
implement the matching subsystem contract. Plain game-instance subsystems are created as C# objects.
World subsystems derive from Fusion `SimulationBehaviour`, so RedEngine adds them to an internal host
GameObject and registers them with the active `NetworkRunner` through `AddGlobal`.

You normally request a subsystem by its concrete type:

```csharp
WidgetSubsystem? widgets = gameInstance.GetSubsystem<WidgetSubsystem>();
WorldMarkerSubsystem? markers = world.GetSubsystem<WorldMarkerSubsystem>();
```

If a valid concrete subsystem was not created during initial discovery, `GetSubsystem<T>()` attempts
to create and initialize it on demand. Repeated calls return the same instance for that owner.

## Create a GameInstance subsystem

This example keeps local matchmaking presentation alive while the game travels between maps:

```csharp
using RedEngine.Core;
using RedEngine.Core.Subsystems;

public sealed class MatchmakingStatusSubsystem : GameInstanceSubsystem
{
    public string Status { get; private set; } = "Idle";

    public override void Initialize(ISubsystemCollection<GameInstance> collection)
    {
        base.Initialize(collection);
        GameInstance.OnBeginLoadWorld += HandleTravelStarted;
    }

    public override void Deinitialize()
    {
        GameInstance.OnBeginLoadWorld -= HandleTravelStarted;
        base.Deinitialize();
    }

    private void HandleTravelStarted(TravelURL url) =>
        Status = $"Loading {url.SceneName}";
}
```

Always unsubscribe and release owned resources in `Deinitialize`. The subsystem collection invokes it
during game-instance shutdown.

## Create a World subsystem

World subsystems can use Fusion callbacks because they are `SimulationBehaviour` instances:

```csharp
using Fusion;
using RedEngine.Core;
using RedEngine.Core.Subsystems;

public sealed class ObjectiveSubsystem : WorldSubsystem
{
    public override void FixedUpdateNetwork()
    {
        if (!World.NetworkRunner.IsServer)
            return;

        // Evaluate authoritative objective state on the Fusion tick.
    }

    public override void Deinitialize()
    {
        // Release scene-owned subscriptions and caches first.
        base.Deinitialize();
    }
}
```

Do not keep a `WorldSubsystem` reference after travel. The old world deinitializes its collection and
the next world receives a new instance. Resolve it again from the new `World`.

## Built-in GameInstance subsystems

### `TimerManager`

Runs local, non-replicated callbacks and survives world travel. It is appropriate for UI dismissal,
presentation cleanup, and other local work:

```csharp
TimerHandle handle = gameInstance.TimerManager.SetTimer(HideToast, 2f);
gameInstance.TimerManager.ClearTimer(handle);
```

Do not use it for damage, cooldowns, respawn, or any state that affects simulation. Store those
deadlines as networked Fusion `TickTimer` values.

### `MessageSubsystem`

Broadcasts typed application messages through hierarchical channels. Dispose every returned
`MessageSubscription` when its owner goes away. Messages decouple local services; they do not replace
Fusion replication.

### `WidgetSubsystem`

Owns the root UI layer, screens, windows, notifications, and loading screen across world travel. See
[UI and Widgets](ui.md).

## Built-in World subsystems

### `WorldMarkerSubsystem`

Finds active `WorldMarker` components, creates their widgets, and handles projection, range culling,
viewport checks, and occlusion in the current world's physics scene.

### `PresentationManager`

Pools ability-system presentation instances. It can play feedback locally or replicate a request
for a prefab mounted on every peer. Game-instance timers manage presentation lifetime only.

### `ProjectileWorldSubsystem`

Pools and simulates local projectile visuals for the Weapon module. It owns no replicated weapon
state and skips non-forward simulation where appropriate.

## Choosing the correct owner

- Choose `GameInstanceSubsystem` if the service must remain available while maps change.
- Choose `WorldSubsystem` if its state belongs to one runner or simulation scene.
- Choose `ActorComponent` if the behavior belongs to one replicated actor.
- Choose an ordinary C# object if automatic discovery and owner lifetime provide no benefit.
- Never use a subsystem to hide replicated mutable state outside Fusion.

Next: [GameInstance, Travel, and Bootstrap](game-instance-travel.md).
