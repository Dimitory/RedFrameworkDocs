# Configuration

RedEngine configuration consists of module-owned ScriptableObject sections within a default
application settings asset.

## EngineSettings

Keep one active `EngineSettings` in a `Resources` folder. The Compact Showcase includes
`Content/Resources/ShowcaseEngineSettings.asset`; a project's `Assets/Resources/EngineSettings.asset`
takes precedence when present. Open the active asset with **Tools > RedEngine > Engine Settings**.
The asset only owns explicitly selected module sections; it does not duplicate their fields.

```csharp
EngineSettings? settings =
    ApplicationSettings.GetDefault<EngineSettings>();
```

## Module configuration

Modules declare configuration sections with `[ConfigurationSection]`. Select the root asset and use
**Add Section** to add each required section as a sub-asset. The Editor discovers menu entries with
`TypeCache`, but never adds or deletes sections automatically. Typed runtime lookups are cached.

The built-in sections are owned by their modules:

- `RedEngine.Core.CoreSettings` — game instance, runner, startup maps, and server port;
- `RedEngine.Assets.ContentSettings` — content initialization;
- `RedEngine.UI.UISettings` — root widget layer and loading screen;
- `RedEngine.Diagnostics.LoggerSettings` — logging policy.

`GameplayTagRegistry` remains a separate `Resources/GameplayTagRegistry.asset`; it is not an
`EngineSettings` section.

The complete authoring workflow is in [Game configuration](../manual/configuration.md).
