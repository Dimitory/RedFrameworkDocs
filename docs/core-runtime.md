# Core and Runtime

This is the framework's backbone. Read it after the first-scene tutorial when you need to decide
whether a service belongs to the whole application, the current network world, or one actor.

For the complete startup and session flows, use [GameInstance, Travel, and Bootstrap](game-instance-travel.md)
and [GameMode pipeline](game-mode.md). This page remains the compact API reference.

## RedEngine.Core

### GameInstance, World, and actors

`GameInstance` lives at the application level, while `World` belongs to the active Fusion
simulation scene. Networked game objects derive from `Actor`, and their networked
components derive from `ActorComponent`.

```csharp
using RedEngine.Core;

public sealed class Chest : Actor
{
    public void Open()
    {
        if (!HasAuthority)
            return;

        // Authoritative gameplay logic.
    }
}

public sealed class HealthComponent : ActorComponent
{
    public override void Spawned()
    {
        base.Spawned();
        // Owner is now resolved.
    }
}
```

Spawn actors through an authoritative `World`:

```csharp
Chest? chest = World.SpawnActor(
    chestPrefab,
    transform.position,
    transform.rotation,
    inputAuthority: null);

chest?.Destroy();
```

### Subsystems

Put world-owned state in a `WorldSubsystem` and application-wide state in a
`GameInstanceSubsystem`.

```csharp
using RedEngine.Core;

public sealed class ScoreSubsystem : WorldSubsystem
{
    public override void Initialize(ISubsystemCollection collection)
    {
        base.Initialize(collection);
    }
}

ScoreSubsystem scores = World.GetSubsystem<ScoreSubsystem>();
```

A subsystem may derive from Fusion `SimulationBehaviour`. `SubsystemCollection` creates such
subsystems on the active `NetworkRunner`, registers the subsystem itself with `AddGlobal`, and
unregisters it during deinitialization. A separate driver component is not required.

### Timers

Use `World.TimerManager` for non-replicated callbacks that should advance with forward
Fusion simulation, such as presentation cleanup:

```csharp
using RedEngine.Core.Timers;

TimerHandle handle = World.TimerManager.SetTimer(Regenerate, 1f, loop: true);
World.TimerManager.ClearTimer(handle);
```

The manager deliberately skips resimulation and does not store rollback state. For gameplay
timers, store a Fusion `TickTimer` in `[Networked]` state and evaluate it from
`FixedUpdateNetwork`. Do not use `TimerManager`, `Task.Delay`, wall-clock time, or a Unity
coroutine to mutate replicated state.

### Message bus

`MessageSubsystem` belongs to `GameInstance`. Channels are declared through the registry,
and `MessageSubscription` must be disposed. Use the message bus for loosely coupled
application events; replicated gameplay state must still live in Fusion state.

### Input

`InputSettings` defines the fixed mapping from Unity Input Actions to `NetworkInputData`.
`InputContext` connects a network channel and an `InputTrigger` to a method on the input
object or possessed character. See [Installation and startup](getting-started.md) for the
complete setup.

## RedEngine.Runtime

`Bootstrap` initializes settings, content, and game instances and exposes the selected
`PrimaryGameInstance`. This is an infrastructure assembly; game code normally does not
need to invoke the bootstrap manually.

```csharp
using RedEngine.Runtime;

GameInstance? activeInstance = Bootstrap.PrimaryGameInstance;
World? activeWorld = activeInstance?.CurrentWorld;
```

In Multi-Peer mode, these properties change when the selected player changes.
