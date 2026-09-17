# Assets and Serialization

Come here when a prefab, scene, or ScriptableObject needs to survive beyond a direct inspector
reference. The practical rule is simple: load through `RedEngine.Assets`, keep the returned handle for
as long as you use the content, and release it when that ownership ends.

## ContentManager and RedEngine.Assets

`ContentManager` is the startup and ownership boundary for project content. It supports Unity
Addressables, classic Unity `AssetBundle` files delivered through a platform manifest, scenes from the
Build Profile or Addressables, and stable network references to ScriptableObjects.

RedEngine does not rename AssetBundles or hide them behind its own file format. Remote bundles are
ordinary Unity AssetBundles. Their manifest, dependency graph, hashes, download, mount, preload, and
release operations are coordinated through Unity's Addressables `ResourceManager` and exposed as
`AsyncOperationHandle` values.

### Initialization API

Bootstrap initializes content automatically from `EngineSettings`, but tools and isolated runtimes can
call the API directly:

```csharp
using RedEngine.Assets;

bool initialized = await ContentManager.InitializeAsync(ContentInitializationOptions.Default, cancellationToken);
if (!initialized)
    return;
```

Supported lifecycle API:

| API | Use |
| --- | --- |
| `InitializeAsync(options, token)` | Await the complete initialization pipeline |
| `InitializeOperation(options)` | Receive the underlying `AsyncOperationHandle<bool>` |
| `State` / `OnStateChanged` | Drive a loading UI from individual initialization stages |
| `Shutdown()` | Release initialization, bundles, network assets, and scene tracking |

Initialization can initialize Addressables, check/update catalogs, load the remote AssetBundle
manifest, preload selected bundles, resolve scenes, and preload the network ScriptableObject table.

### AssetReference API

A typed reference delegates loading to a serialized provider. The editor selects Addressables,
Resources, or static providers automatically from the assigned asset:

```csharp
[SerializeField] private AssetReference<GameObject> enemyReference = new();

AsyncOperationHandle<GameObject> handle = enemyReference.LoadAssetAsync();
handle.Completed += completed =>
{
    if (completed.Status == AsyncOperationStatus.Succeeded)
        SpawnVisual(completed.Result);
};

// Call when this owner no longer needs the loaded asset.
enemyReference.ReleaseAsset();
```

`StaticAssetReferenceProvider` keeps the referenced object available and does not own its
lifetime. `ResourceAssetReferenceProvider` and `AddressableAssetReferenceProvider` own their
operation handles until `ReleaseAsset` is called. `AssetReference<T>.LoadAssetAsync()` returns
an `AsyncOperationHandle<T>` for every provider, so callers do not need source-specific branches.
Additional sources can derive from `AssetReferenceProvider`. A reference owns at most one active
operation handle; loading the same instance twice logs an error and returns its existing handle.

### AssetBundle API

Set `remoteContentUrl` to the directory containing the platform manifest and bundle files. Supported
platform folders are `android`, `ios`, `windows`, `macos`, and `webgl`. Enable
`updateManifestOnInitialization`, or request it manually before mounting:

```csharp
var bundle = new AssetBundleReference("arena");

AsyncOperationHandle<AssetBundleManifest> manifest =
    ContentManager.UpdateManifestAsync();

await manifest.Task;
if (manifest.Status != AsyncOperationStatus.Succeeded)
    return;

AsyncOperationHandle<AssetBundle> mount = bundle.MountAsync(
    AssetBundleMountOptions.CheckCRC | AssetBundleMountOptions.PreloadAssets);

await mount.Task;
if (mount.Status == AsyncOperationStatus.Succeeded)
    UseMountedBundle(mount.Result);
```

The supported bundle surface is intentionally small:

- `ContentManager.UpdateManifestAsync()` downloads the current platform manifest;
- `ContentManager.MountAsync(reference, options)` mounts the requested bundle and dependencies;
- `AssetBundleReference.MountAsync(options)` retains the mount handle on the reference;
- `PreloadAssetsAsync` / `LoadAllAssetsAsync` loads all objects from a mounted bundle;
- `IsMounted(reference)` checks the central mount table;
- `AssetBundleReference.Release()` releases handles owned by that reference;
- `ContentManager.Shutdown()` releases the central bundle ownership.

Add frequently used references to `ContentInitializationOptions.preloadBundles`. A bundle cannot mount
until its manifest is loaded. `PreloadAssets` trades a longer mount for predictable first access;
`CheckCRC` requests Unity integrity validation.

![Placeholder: ContentManager AssetBundle pipeline](/images/content-manager-bundles-placeholder.svg)

### Scene API

Load scenes with `SceneReference.LoadAsync` and unload them with `UnloadAsync`.

```csharp
Scene arena = await arenaScene.LoadAsync(LoadSceneMode.Additive, cancellationToken);
if (arena.IsValid())
    await arenaScene.UnloadAsync(cancellationToken);
```

Scene references resolve either a Build Profile index/path or an Addressable scene labeled `Scene`.
`GameInstance` uses the same resolver before starting Fusion travel.

### Network ScriptableObjects

Network-replicated definitions derive from `NetworkScriptableObject` instead of using an
attribute:

```csharp
[CreateAssetMenu(menuName = "Game/Damage Definition")]
public sealed class DamageDefinition : NetworkScriptableObject
{
    public int Damage;
}
```

Label every participating asset `NetworkScriptableObject`. The
`Assets/Resources/NetworkScriptableObjects.redassets` source is imported by
`NetworkScriptableObjectTableImporter`; its generated main object is a
`NetworkScriptableObjectTableAsset`. Generated entries live only in Unity's import database,
so no parallel generated `.asset` file is created.

The imported asset stores only a list of `AssetReference<NetworkScriptableObject>` values.
The importer assigns each reference its Unity GUID and automatically selects a static,
Resources, or Addressables provider. `ContentManager.InitializeAsync` preloads every table
reference before entering the ready state. There is no separate network-source interface or
source hierarchy. The runtime `Table` is a bidirectional identity index:

```csharp
AssetReferenceTable<NetworkScriptableObject>? table = NetworkScriptableObjectTableAsset.Table;
DamageDefinition? resolved = table?.Resolve<DamageDefinition>(reference);
```

`NetworkAssetReference` is the standalone 128-bit network identity. It stores only two
64-bit words and does not wrap `NetworkObjectGuid`, asset paths, or loading addresses.
Changes to the labeled asset list or Addressables configuration update RedEngine custom
dependencies and reimport the source.
Run `Tools > RedEngine > Rebuild Network Asset Table` to force a rebuild. Direct Fusion
serialization hooks for `[Networked] NetworkScriptableObject` values are intentionally left
for a later iteration.

The editor also marks the generated source with Fusion's `FusionDefaultGlobal` label. If the source
is missing or invalid, serialization returns an invalid `AssetGuid` and content initialization reports
a failed operation instead of throwing from `FusionGlobalScriptableObject.GlobalInternal`.

The `RedEngine.Assets` editor integration maintains the property drawers, table, catalog,
and change tracking.

## RedEngine.Serialization

This module provides Newtonsoft.Json converters for polymorphic models and string-backed
types. Give derived types stable names with an attribute:

```csharp
using RedEngine.Serialization;

[JsonTypeName("damage")]
public sealed class DamagePayload : EventPayload
{
    public float Value;
}
```

Register an appropriate `PolymorphicJsonConverter<TBase>` in `JsonSerializerSettings`. Do
not rename a discriminator that has already been persisted without migrating the data.
