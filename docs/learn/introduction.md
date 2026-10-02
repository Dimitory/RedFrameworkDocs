# Meet RedEngine

RedEngine provides a structured gameplay layer between a Unity project and Photon Fusion. It brings
application startup, world travel, actors, input, abilities, inventory, equipment, weapons, UI, content
loading, and diagnostics within a consistent architecture.

Its central constraint is deliberate: replicated gameplay runs on Fusion ticks and observes authority,
prediction, and rollback. Presentation may use ordinary Unity callbacks, provided it never determines
authoritative network state.

## Three foundational concepts

### Application and world lifetimes differ

`GameInstance` owns the application lifetime, while `World` belongs to the active Fusion simulation
scene. Travelling to another scene replaces the world without restarting the application.

### Networked entities are actors

An `Actor` is a Fusion-aware entity with a `NetworkObject`; actor components supply focused behavior.
Spawn and despawn actors through `World` to preserve ownership and lifetime semantics.

### Input is data for a simulation tick

The Input System populates RedEngine's fixed input channels. Fusion transports those values for
consumption during simulation ticks, making input reproducible under prediction and rollback rather
than dependent on rendered frames.

## Responsibilities retained by the project

Projects still configure Fusion, create prefabs, author ScriptableObjects, and define state authority.
RedEngine supplies reusable modules and consistent conventions, while these architectural decisions
remain explicit.

The showcase illustrates those relationships in a working project. Examine its configuration before
replacing individual components.

Next: [Framework overview](framework-overview.md).
