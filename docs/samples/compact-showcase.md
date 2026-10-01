# Compact Multiplayer Showcase

The showcase is a small multiplayer arena containing movement, abilities, attributes, effects,
inventory, equipment, weapons, interaction, UI, world markers, moving platforms, teleporters, hazards,
and a respawning training dummy.

## Import and run

1. Import **Compact Multiplayer Showcase** from the RedEngine package Samples tab.
2. Run **RedEngine > Samples > Configure Compact Showcase**.
   This adds the sample definitions and damage-number presentation to the `RedEngineShowcase`
   Addressables label and mounts it at startup. The Addressables group includes GUID catalog keys.
   A project with empty `EngineSettings` is configured automatically on import. In an already
   configured project, use this menu command to connect the sample. Existing preload labels,
   Addressables groups, gameplay tags, and logger settings are preserved.
3. Configure the Photon App Id.
4. Open `RedEngineShowcaseMainMenu`.
5. Start Play Mode with at least two Fusion peers.

The configuration step sets Fusion **Peer Mode** to **Multiple**, which is required when the editor
runs a server and a local client together. Re-run it if the project was previously set to **Single**.
Each runner has its own temporary `Peer ...` scene in the Hierarchy; these scenes keep their physics
worlds separate and are not additional scene assets.

## What to test

- switch input between peers and move each character;
- expand the selected `Peer ...` scene in Hierarchy to inspect its walls, pickups, and characters;
- aim at a pickup to show its marker, then press E to collect it and confirm the inventory updates;
- sprint, jump, and watch replicated stamina;
- collect the blaster and confirm it equips automatically; press its inventory number to unequip it,
  press again to re-equip it, then fire and reload;
- collect potions and press keys 1–3 to use their current inventory slots;
- ride the moving platform, cross ice, and use teleporters;
- enter lava and observe periodic damage plus movement impulses;
- damage the dummy and observe its marker, feedback, death, and replacement by `RespawnPoint` after two seconds;
- confirm the three dummies appear at their scene respawn points on both server and client;
- move between menu, instructions, loading screen, and arena HUD.
- choose a player color before entering the arena, then confirm the character uses it;
- enter an existing Fusion session name (for example, `Default`) or a connection URL such as `localhost:27015?Session=Default`, then select **JOIN SERVER**;
- verify that an unavailable session opens a dismissible connection error screen;
- press Escape in the arena to open the pause menu: the hidden, centered cursor becomes free and visible; resuming captures it again.

The session name must match the server's `-serverName` value. The showcase joins Fusion sessions by name; the host in a connection URL selects client travel mode.

## Read the project in this order

1. `ShowcaseGameMode` — join, character spawn, player color, and HUD.
2. `ShowcasePlayerController` — per-player character checks and tick-timed respawn.
3. `ShowcaseCharacter` — component composition and attributes.
4. `SprintAbility` and `ShowcaseBurningEffect` — gameplay actions.
5. `PickupItem`, `RespawnPoint`, `ConsumeAbility`, `EquipAbility`, and `UnequipAbility` — interaction and items.
6. `ShowcaseHud` and marker widgets — presentation.

Continue with a focused walkthrough: [Ability](ability-sample.md),
[Inventory](inventory-sample.md), [UI](ui-sample.md), or
[Networking and Movement](networking-movement-sample.md).
