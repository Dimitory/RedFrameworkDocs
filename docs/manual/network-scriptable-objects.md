# Network ScriptableObjects

Derive definitions from `NetworkScriptableObject`. The serialized `NetworkGuid` is synchronized
with the Unity asset GUID by the editor. Place each definition in an Addressables label mounted
on every peer before it is sent over Fusion. Presentation prefabs use the same scheme.

`NetworkWrap` serializes the source GUID. `NetworkUnwrap` resolves the mounted prototype and
returns null when that GUID is unavailable. Prototypes should remain immutable. For mutable
local state, create and later destroy a runtime copy:

```csharp
var instance = NetworkScriptableObject.CreateRuntimeInstance(definition);
UnityEngine.Object.Destroy(instance);
```

The copy retains its source GUID, but its mutations are not replicated. Store replicated state
in Fusion networked fields.
