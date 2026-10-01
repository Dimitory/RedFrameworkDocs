# Game configuration

`RedEngine.Configuration` provides one root `EngineSettings` asset composed from modular
`ConfigurationSection` ScriptableObject sub-assets. The default asset is created at
`Assets/Resources/EngineSettings.asset` and loaded before gameplay starts.

## Declare a section

Sections may live in any runtime module. Derive from `ConfigurationSection` and add
`ConfigurationSectionAttribute` so it appears in the Editor's section menu.

```csharp
using RedEngine.Configuration;
using UnityEngine;

[ConfigurationSection("Video")]
public sealed class VideoConfiguration : ConfigurationSection
{
    [SerializeField] private bool fullscreen = true;

    public bool Fullscreen => fullscreen;
}
```

The attribute is discovered through `UnityEditor.TypeCache` exclusively in
`RedEngine.Configuration.Editor`. Player builds load serialized section references and build a
type-keyed lookup without scanning assemblies or constructing types through reflection.

Select `EngineSettings`, press **Add Section**, and choose the section type explicitly. The
Editor creates it as a sub-asset of that configuration. No section is added or removed automatically;
the add menu omits types that are already present.

## Read configuration

Bootstrap loads the default asset before content or game instances are initialized:

```csharp
EngineSettings? settings = ApplicationSettings.GetDefault<EngineSettings>();
VideoConfiguration? video = settings?.Get<VideoConfiguration>();
if (settings != null && settings.TryGet<VideoConfiguration>(out var sameVideo))
    Debug.Log(sameVideo.Fullscreen);
```

Both APIs use a dictionary populated during initialization, so calls do not repeatedly search the
asset or use reflection.

## React to changes

Listen on a specific section or across the active configuration:

```csharp
video.Changed += RefreshVideo;
ApplicationSettings.OnConfigurationSectionChanged += OnConfigurationSectionChanged;
```

Call `NotifyChanged()` after changing a section from code. Inspector changes notify listeners
automatically, including while the Editor is in Play Mode. Notifications are event-driven and do
not poll.
