# Recipe: Host, Join, and Travel

**Outcome:** one build hosts `Arena` and another joins the same Fusion session, while the UI reports
travel progress and failure.

::: info Execution model
- **Authority** — the listening server owns the destination world and admits players.
- **Prediction** — connection and travel are not predicted.
- **Replicated** — Fusion scene state and actors spawned after the world starts.
- **Local only** — address fields, progress text, loading animation, and error messages.
:::

## 1. Prepare the destination

Add `Arena` to the active Build Profile and Fusion scene configuration. Place exactly one configured
`GameModeBase` actor in the scene, with a `NetworkObject`, player-controller prefab, default-character
prefab, and at least one `PlayerStart`.

## 2. Start a listening server

Use one session name for the host and every client:

```csharp
GameInstance instance = GameInstance.PrimaryGameInstance!;
await instance.BrowseAsync(
    "127.0.0.1:27015/Arena?listen&session=Development");
```

The `listen` flag selects Fusion server mode. Without a host, RedEngine starts the scene in `Single`
mode instead.

## 3. Join from a client

```csharp
GameInstance instance = GameInstance.PrimaryGameInstance!;
await instance.BrowseAsync(
    "127.0.0.1:27015/Arena?session=Development");
```

The client passes the complete travel URL as its connection token. `GameModeBase.AuthorizePlayerAsync`
can therefore inspect options such as `Spectator`, team, or project-specific join data.

## 4. Report progress and failure

```csharp
private void BindTravel(GameInstance instance)
{
    instance.OnBeginLoadWorld += HandleBeginLoad;
    instance.OnWorldLoadComplete += HandleWorldReady;
    instance.OnTravelFailure += HandleTravelFailure;
}

private void HandleBeginLoad(TravelURL url) =>
    statusLabel.text = $"Loading {url.SceneName}";

private void HandleWorldReady(World world) =>
    statusLabel.text = $"Ready: {world.Scene.name}";

private void HandleTravelFailure(TravelURL url, TravelFailureReason reason)
{
    widgets.HideLoadingScreen();
    statusLabel.text = $"Could not load {url.SceneName}: {reason}";
}
```

Unsubscribe when the presenter is destroyed. A configured `WidgetSubsystem` shows the standard
loading screen on begin and hides it on success; close it explicitly on failure as above.

## Verify

Start the server, then the client. Confirm both reach `Arena`, the client receives its controller and
character before `OnWorldLoadComplete`, and a bad scene name produces `Travel.LoadMapFailure` without
leaving a partial world running.

## Understand the system

Continue with [Manual: GameInstance and Travel](../../manual/game-instance-travel.md) for URL parsing,
queued travel, failure categories, additive scenes, and Multi-Peer behavior.
