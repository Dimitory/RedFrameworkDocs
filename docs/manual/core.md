# Core

RedEngine separates state by owner:

- `GameInstance` owns application services and survives map travel;
- `World` wraps one Fusion simulation and scene set;
- `GameModeBase` owns authoritative match and player rules;
- `Actor` and `ActorComponent` own replicated entity behavior;
- subsystem collections own shared services for a game instance or world.

Create and destroy network actors through `World` so they remain attached to the correct runner:

```csharp
Chest? chest = World.SpawnActor(chestPrefab, position, rotation);
chest?.Destroy();
```

Use `GameInstanceSubsystem` for services that survive travel and `WorldSubsystem` for services bound to
one simulation. Never keep a world subsystem after travel.

Detailed guides:

- [GameInstance, Travel, and Bootstrap](game-instance-travel.md)
- [GameMode Pipeline](game-mode.md)
- [Subsystems](subsystems.md)

Next: [Spawn & Networking](spawn.md).
