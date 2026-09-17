# Graph and Inspector

These modules are building blocks for project-specific authoring tools. You do not need them to make a
basic RedEngine game; add them when designers need graphs, richer inspectors, or reusable data-driven
workflows.

## RedEngine.Graph

A runtime graph consists of `GraphNode` types, flow/value ports, a blackboard, and
serialized connections. Declare the type and category explicitly for a new node:

```csharp
using RedEngine.Graph;

[NodeCategory("Game/Logic")]
public sealed class IsAliveNode : BranchNode
{
    // Implement ports and execution according to the base node contract.
}
```

Store required input/output nodes as concrete runtime types. The
`RedEngine.Graph.Editor.GraphToolkit` editor assembly creates and opens Unity Graph Toolkit
`.redgraph` documents linked to graph assets. The association is stored by GUID and
survives moving the asset.

Graph Toolkit integration is optional. Install `com.unity.graphtoolkit` 0.4.0 or newer to
enable the editor assembly; runtime graph types remain available without the package.

A graph is an authoring representation, not a place for non-deterministic Unity coroutines
or direct presentation changes from simulation.

## RedEngine.Inspector

This assembly provides runtime attributes and a compatible inspector attribute layer.
Decorate a polymorphic `SerializeReference` field as follows:

```csharp
using RedEngine.Inspector;
using UnityEngine;

[SerializeReference, SubclassSelector]
private MovementRule? movementRule;

[SerializeField, InlineScriptableObject]
private ScriptableObject? inlineSettings;
```

Types shown by `SubclassSelector` must be concrete, marked `[Serializable]`, and have a
parameterless constructor. Single fields, arrays, and `List<T>` are supported.

`InlineScriptableObject` keeps the field as a regular asset reference, so an existing external
asset can be assigned normally. When the field is empty, the `+` button creates a sub-asset inside
the owning persistent asset. Concrete fields are created immediately; abstract or base
`ScriptableObject` fields show a menu of concrete runtime-derived types. Inline values can be
expanded and edited in place, or removed with the `−` button. Replacing an inline value asks
whether its old sub-asset should be deleted or retained.

Editor drawers live in `RedEngine.Editor` and the `RedEngine.Inspector` editor code. Do not
add `UnityEditor` references to a runtime assembly for a custom inspector.
