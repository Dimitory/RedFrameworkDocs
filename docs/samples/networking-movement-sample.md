# Networking and Movement Sample

The showcase provides a reproducible environment for examining authority, prediction, and
scene-specific presentation.

## Things to inspect

- `ShowcasePlayerController` tracks its character on authority and schedules respawn with a networked `TickTimer`; `ShowcaseGameMode` replaces the character.
- The moving platform updates on Fusion ticks and exposes `MovementBase` behavior to characters.
- Ice modifies movement through a surface volume rather than editing the character.
- Teleporters and lava use trigger contracts and authoritative state changes.
- Each Multi-Peer world resolves its own camera, physics scene, markers, and UI output.

## Verification exercise

Run two peers and switch the selected input peer. Ride the platform, cross ice, use a teleporter, and
enter lava. Compare final positions and health on both peers. If results diverge, confirm that the
affected state changes on Fusion ticks under State Authority.

Continue with [Manual: Spawn & Networking](../manual/spawn.md) and
[Manual: Character Controller](../manual/character-controller.md).
