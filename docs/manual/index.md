# Manual

The Manual examines each RedEngine system independently. It assumes the project already enters Play
Mode and concentrates on ownership, runtime behavior, and the APIs used by application code.

Follow the sections in dependency order:

**Core → Subsystems → Configuration → GameInstance & Travel → GameMode → Spawn & Networking → Input → Gameplay Tags → Abilities → Attributes & Effects → Inventory → Equipment → Interaction → Character Controller → Weapon → Feedback → UI → Assets → Network ScriptableObjects → Diagnostics → Developer Console → Authoring**

## Authority notes

Pages involving replicated gameplay explain authority and prediction wherever they affect an API's
correct use. Local tooling, UI, content loading, diagnostics, and editor workflows omit those notes
when they do not apply. Unless an operation is explicitly documented as prediction-safe, mutate
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

For a smaller implementation exercise before a complete system guide, follow a focused
[Recipe](../learn/recipes/index.md). Consult [Reference](../reference/index.md) for signatures,
annotations, limits, and generated members.
