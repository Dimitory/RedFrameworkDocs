# Editor modules

Editor assemblies run only inside the Unity Editor. Runtime game `.asmdef` files must not
reference them. Most projects can use these tools without writing editor code; the extension points
below are for teams building their own validation and authoring workflow.

## RedEngine.Editor

Provides shared property drawers, the asset change dispatcher, the Multi-Peer toolbar, and
stability badges. Create a custom watcher as a regular class with a parameterless
constructor:

```csharp
#if UNITY_EDITOR
using RedEngine.Editor;
using RedEngine.Core;
using UnityEngine;

public sealed class EngineSettingsWatcher : AssetChangeWatcher<EngineSettings>
{
    public override void OnAssetsChanged()
    {
        Debug.Log("Engine settings changed");
    }
}
#endif
```

The dispatcher discovers the watcher through `TypeCache` and invokes it after importing,
moving, or deleting an asset of the watched type. Place this code in an editor-only
assembly.

## RedEngine.Assets.Addressables.Editor

Watches Addressables settings and synchronizes the RedEngine catalog. You normally do not
need to invoke this module manually. For a complete rebuild, use
`RedEngine > Assets > Rebuild Asset Catalog`.

## RedEngine.Graph.Editor.GraphToolkit

Creates and opens the `.redgraph` document associated with a runtime graph asset. An editor
node representation must map to a concrete runtime `GraphNode`; required nodes should not
appear in the palette or be removable. See [Graph and Inspector](authoring-tools.md) for a
runtime node example.

This assembly is compiled only when the optional `com.unity.graphtoolkit` package 0.4.0 or
newer is installed.

## RedEngine.Welcome.Editor

Shows the welcome window and links to initial package setup. This is a UX module; gameplay
must not depend on it. When required installation steps change, update the welcome window,
[Installation and startup](getting-started.md), and the root `README.md` together.

## Other editor code

The `Editor/RedEngine.Assets`, `Editor/RedEngine.Core`,
`Editor/RedEngine.Diagnostics`, and `Editor/RedEngine.Inspector` directories are part of the
shared `RedEngine.Editor` assembly. They contain property drawers, postprocessors, the
Fusion configurator, and console hyperlink support rather than separate runtime modules.
