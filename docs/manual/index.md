# Manual

The Manual explains RedEngine one system at a time. It assumes the project can already enter Play Mode
and focuses on ownership, runtime behavior, and the APIs normally used by game code.

Follow the sections in dependency order:

**Core → Subsystems → Configuration → GameInstance & Travel → GameMode → Spawn & Networking → Input → Gameplay Tags → Abilities → Attributes & Effects → Inventory → Equipment → Interaction → Character Controller → Weapon → Feedback → UI → Assets → Network ScriptableObjects → Diagnostics → Developer Console → Authoring**

## Authority notes

Networking-sensitive pages call out authority and prediction where the distinction changes how an API
must be used. Pages for local tooling, UI, content loading, diagnostics, and editor workflows omit that
boilerplate. Unless a gameplay operation is explicitly documented as prediction-safe, mutate
replicated state only from State Authority.

## Gameplay features

- [Gameplay Tags](gameplay-tags.md)
- [Abilities](abilities.md)
- [Attributes & Effects](attributes-effects.md)
- [Inventory](inventory.md)
- [Equipment](equipment.md)
- [Interaction](interaction.md)
- [Character Controller](character-controller.md)
- [Weapon](weapon.md)
- [Feedback](feedback.md)

If the jump from the first game to a complete system guide feels too large, complete a focused
[Recipe](../learn/recipes/index.md) first. For signatures, annotations, limits, and generated members,
use [Reference](../reference/index.md).
