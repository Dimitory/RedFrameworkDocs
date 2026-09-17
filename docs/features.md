# Features

Start with the problem you are solving, not the assembly list.

## Build the game loop

- **Application and world lifecycle** — boot content, travel between Fusion scenes, and host
  scene-scoped subsystems. Start with [GameInstance, Travel, and Bootstrap](game-instance-travel.md).
- **Session rules and player admission** — authorize players, create controllers and characters,
  choose spawn points, and drive match states. See [GameMode pipeline](game-mode.md).
- **Actors and components** — model replicated objects with clear spawn, authority, and lifetime
  rules. See [Core runtime](core-runtime.md#gameinstance-world-and-actors).
- **Input** — map Input System actions to stable network channels and route them through contexts.
  Begin with [Your first multiplayer scene](first-multiplayer-scene.md#add-input).

## Add player capabilities

- **Gameplay tags** — keep strongly typed domains separate and attach domain-specific metadata. See
  [Gameplay Tags](gameplay-tags.md).
- **Attributes and effects** — build formulas, dependency chains, modifiers, costs, buffs, and periodic
  state changes. See [Attributes and Effects](attributes-effects.md).
- **Gameplay abilities** — build reusable actions that remain safe under prediction and rollback. See
  [Gameplay Abilities](gameplay-abilities.md).
- **Movement and combat** — use the character controller, movement bases, ranged, melee, and throwable
  weapons. See [Movement and combat](movement-combat.md).
- **Interaction** — scan, select, and activate authoritative world interactions. See
  [Inventory, equipment, and interaction](gameplay-items.md#redenginegameplayinteraction).

## Give players things

- **Inventory** — replicate item stacks with slot or tetris layouts.
- **Equipment** — bind inventory items to gameplay slots and granted abilities.
- **Asset-backed definitions** — author deterministic items and other shared data as ScriptableObjects.

Follow [Inventory, equipment, and interaction](gameplay-items.md) for the full path.

## Ship the experience

- **UI** — compose widgets, layers, screen stacks, windows, notifications, loading screens, and variable
  bindings. See [UI and Widgets](ui.md).
- **Addressables and content packs** — load assets through one provider-based API and release handles
  predictably.
- **Diagnostics and console** — configure hierarchical log channels and expose development commands
  in-game. See [Diagnostics and Developer Console](diagnostics-console.md).

The [Compact Multiplayer Showcase](getting-started.md#2-import-the-showcase) demonstrates these systems
together. Treat it as an executable recipe, then use the reference pages for details.
