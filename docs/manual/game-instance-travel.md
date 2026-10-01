# GameInstance, Travel, and Bootstrap

`Bootstrap` starts RedEngine. `GameInstance` owns one runner and the application-level services around
it. Travel destroys the old runner/world pair and creates a new pair for the requested scene. In the
Editor, Multi-Peer creates several game instances inside one Unity process.

## Bootstrap pipeline

After Unity loads the initial scene, `RedEngine.Runtime.Bootstrap` performs this sequence:

1. load the single `EngineSettings` asset from `Resources`;
2. read `CoreSettings` and `ContentSettings` from it;
3. call `ContentManager.InitializeAsync`, which initializes Addressables and preloads the labels in `ContentSettings.preloadContentLabels`;
4. read startup arguments and the Editor peer count;
5. create and await a server `GameInstance` when server mode is enabled;
6. create one or more clients in parallel after the server session is available, except in dedicated server mode;
7. select the first client as the input-producing instance;
8. use one explicit Fusion session name for the server and all local clients.

On application shutdown or when leaving Play Mode, bootstrap waits for content initialization, shuts
down every game instance, then shuts down `ContentManager`.

## Configuration controls startup

Keep one root asset at `Assets/Resources/EngineSettings.asset` and add these sections explicitly:

- `RedEngine.Core.CoreSettings` supplies the concrete `GameInstance` type, `NetworkRunner` prefab,
  and default server port;
- `RedEngine.Assets.ContentSettings` supplies content initialization options.

Bootstrap uses the active scene in the Editor when it has a saved path; otherwise it uses the first
enabled scene in Build Settings. An editor host runs a server and a local client in separate temporary
`Peer ...` scenes. Fusion Peer Mode must be `Multiple` for that setup.

The concrete base `GameInstance` is valid. Create a subclass only when the project needs additional
application-level behavior or subsystems.

## TravelURL forms

`TravelURL` represents both local and network travel, plus case-insensitive query options:

```text
/Arena
/Arena?Difficulty=Hard
127.0.0.1:27015/Arena
127.0.0.1:27015/Arena?listen
127.0.0.1:27015/Arena?session=Development
127.0.0.1:27015/Arena?Spectator
```

- a URL without a host starts Fusion in `Single` mode;
- a URL with a host starts a client;
- the `listen` option starts a server;
- the `session` option selects the Fusion session shared by server and clients;
- `SceneName` contains the normalized scene path without the leading slash;
- `url["Option"]`, `Contains`, and `GetValue<T>` read options case-insensitively.

Use `TryParse` when the URL comes from a player or command line. The implicit string conversion is
convenient for trusted literals.

```csharp
if (!TravelURL.TryParse(addressInput.text, out TravelURL destination) ||
    string.IsNullOrWhiteSpace(destination.SceneName))
{
    ShowAddressError("Enter a destination scene.");
    return;
}

string team = destination["Team"] ?? "Unassigned";
int seed = destination.GetValue("Seed", defaultValue: 0);
bool spectator = destination.Contains("Spectator");
```

`GetValue<T>` is intended for unmanaged values such as numbers and booleans. Read strings through the
indexer. A flag without `=` is present in `Options` with a `null` value, so test it with `Contains`.

## Start travel and observe it

```csharp
GameInstance instance = GameInstance.PrimaryGameInstance!;

instance.OnBeginLoadWorld += url => loadingOverlay.Show(url.SceneName ?? "Loading");
instance.OnWorldLoadComplete += world => loadingOverlay.Hide();
instance.OnTravelFailure += (url, reason) => ShowTravelError(url, reason);

await instance.BrowseAsync("127.0.0.1:27015/Arena?Team=Blue");
```

`Browse(scene, options)` builds a local URL. `Browse(url)` starts travel without awaiting it.
`BrowseAsync(url)` returns the travel task. Observe `OnWorldLoadComplete` and `OnTravelFailure` when the
caller needs the outcome and structured `TravelFailureReason`.

`OnBeginLoadWorld` receives the normalized destination scene, while `CurrentTravel` retains the full
active URL including host and options. `OnTravelFailure` receives the original requested URL.

For a local destination assembled from UI fields, let `Browse` escape the option values:

```csharp
instance.Browse("Arena", new Dictionary<string, string>
{
    ["Difficulty"] = selectedDifficulty,
    ["Loadout"] = selectedLoadoutId,
});
```

Unsubscribe long-lived presenters when they are disposed. `GameInstance` clears its travel delegates
during `ShutdownAsync`, but a scene object should not stay subscribed until then.

### Present structured failures

```csharp
private void HandleTravelFailure(TravelURL destination, TravelFailureReason reason)
{
    string message = reason.Equals(TravelFailureReasons.LoadMapFailure)
        ? $"Scene '{destination.SceneName}' is unavailable."
        : reason.Equals(TravelFailureReasons.ConnectFailure)
            ? "Could not connect to the session."
            : reason.Equals(TravelFailureReasons.PlayerSpawnTimeout)
                ? "Connected, but the local player did not spawn in time."
                : $"Travel failed: {reason}";

    ShowTravelError(message);
}
```

Treat the reason as a stable category for presentation and telemetry. The detailed technical cause is
written through Diagnostics; do not parse log text to choose recovery UI.

## What happens inside BrowseAsync

1. resolve the scene through `ContentManager`;
2. shut down and destroy the current runner;
3. instantiate the runner prefab from `CoreSettings`;
4. create a new `World` and connect it to `FusionSceneManager`;
5. call `NetworkRunner.StartGame` with single, client, or server mode;
6. wait for Fusion's simulation scene, with a 30-second timeout;
7. initialize the world and its subsystems;
8. wait for the local `PlayerController` and, when the GameMode has a default character prefab, its
   spawned character pawn;
9. publish `OnWorldLoadComplete`.

Failures are reported as `TravelFailureReason` values for map resolution, connection, scene timeout,
world initialization, local-player spawn timeout, or an unknown startup problem. `WidgetSubsystem`
shows the configured loading screen when travel begins and hides it after a world completes. A project
that remains active after `OnTravelFailure` should call `HideLoadingScreen` from its failure handler.
A loading screen's registered `hideAnimation` completes before the widget is destroyed, so it can
cover the full technical spawn and then leave with a short transition.

Only one travel runs at a time. Additional `Browse` requests are queued and processed in order after
the current request. Completed work does not prevent later travel; startup failures are reported
through `OnTravelFailure` before the incomplete world is shut down.

## Load additional levels inside the current World

`Browse` replaces the current runner and world. For streaming a dungeon, combat arena, or another
additive part of the same match, use the current `World` instead:

```csharp
using UnityEngine.SceneManagement;

World world = gameInstance.CurrentWorld;

await world.LoadSceneAsync(
    "Arena_UpperFloor",
    LoadSceneMode.Additive);

// The match continues in the same World and on the same NetworkRunner.

await world.UnloadSceneAsync("Arena_UpperFloor");
```

Both methods delegate to Fusion's `NetworkRunner`, so scene operations are synchronized through the
active network session. Call them from state authority, use the same scene name on every peer, and
make the scene available to Fusion and the active Build Profile. Actors found in a loaded scene are
prepared for the existing `World`; this is level streaming, not a second world or a nested game mode.

Use the two scene paths for different jobs:

| Goal | API |
| --- | --- |
| Replace the current match, server, or map | `GameInstance.BrowseAsync(...)` |
| Add another level to the current match | `World.LoadSceneAsync(name, LoadSceneMode.Additive)` |
| Remove an additive level | `World.UnloadSceneAsync(name)` |

### Guard an authoritative streaming request

```csharp
public async Task<bool> LoadArenaWingAsync(World world)
{
    if (!world.NetworkRunner.IsServer)
        return false;

    await world.LoadSceneAsync("Arena_Wing", LoadSceneMode.Additive);
    return true;
}
```

The return value above reports whether this caller was allowed to start the operation; Fusion owns
the synchronized scene result. Avoid starting the same load independently on every peer.

## Multi-Peer and the primary instance

`GameInstance.Instances` contains every live peer in the process. Only the instance whose
`ProvideInput` is true is considered `PrimaryGameInstance`; changing it also updates Fusion input,
runner visibility, camera, rendering, audio, and UI output.

Use `GameInstance.SetActiveGameInstance(instance)` in editor tooling. Gameplay code should usually use
the `GameInstance` exposed by its owning `World` rather than assuming the first entry is active:

```csharp
GameInstance owner = actor.World.GameInstance;
WidgetSubsystem? widgets = owner.GetSubsystem<WidgetSubsystem>();
```

Dedicated server instances cannot become primary and are omitted from the Editor peer selector.

Next: [GameMode pipeline](game-mode.md).
