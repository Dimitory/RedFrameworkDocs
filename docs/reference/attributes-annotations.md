# Attributes and Annotations

These are RedEngine-specific annotations commonly used by game code. Fusion and Unity attributes keep
their original behavior.

## Gameplay and input

| Annotation | Target | Purpose |
| --- | --- | --- |
| `[GameplayTag]` | non-readonly partial struct | Generate a serializable, strongly typed tag domain |
| `[GameplayAttribute("Name")]` | field/property | Register an ability-system attribute |
| `[AttributeMin(value)]` | attribute field/property | Apply a static lower bound |
| `[AttributeMax(value)]` | attribute field/property | Apply a static upper bound |
| `[AttributeMaxBy("Other")]` | attribute field/property | Clamp using another attribute |
| `[AttributeFormula(typeof(MyFormula))]` | attribute field/property | Define a derived formula and dependencies |
| `[InputHandler]` | method | Expose a method to `InputContext` binding |

## Generated networking

| Annotation | Target | Purpose |
| --- | --- | --- |
| `[NetworkModel]` | partial class/struct | Generate a serializable network-state companion |
| `[Replicated(capacity)]` | mutable collection field | Generate Fusion storage for `ReplicatedCollection<T>` |
| Inventory `[Replicated]` | entity-fragment field | Generate fragment mutation and serialization code |
| Fusion `[Networked]` | network model member | Include a member in generated model state |

The two `ReplicatedAttribute` types live in different namespaces. Use
`RedEngine.Foundation.ReplicatedAttribute` for collections and
`RedEngine.Gameplay.Inventory.ReplicatedAttribute` for fragment fields.

## Configuration, console, and editor

| Annotation | Purpose |
| --- | --- |
| `[ConfigurationSection]` | Register a module configuration section |
| `[ConsoleCommand]` | Discover a static or registered-instance command |
| `[CommandSuggestion]` | Provide fixed or provider-generated argument suggestions |
| `[ShowNetworked]` | Display network state through RedEngine inspector support |
| `[InlineScriptableObject]`, `[SubclassSelector]` | Improve polymorphic inspector authoring |

See [Generated code](generated-code.md) for the members created by generator-backed annotations.
