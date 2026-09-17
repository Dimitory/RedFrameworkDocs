# Diagnostics and Developer Console

RedEngine's diagnostics pipeline gives every system a named channel, sends formatted output to one or
more receivers, and mirrors buffered logs into an in-game console. The console also discovers command
methods automatically and parses useful Unity and collection types.

## Create log channels

```csharp
using RedEngine.Diagnostics;

private static readonly LogChannel Logger = "Gameplay.Combat.Damage";

Logger.LogInfo("Damage subsystem ready");
Logger.LogWarning("Target had no resistance attribute");
Logger.LogError("Damage result was not finite");
```

Names separated with dots form a settings hierarchy. This does not merge log output; it lets a parent
configuration apply to all nested sections.

## Configure each section independently

Create **Assets > Create > RedEngine > Settings > Logger**. `LoggerSettings` contains defaults plus a
list of namespace overrides. Each entry configures:

- minimum verbosity: `Disabled`, `Info`, `Warning`, or `Error`;
- prefix color;
- stack-trace capture.

Resolution starts from the complete channel name and walks toward its parents. Given these entries:

```text
Gameplay                 Warning
Gameplay.Combat          Info
Gameplay.Combat.Damage   Error
```

`Gameplay.Combat.Damage.Critical` inherits `Error` from `Gameplay.Combat.Damage`, while
`Gameplay.Combat.Targeting` inherits `Info` from `Gameplay.Combat`. An exact child entry always wins.

![Placeholder: LoggerSettings with nested channel overrides](/images/logger-settings-placeholder.svg)

Changes made in the inspector refresh settings already cached by live channels. Channels without a
matching namespace use the default verbosity, color, and stack-trace setting.

## Receivers

At startup, `Logger` resets and creates:

- `BufferedLogReceiver` for the developer console, retaining up to 1000 messages until it attaches;
- `EngineLogReceiver` in the Editor and on mobile platforms;
- `FileLogReceiver` for a persistent log file.

Add a project receiver by implementing `ILogReceiver` and inserting it into `Logger.Receivers`.

## Open the developer console

The runtime creates a persistent console automatically after scene load. Press the backquote key
(`) to toggle it. The console includes:

- live formatted logs;
- command history stored in `PlayerPrefs`;
- Up/Down history navigation;
- command and parameter suggestions;
- Tab completion;
- a mobile keyboard inset;
- configurable retained log and command counts.

![Placeholder: developer console with logs and suggestions](/images/developer-console-placeholder.svg)

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

Commands may be public or private. They are discovered after assemblies load and are invoked
case-insensitively. A non-null string return value is printed into the console.

## Add suggestions

Provide fixed values:

```csharp
[ConsoleCommand("match.state")]
private static string SetMatchState(
    [CommandSuggestion("Warmup", "Playing", "Finished")] string state)
{
    return $"Requested state: {state}";
}
```

Or resolve them from a static provider:

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

The provider must be a parameterless static method returning `IEnumerable<string>`. A fully qualified
`TypeName.MethodName` can point at a provider on another type.

## Instance commands

Instance command methods run against every registered object of their declaring type:

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

Always unregister scene objects. If no target is registered, the console returns a clear
`Missing command target` message.

## Supported arguments

Built-in parsers support:

- strings, including quoted text and escape sequences;
- booleans (`true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off`);
- integer and floating-point numeric types using invariant culture;
- enums, case-insensitively;
- `Vector2`, `Vector3`, `Vector4`, `Vector2Int`, and `Vector3Int` as `(x,y,...)`;
- `GameObject` by name;
- arrays and common generic collections as `[a,b,c]`;
- tuples as `(a,b,c)`.

Custom types can register an `ICommandArgumentParser` through `CommandArgumentParser.AddParser` before
commands are invoked.

Useful built-ins include `help`, `help filter`, and `quit`.
