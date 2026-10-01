# API Reference

RedEngine is split into focused runtime assemblies. Reference only the modules used by your code.

| Assembly | Primary entry points |
| --- | --- |
| `RedEngine.Core` | `GameInstance`, `World`, `GameModeBase`, `Actor`, `ActorComponent`, input, subsystems |
| `RedEngine.Assets` | `ContentManager`, `AssetReference<T>`, `ContentLabel`, `ContentTable`, `NetworkScriptableObject`, `AssetGuid` |
| `RedEngine.Configuration` | `ApplicationSettings`, `ConfigurationSectionAttribute` |
| `RedEngine.Diagnostics` | `Logger`, `LogChannel`, `LoggerSettings`, `ILogReceiver` |
| `RedEngine.Console` | `ConsoleCommandAttribute`, `ConsoleRegistry`, argument parsers |
| `RedEngine.Gameplay.GameplayTags` | typed gameplay tags, registry, containers, requirements |
| `RedEngine.Gameplay.AbilitySystem` | abilities, attributes, effects, presentation |
| `RedEngine.Gameplay.Inventory` | definitions, instances, fragments, schemas, layouts |
| `RedEngine.Gameplay.Equipment` | equipment layouts, character equipment, instances |
| `RedEngine.Gameplay.Interaction` | `InteractAbility`, `IInteractable`, `Door`, `PickupItem` |
| `RedEngine.Gameplay.Movement` | character controller, motor, surfaces, environments, movement bases |
| `RedEngine.Gameplay.Weapon` | ranged, melee, throwable weapons and weapon abilities |
| `RedEngine.UI` | widgets, screens, windows, notifications, world markers |
| `RedEngine.Foundation` | network models and replicated collections used by higher modules |

## Common lookup paths

```csharp
GameInstance instance = GameInstance.PrimaryGameInstance!;
World world = instance.CurrentWorld;

WidgetSubsystem? widgets = instance.GetSubsystem<WidgetSubsystem>();
WorldMarkerSubsystem? markers = world.GetSubsystem<WorldMarkerSubsystem>();
```

The public documentation does not replace IntelliSense or the package XML comments. Use this page to
find the owning assembly, then use the Manual for runtime semantics.
