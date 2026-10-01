# Features

Start with the problem you are solving, not the assembly list.

## Build the game loop

- **Application and world flow** — boot content, travel between Fusion scenes, and stream additive
  levels. Start with [GameInstance, Travel, and Bootstrap](game-instance-travel.md).
- **Subsystems** — host application-wide or world-scoped services with automatic initialization and
  cleanup. See [Subsystems](subsystems.md).
- **Game configuration** — compose settings from module-owned ScriptableObject sections with cached
  typed lookup and Editor synchronization. See [Game configuration](configuration.md).
- **Session rules and player admission** — authorize players, create controllers and characters,
  choose spawn points, and drive match states. See [GameMode pipeline](game-mode.md).
- **Actors and components** — model replicated objects with clear spawn, authority, and lifetime
  rules. Begin with [Your first scene](../learn/first-multiplayer-scene.md).
- **Input** — map Input System actions to stable network channels and route them through contexts.
  Begin with [Your first multiplayer scene](../learn/first-multiplayer-scene.md#add-input).

## Add player capabilities

- **Gameplay tags** — keep strongly typed domains separate and attach domain-specific metadata. See
  [Gameplay Tags](gameplay-tags.md).
- **Attributes and effects** — build formulas, dependency chains, modifiers, costs, buffs, and periodic
  state changes. See [Attributes and Effects](attributes-effects.md).
- **Gameplay abilities** — build reusable actions that remain safe under prediction and rollback. See
  [Gameplay Abilities](abilities.md).
- **Movement and combat** — use the character controller, movement bases, ranged, melee, and throwable
  weapons. See [Character Controller](character-controller.md) and [Weapon](weapon.md).
- **Feedback** — play audio, particles, camera response, and other local reactions without making
  presentation authoritative. See [Feedback](feedback.md).
- **Interaction** — scan, select, and activate authoritative world interactions. See
  [Interaction](interaction.md).

## Give players things

- **Inventory** — replicate item stacks with slot or tetris layouts.
- **Equipment** — bind inventory items to gameplay slots and granted abilities.
- **Asset-backed definitions** — author deterministic items and other shared data as ScriptableObjects.

Follow [Inventory](inventory.md) and [Equipment](equipment.md) for the full path.

## Ship the experience

- **UI** — compose widgets, layers, screen stacks, windows, notifications, loading screens, and variable
  bindings. See [UI and Widgets](ui.md).
- **Addressables content labels** — mount content and resolve assets by stable GUID. See
  [Assets](assets.md).
- **Network asset identity** — resolve authored ScriptableObject definitions by their Unity asset GUID.
  See [Network ScriptableObjects](network-scriptable-objects.md).
- **Diagnostics** — configure hierarchical log channels and receiver destinations. See
  [Diagnostics](diagnostics.md).
- **Developer Console** — expose typed development commands in-game. See
  [Developer Console](developer-console.md).

The [Compact Multiplayer Showcase](../learn/getting-started.md#import-the-showcase) demonstrates these systems
together. Treat it as an executable recipe, then use the reference pages for details.
