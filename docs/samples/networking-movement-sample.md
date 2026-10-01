# Networking and Movement Sample

The showcase provides a practical test bed for authority, prediction, and scene-isolated presentation.

## Things to inspect

- `ShowcasePlayerController` tracks its character on authority and schedules respawn with a networked `TickTimer`; `ShowcaseGameMode` replaces the character.
- The moving platform updates on Fusion ticks and exposes `MovementBase` behavior to characters.
- Ice modifies movement through a surface volume rather than editing the character.
- Teleporters and lava use trigger contracts and authoritative state changes.
- Each Multi-Peer world resolves its own camera, physics scene, markers, and UI output.

## Verification exercise

Run two peers and alternate the selected input peer. Ride the platform, cross ice, use a
teleporter, and enter lava. Compare final positions and health from both peers. If they diverge, inspect
whether the changed state is updated on Fusion ticks and owned by state authority.

Continue with [Manual: Spawn & Networking](../manual/spawn.md) and
[Manual: Character Controller](../manual/character-controller.md).
