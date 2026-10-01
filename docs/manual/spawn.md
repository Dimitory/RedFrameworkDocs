# Spawn

RedEngine builds on Photon Fusion 2. Gameplay changes belong to Fusion ticks and authority rules;
RedEngine supplies world ownership, player admission, scene travel, input routing, and focused gameplay
modules around that simulation.

## Authority

- State authority validates joins, spawns actors, applies damage, changes inventory, and advances match
  state.
- Input authority supplies `NetworkInputData` for its controller and character.
- Proxies render replicated state and local presentation without authoring gameplay outcomes.

Check authority at the boundary of a mutation, not inside every getter:

```csharp
if (!Object.HasStateAuthority)
    return;

World.SpawnActor(projectilePrefab, muzzle.position, muzzle.rotation);
```

## Travel and scenes

Use `GameInstance.BrowseAsync` to replace the current world. Use `World.LoadSceneAsync` and
`World.UnloadSceneAsync` for synchronized additive levels inside the same match.

## Deterministic time

Store gameplay deadlines as `[Networked] TickTimer`. `TimerManager`, coroutines, `Task.Delay`, and wall
clock time are for local presentation only.

`RespawnPoint` is the built-in actor respawner. Assign an actor asset and a delay; State Authority spawns
it at the point transform, tracks the actor, and starts the replicated delay only after it despawns.

## Player pipeline

Fusion join → authorization → controller spawn → `OnPlayerJoined` → spawn-point selection → character
spawn. Customize the narrowest `GameModeBase` hook and keep network mutation on authority.

See [GameInstance and Travel](game-instance-travel.md) and [GameMode Pipeline](game-mode.md).

Next: [Input](input.md).
