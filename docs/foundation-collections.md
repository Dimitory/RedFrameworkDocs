# Foundation, Collections, and Extensions

This page covers the small pieces used by several higher-level modules. Reach for it when you are
creating shared settings, a generated network model, or a replicated collection—not as a prerequisite
for the getting-started path.

## RedEngine.Foundation

Provides base settings, serializable member and method references, task dispatchers, pools,
time values, and network collection helpers.

Application settings derive from `ApplicationSettings` and load from `Resources`:

```csharp
using RedEngine.Foundation;
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Combat Settings")]
public sealed class CombatSettings : ApplicationSettings
{
    [field: SerializeField] public float BaseDamage { get; private set; } = 10f;
}

CombatSettings? settings = ApplicationSettings.GetDefault<CombatSettings>();
```

There must be exactly one asset of each settings type in `Resources`. To switch to the
Unity main thread:

```csharp
await TaskDispatcher.SwitchToMainThreadAsync(cancellationToken);
transform.position = Vector3.zero;
```

`NetworkModel` classes and structs declare their replicated payload with Fusion's
`Networked` attribute. The source generator emits an unmanaged nested `NetworkState`,
`ToNetworkState`/`ApplyNetworkState`, Fusion `NetworkWrap`/`NetworkUnwrap`, and a registered
`INetworkItemSerializer<T>`.
Reference-type models can then be stored in `NetworkModelArray<T>`:

```csharp
[NetworkModel]
public sealed partial class TargetState
{
    [Networked] public NetworkId TargetId { get; private set; }
    [Networked] public Tick AcquiredTick { get; private set; }
}
```

Members using Fusion `NetworkWrap`/`NetworkUnwrap` methods and nested `NetworkModel` members
are converted automatically. Other members must be unmanaged. Invalid members and conversion
pairs produce `REDNET001`/`REDNET003` compiler diagnostics. Reference-type nested models carry
an explicit presence flag, preserve `null`, and require an accessible parameterless constructor
(`REDNET002`). Runtime-only references stay on the model without `Networked`.

`ReplicatedCollection<T>` can be embedded directly in a partial `RedNetworkBehaviour`:

```csharp
[Replicated(MaxCapacity = 32)]
[SerializeField]
private ReplicatedCollection<TargetState> targets = new();
```

`MaxCapacity` fixes the generated Fusion `NetworkArray` size at weave time. The serialized
`Capacity` remains a logical per-prefab limit and must be between one and `MaxCapacity`.
Generated lifecycle hooks reconcile network state before simulation and flush dirty slots after
simulation, so gameplay code never handles the backing `NetworkArray` or raw buffers. `Set` marks
replacements dirty; after mutating an existing model call `SetDirty(index)`. Network reads compare
serialized words and explicit occupancy against a shadow state, preserving object identity and
reporting `Added`, `Removed`, or `Changed` through `CollectionChanged`. These notifications describe
the local Fusion projection and can repeat during rollback/resimulation; they are not irreversible
gameplay events.

## RedEngine.Collections

Provides `SparseArray<T>`, `MultiKeyDictionary`, `FixedArray4<T>`, the pooled
`ScopedList<T>`, and weighted selection.

```csharp
using RedEngine.Collections;

var loot = new WeightedRandomSelector<string>();
loot.Add("Potion", 70f);
loot.Add("Sword", 25f);
loot.Add("Relic", 5f);

string? selected = loot.SelectRandom(randomValue: 0.42f);

using ScopedList<int> temporary = ScopedList<int>.Rent();
temporary.Add(10);
temporary.Add(20);
```

Use a deterministic simulation RNG for `randomValue` whenever the result affects networked
state.

## RedEngine.Extensions

Contains small extension methods for Unity types, collections, reflection, tasks, and
Fusion. Reference the assembly directly when using these methods:

```csharp
using RedEngine.Extensions;
using UnityEngine;

Vector3 planar = velocity.OnlyXZ();
```

Check the exact signature in `Runtime/RedEngine.Extensions` before use. This module is
intentionally a collection of focused helpers rather than another gameplay abstraction
layer.
