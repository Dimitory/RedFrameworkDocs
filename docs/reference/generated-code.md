# Generated Code

RedEngine source generators turn concise declarations into deterministic networking and typed-domain
code. Generated files are compilation outputs; edit the declaration that produced them.

## Gameplay tags

```csharp
[GameplayTag("#D95555")]
public partial struct DamageTag { }
```

The tag generator supplies construction, parsing, equality, hierarchy matching, domain identity, and
network-compatible representation. Domains remain type-separated even when tag names match.

## Network models

`[NetworkModel]` on a partial class or struct generates a `NetworkState`, word-count and read/write
logic for supported `[Networked]` members. Nested models use their generated state recursively.
Models can implement `BeforeNetworkStateWrite(NetworkRunner?)`, `BeforeNestedNetworkStateRead(NetworkRunner)`,
and `AfterNetworkStateRead(NetworkRunner)` partial methods to prepare or apply custom network state.
`EntityFragmentCollection` uses these hooks
to serialize its registered fragments into a fixed 64-word payload. Collections that exceed this
capacity are rejected by inventory writes.

## Replicated collections

A mutable `ReplicatedCollection<T>` field marked `[Replicated(maxCapacity)]` generates fixed Fusion
storage and reconciliation hooks on a non-generic partial `RedNetworkBehaviour`. Items must be
reference types marked `[NetworkModel]`.

Generator diagnostics use `REDREP001`–`REDREP004` for invalid fields, capacities, item types, or owners.

## Inventory fragments

A sealed partial `EntityFragment` with inventory `[Replicated]` fields receives prototype application,
dirty-state mutation properties, word serialization, a deterministic type ID, and serializer
registration. Unsupported declarations produce `REDFRAG` diagnostics at compile time.

Generated code removes reflection and hot-path allocation from fragment replication. Keep authored
prototype fields serialized normally and mark only mutable runtime fields for replication.
