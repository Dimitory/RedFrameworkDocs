# GameInstance, Travel, and Bootstrap

`Bootstrap` starts RedEngine. `GameInstance` owns one runner and the application-level services around
it. Travel destroys the old runner/world pair and creates a new pair for the requested scene. In the
Editor, Multi-Peer creates several game instances inside one Unity process.

![Placeholder: Bootstrap and Travel pipeline](/images/game-instance-travel-placeholder.svg)

## Bootstrap pipeline

After Unity loads the initial scene, `RedEngine.Runtime.Bootstrap` performs this sequence:

1. load the single `EngineSettings` asset from `Resources`;
2. initialize `ContentManager` with `ContentInitializationOptions`;
3. read startup arguments and the Editor peer count;
4. create a server `GameInstance` when server mode is enabled;
5. create one or more client game instances;
6. select the first client as the input-producing instance;
7. call `Browse` on each instance with its startup travel URL.

On application shutdown or when leaving Play Mode, bootstrap waits for content initialization, shuts
down every game instance, then shuts down `ContentManager`.

## EngineSettings controls startup

Keep one asset at `Assets/Resources/EngineSettings.asset`. It supplies:

- the concrete `GameInstance` type;
- the `NetworkRunner` prefab;
- default client and server maps;
- default server port;
- content initialization options.

The concrete base `GameInstance` is valid. Create a subclass only when the project needs additional
application-level behavior or subsystems.

## TravelURL forms

`TravelURL` represents both local and network travel, plus case-insensitive query options:

```text
/Arena
/Arena?Difficulty=Hard
127.0.0.1:27015/Arena
127.0.0.1:27015/Arena?listen
127.0.0.1:27015/Arena?Spectator
```

- a URL without a host starts Fusion in `Single` mode;
- a URL with a host starts a client;
- the `listen` option starts a server;
- `MapName` removes directories and the scene extension;
- `url["Option"]`, `Contains`, and `GetValue<T>` read options.

Use `TryParse` when the URL comes from a player or command line. The implicit string conversion is
convenient for trusted literals.

## Start travel and observe it

```csharp
GameInstance instance = GameInstance.PrimaryGameInstance!;

instance.BeginLoadWorld += url => loadingOverlay.Show(url.MapName);
instance.OnWorldLoadComplete += world => loadingOverlay.Hide();
instance.OnTravelFailure += (url, reason) => ShowTravelError(url, reason);

TravelResult result = await instance.BrowseAsync(
    "127.0.0.1:27015/Arena?Team=Blue");

if (!result)
    Logger.LogError($"Travel failed: {result.FailureReason}");
```

`OpenLevel(name, options)` builds a local URL. `Browse(url)` starts travel without awaiting it.
`BrowseAsync(url)` returns a `TravelResult` containing either the completed URL or a structured failure.

## What happens inside BrowseAsync

1. resolve the scene through `ContentManager`;
2. shut down and destroy the current runner;
3. instantiate the runner prefab from `EngineSettings`;
4. create a new `World` and connect it to `FusionSceneManager`;
5. call `NetworkRunner.StartGame` with single, client, or server mode;
6. wait for Fusion's simulation scene, with a 30-second timeout;
7. initialize the world and its subsystems;
8. publish `OnWorldLoadComplete`.

Failures are reported as `TravelFailureReason` values for map resolution, connection, scene timeout,
world initialization, or an unknown startup problem. `WidgetSubsystem` listens to the travel events to
show and hide the configured loading screen automatically.

::: warning One travel at a time
If `Browse` is called during an active travel, the requested URL is exposed as `PendingTravel`. Do not
build a rapid travel queue around repeated calls; wait for the current `BrowseAsync` result, then issue
the next request explicitly.
:::

## Multi-Peer and the primary instance

`GameInstance.Instances` contains every live peer in the process. Only the instance whose
`ProvideInput` is true is considered `PrimaryGameInstance`; changing it also updates Fusion input,
runner visibility, camera, rendering, audio, and UI output.

Use `GameInstance.SetActiveGameInstance(instance)` in editor tooling. Gameplay code should usually find
its owning world or call `TryGetGameInstance(runner)` rather than assuming the first instance.

Next: [GameMode pipeline](game-mode.md).
