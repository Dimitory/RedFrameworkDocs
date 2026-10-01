# Release Notice

## RedEngine 1.0.0

Initial public release of RedEngine.

### Highlights

- Unity 6 and Photon Fusion 2 application/world lifecycle;
- tick-driven input, actors, player controllers, and game modes;
- gameplay tags, attributes, effects, and abilities;
- replicated inventory and equipment built on generated network models;
- ranged, melee, and throwable weapon paths;
- provider-based assets, network ScriptableObject references, UI, diagnostics, and console tooling;
- a Compact Multiplayer Showcase that connects the main systems in one playable sample.

### Before upgrading

1. Commit or back up the game project.
2. Read the [full changelog](changelog.md) supplied with the release.
3. Let Unity finish compilation before fixing assets or prefabs.
4. Check `.asmdef` references; gameplay modules no longer depend on a monolithic gameplay assembly.
5. Run the project in Fusion Multi-Peer and verify authority-sensitive flows such as abilities,
   inventory, equipment, projectiles, and respawn.

::: warning API stability
Module stability annotations describe current intent, not a promise that every public API is final.
:::
