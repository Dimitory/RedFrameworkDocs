# Framework Overview

Here is the mental model to keep beside you while exploring the sample.

## From launch to gameplay

1. `Bootstrap` loads the default `EngineSettings` from `Resources`.
2. Content providers initialize.
3. RedEngine creates the configured `GameInstance`.
4. The game instance creates a Fusion runner and travels to the selected scene.
5. A `World` wraps the active simulation scene.
6. On the server, the world finds the scene's `GameModeBase` actor.
7. The game mode creates player controllers and characters as players join.

The scene contains the game mode actor directly. Give it a `NetworkObject`, configure its player
controller and character prefabs, and register spawnable prefabs with Fusion.

![Placeholder: RedEngine runtime lifecycle](/images/runtime-overview-placeholder.svg)

## Where code belongs

| Concern | Typical home |
| --- | --- |
| Startup and travel | `RedEngine.Runtime`, `GameInstance` |
| Player admission and match rules | `GameModeBase` |
| Scene-scoped services | `World` subsystems |
| Replicated entities | `Actor` and `ActorComponent` |
| Tick input | `InputSettings`, `InputContext`, `NetworkInputData` |
| Abilities and effects | `RedEngine.Gameplay.AbilitySystem` |
| Items and loadout | Inventory and Equipment modules |
| Player-facing screens | `RedEngine.UI` |
| Content loading | `RedEngine.Assets` |
| Logs and commands | Diagnostics and Console modules |

## The network rule of thumb

If a value affects the outcome of gameplay, store and update it in Fusion state. A cooldown or respawn
deadline belongs in a networked `TickTimer`. `World.TimerManager`, Unity coroutines, wall-clock time, and
`Task.Delay` are suitable for local presentation cleanup, not replicated state transitions.

## Modules stay optional

Assemblies are deliberately narrow. A project can use Core without Inventory, or Inventory without the
authoring graph tools. Reference the smallest set you need; this keeps dependencies legible and avoids
pulling editor APIs into runtime code.

Next: [Your first multiplayer scene](first-multiplayer-scene.md).

Deep dives: [GameInstance, Travel, and Bootstrap](game-instance-travel.md) ·
[GameMode pipeline](game-mode.md).
