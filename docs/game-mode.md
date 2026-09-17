# GameMode Pipeline

`GameModeBase` is the server-side coordinator for one gameplay world. It decides who may join, creates
the player's controller, chooses a spawn point, creates the character, and owns the replicated match
state. Put exactly one game mode actor in each gameplay scene that can run with state authority.

![Placeholder: GameMode inspector and scene actor](/images/game-mode-placeholder.svg)

## What belongs in a game mode

Use the game mode for rules that describe the session rather than one character:

- player and spectator limits;
- authentication or session admission;
- controller and default-character selection;
- team assignment or other authorization payloads;
- spawn-point selection and respawn policy;
- match start, end, abort, and map-leave transitions.

Do not use it as a global singleton. A game mode belongs to a `World`, exists only for that world, and
is authoritative only on the server or single-player runner.

## Player join pipeline

When Fusion reports a joined player, `World` runs this sequence on state authority:

1. build a `ConnectionRequest` from the `PlayerRef` and connection token;
2. await `GameModeBase.AuthorizePlayerAsync`;
3. disconnect the player if authorization is rejected;
4. call `CreatePlayerController` with the returned `AuthorizedPlayerData`;
5. assign the player's input authority to the new controller;
6. call `OnPlayerJoined`;
7. for a non-spectator, call `RestartPlayer`;
8. select a `PlayerStart`, create the character, and attach it to the controller.

![Placeholder: player join pipeline](/images/game-mode-pipeline-placeholder.svg)

This ordering gives authorization a clean place to attach validated information before a network actor
is spawned. `AuthorizedPlayerData.Payload` can carry a project-specific profile or team result into an
overridden controller factory.

## Authorize a player

The base implementation enforces `MaxPlayers` and `MaxSpectators`. A `Spectator` option in the travel
request selects the spectator role. Override the method for authentication or matchmaking data, but
return a structured failure instead of spawning partial player state.

```csharp
using System.Threading.Tasks;
using RedEngine.Core;

public sealed class ArenaGameMode : GameModeBase
{
    public override async Task<PlayerAuthorizationResult> AuthorizePlayerAsync(
        ConnectionRequest request)
    {
        PlayerProfile? profile = await PlayerProfiles.FindAsync(request.Player);
        if (profile == null)
            return PlayerAuthorizationResult.Rejected(
                PlayerJoinFailureReasons.AuthorizationFailed);

        return PlayerAuthorizationResult.Allowed(new AuthorizedPlayerData(
            request.Player,
            new PlayerIdentity(profile.Id, profile.DisplayName),
            PlayerJoinRole.Player,
            payload: profile));
    }
}
```

Keep network mutation after the authorization result returns to the main pipeline. The framework
disconnects rejected players with the supplied `PlayerJoinFailureReason`.

## Customize controller and character creation

`CreatePlayerController` spawns `PlayerControllerPrefab` through `World.SpawnActor`. The default
`OnPlayerJoined` immediately calls `RestartPlayer`, which then calls
`CreateCharacterForPlayerController` at the selected `PlayerStart`.

Override the narrowest hook:

- `CreatePlayerController` when projects use different controller classes or need authorization data;
- `OnPlayerJoined` for team registration or a lobby phase;
- `RestartPlayer` for a custom respawn pipeline;
- `CreateCharacterForPlayerController` for role-based character selection;
- `FailedToRestartPlayer` and `FinishRestartPlayer` for failure handling and post-spawn setup.

The spawn-point check understands `CharacterController`, capsule, box, and sphere colliders, plus
`ISpawnCapsule`. Occupied starts are classified as empty, partial, or full before the character is
created.

## Match-state pipeline

`ReplicatedMatchState` is networked and uses these states:

```text
EnteringMap → WaitingToStart → InProgress → WaitingPostMatch → LeavingMap
                                     └────────────────────────→ Aborted
```

`FixedUpdateNetwork` detects changes and dispatches the matching hook:

| State | Hook |
| --- | --- |
| `WaitingToStart` | `OnMatchIsWaitingToStart()` |
| `InProgress` | `OnMatchHasStarted()` |
| `WaitingPostMatch` | `OnMatchHasEnded()` |
| `LeavingMap` | `OnLeavingMap()` |
| `Aborted` | `OnMatchAborted()` |

Use `ReadyToStartMatch()` and `ReadyToEndMatch()` for authoritative conditions. Use
`MatchStateChanged(from, to)` for shared reactions. Replicated match deadlines should be Fusion
`TickTimer` values, never wall-clock timers or Unity coroutines.

## Player leave pipeline

When a player leaves, `World` finds the controller by input authority, removes that authority, calls
`OnPlayerLeft`, and destroys the controller. Override `OnPlayerLeft` to release team slots or save
session results; owned gameplay actors should still be despawned through `World`.

Next: [GameInstance, Travel, and Bootstrap](game-instance-travel.md).
