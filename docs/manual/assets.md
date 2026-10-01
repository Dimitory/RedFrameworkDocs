# Assets and content labels

`ContentManager.InitializeAsync` initializes Addressables and mounts the labels listed in
`ContentSettings.preloadContentLabels`. Mount other labels before networked objects refer to their
definitions or presentation prefabs. Mounted labels stay available until `Shutdown`.

```csharp
var label = new ContentLabel("Gameplay");
await ContentManager.DownloadContentLabelAsync(label);
await ContentManager.MountContentLabelAsync(label);
var definition = ContentManager.Resolve<NetworkScriptableObject>(guid);
```

Every mounted main asset uses its Unity `.meta` GUID as network identity. Addressables groups must
include GUIDs in the catalog. The mount fails if a location has no unique GUID, if an asset
cannot load, or if a label contains duplicate GUIDs. Prefab component references resolve from
the mounted GameObject. `NetworkScriptableObject` and `PresentationBehaviour` store their GUID
in serialized fields; the editor synchronizes these fields when assets are imported or moved.

`ContentManager.Resolve<T>(AssetReference)` resolves a direct `StaticAssetReferenceProvider`
object or a GUID in a mounted label; it returns null when neither is available. For independent
loading through a Resources or Addressables provider, use `AssetReference<T>.LoadAssetAsync()` and
release its handle after use. Direct and independently loaded assets do not register for network
deserialization: network assets must be in a mounted label on every peer.

`ContentManager.Shutdown()` releases mounted labels, download handles, scene discovery, and
Addressables initialization. Stop game instances and destroy content users before shutdown.
