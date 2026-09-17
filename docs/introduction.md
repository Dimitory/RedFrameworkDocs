# Meet RedEngine

RedEngine sits between a Unity game and Photon Fusion. It gives common multiplayer gameplay concepts a
consistent home: application startup, world travel, actors, input, abilities, inventory, equipment,
weapons, UI, content loading, and diagnostics.

The framework is opinionated where multiplayer code benefits from one clear rule. Replicated gameplay
runs on Fusion ticks and respects authority, prediction, and rollback. Presentation is allowed to be
ordinary Unity code as long as it does not become the source of network truth.

## The three ideas worth learning first

### A game has one application lifetime and changing world lifetimes

`GameInstance` owns the application-level lifetime. A `World` belongs to the active Fusion simulation
scene. Travelling to another scene replaces the world without pretending the whole application was
restarted.

### Networked things are actors

An `Actor` is a Fusion-aware object with a `NetworkObject`. Actor components add focused behavior. Spawn
and despawn network actors through `World`, so the framework and Fusion agree on ownership and lifetime.

### Input is data for a simulation tick

The Input System feeds RedEngine's fixed input channels. Fusion transports those values, and gameplay
code consumes them during the network simulation. This makes a button press reproducible during
prediction and rollback instead of tying it to a rendered frame.

## What RedEngine does not hide

You still configure Fusion, create prefabs, author ScriptableObjects, and decide which side has state
authority. RedEngine supplies a vocabulary and working modules; it does not turn multiplayer into a
single "make networked" checkbox.

That is why the sample matters. Use it as a map of real connections, then replace one piece at a time.

Next: [Framework overview](overview.md).
