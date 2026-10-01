# Developer Console

The in-game developer console combines buffered RedEngine logs with commands discovered from loaded
assemblies. It supports history, suggestions, completion, typed arguments, and registered instance
targets.

Press the backquote key (`) to toggle it. The console includes:

- live formatted logs;
- command history stored in `PlayerPrefs`;
- Up/Down history navigation;
- command and parameter suggestions;
- Tab completion;
- mobile keyboard inset handling;
- configurable retained log and command counts.

![developer console with logs and suggestions](/images/developer-console.png)

## Add a static command

```csharp
using RedEngine.Console;
using UnityEngine;

public static class ArenaCommands
{
    [ConsoleCommand("arena.timescale", Description = "Sets Unity time scale.")]
    private static string SetTimeScale(float value = 1f)
    {
        Time.timeScale = Mathf.Clamp(value, 0f, 4f);
        return $"Time scale: {Time.timeScale:0.##}";
    }
}
```

Commands may be public or private. Discovery runs after assemblies load, names are case-insensitive,
and a non-null string result is printed back into the console.

Example calls:

```text
arena.timescale
arena.timescale 0.5
help arena
```

## Add suggestions

Use fixed values when the valid set is known at compile time:

```csharp
[ConsoleCommand("match.state")]
private static string SetMatchState(
    [CommandSuggestion("Warmup", "Playing", "Finished")] string state)
{
    return $"Requested state: {state}";
}
```

Or resolve suggestions from a parameterless static method returning `IEnumerable<string>`:

```csharp
[ConsoleCommand("player.kick")]
private static string Kick(
    [CommandSuggestion(nameof(GetPlayerNames))] string playerName)
{
    return TryKick(playerName) ? "Player disconnected" : "Player not found";
}

private static IEnumerable<string> GetPlayerNames() =>
    FindObjectsByType<PlayerIdentityView>(FindObjectsSortMode.None)
        .Select(player => player.DisplayName);
```

A fully qualified `TypeName.MethodName` can point to a provider declared on another type.

## Instance commands

Instance methods run against registered objects of their declaring type:

```csharp
public sealed class EnemyDirector : MonoBehaviour
{
    private void OnEnable() => ConsoleRegistry.RegisterObject(this);
    private void OnDisable() => ConsoleRegistry.UnregisterObject(this);

    [ConsoleCommand("enemies.clear", Description = "Despawns active enemies.")]
    private int ClearEnemies(bool includeBosses = false)
    {
        return DespawnEnemies(includeBosses);
    }
}
```

Always unregister scene objects. If no target is registered, the console reports
`Missing command target` instead of invoking a stale object.

## Supported arguments

Built-in parsers support:

- quoted strings and escape sequences;
- booleans (`true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off`);
- integer and floating-point values using invariant culture;
- case-insensitive enums;
- `Vector2`, `Vector3`, `Vector4`, `Vector2Int`, and `Vector3Int` as `(x,y,...)`;
- `GameObject` lookup by name;
- arrays and common generic collections as `[a,b,c]`;
- tuples as `(a,b,c)`.

Register project types through `CommandArgumentParser.AddParser` with an
`ICommandArgumentParser` implementation before commands are invoked.

```csharp
using System;
using RedEngine.Console.Internal;

public readonly record struct LobbySlot(int Value);

public sealed class LobbySlotParser : ICommandArgumentParser
{
    public bool CanParse(Type type) => type == typeof(LobbySlot);

    public bool TryParse(string value, Type type, out object? result)
    {
        if (int.TryParse(value, out int slot) && slot >= 0)
        {
            result = new LobbySlot(slot);
            return true;
        }

        result = null;
        return false;
    }
}

CommandArgumentParser.AddParser(new LobbySlotParser());
```

Register a parser once during project startup. Parsers are tested in registration order, so keep
`CanParse` narrow and return `false` for invalid user input instead of throwing.

```text
teleport (10,2,-4)
spawn.wave [Grunt,Grunt,Sniper]
camera.mode "Free Fly"
damage.apply Player 25 Fire
```

## Built-in commands

The base console provides `help`, `help filter`, and `quit`. When a world is running, gameplay
diagnostics also expose:

- `match.state` and `match.restart`;
- `player.list`;
- `player.kill <playerId>`;
- `player.respawn <playerId>`;
- `player.kick <playerId>`.

Commands that mutate match or player state require server or single-player authority. Player IDs are
Fusion `PlayerRef.PlayerId` numbers shown by `player.list`.

Channel configuration and log receivers are documented in [Diagnostics](diagnostics.md).
