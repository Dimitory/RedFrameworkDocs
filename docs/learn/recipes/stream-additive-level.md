# Recipe: Stream an Additive Level

**Outcome:** state authority loads and unloads an additional level without replacing the match.

::: info Execution model
- **Authority** — State Authority requests the synchronized scene load and unload.
- **Prediction** — scene streaming is not predicted by Input Authority.
- **Replicated** — Fusion scene information and network actors belonging to the loaded level.
- **Local only** — loading indicator, fade, streaming progress, ambient audio transition, and presentation caches.
:::

## 1. Prepare the scene

Create a small scene such as `Arena_UpperFloor`. Add it to the active Build Profile and make it
available to Fusion. Do not place a second `GameModeBase` in this additive scene.

## 2. Load through World

```csharp
if (world.NetworkRunner.IsServer)
{
    await world.LoadSceneAsync(
        "Arena_UpperFloor",
        LoadSceneMode.Additive);
}
```

This keeps the current `NetworkRunner`, `World`, players, match state, and world subsystems. It is not
the same as `GameInstance.BrowseAsync`, which replaces the current world.

## 3. Unload it

```csharp
if (world.NetworkRunner.IsServer)
    await world.UnloadSceneAsync("Arena_UpperFloor");
```

Release or despawn gameplay objects that intentionally outlive the level before unloading it.

## Verify

Run a server and client. Load the level once, confirm both peers see it, then unload it. Existing
characters and match state should remain. Repeated requests should not create duplicate scene content.

## Understand the system

Continue with [Manual: Spawn & Networking](../../manual/spawn.md) and
[GameInstance and Travel](../../manual/game-instance-travel.md#load-additional-levels-inside-the-current-world).
