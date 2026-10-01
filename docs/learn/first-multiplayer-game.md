# First Multiplayer Game

Build the smallest complete RedEngine game: one arena, one game mode, one controller, and one playable
character.

::: info Execution model for this tutorial
- **Authority** — State Authority admits the player, spawns the controller/character, and changes gameplay state.
- **Prediction** — Input Authority may simulate movement and explicitly prediction-safe abilities.
- **Replicated** — controller ownership, character pose, attributes, effects, and match state.
- **Local only** — particles, UI, audio, camera, and render interpolation.
:::

## 1. Create the project settings

Create `Assets/Resources/EngineSettings.asset`, press **Add Section**, and add `Core`. Assign its
`NetworkRunner` prefab, gameplay scene, server map if it differs, and default port. Do not add
Fusion's default scene manager; RedEngine supplies its own through `GameInstance`.

## 2. Add the game mode

Create a prefab with `NetworkObject` and a `GameModeBase` subclass. Assign its player-controller and
default-character prefabs, then place exactly one instance in the gameplay scene.

```csharp
public sealed class ArenaGameMode : GameModeBase
{
    protected override bool ReadyToStartMatch() =>
        Object.HasStateAuthority && World.PlayerControllers.Any();
}
```

## 3. Prepare the player

Create a `PlayerController` prefab and a `Character` prefab. Both must be spawnable Fusion network
prefabs. Start by duplicating their showcase counterparts, then remove optional systems after the
baseline works.

## 4. Connect input

Create `InputSettings` and an `InputContext`. Map an Input System action to a network channel, then map
the channel and trigger to an `[InputHandler]` method on the controller or possessed character.

```csharp
[InputHandler]
public void Move(Vector2 value) => characterController.SetMovementInput(value);
```

## 5. Add a replicated objective

Start with one authoritative action: entering a trigger applies damage, or interacting with a pickup
adds an item. Test it with one peer, then two. Use Fusion network state and `TickTimer` for gameplay;
do not use coroutines or wall-clock delays for replicated outcomes.

## 6. Verify the complete loop

- the server finds one `GameModeBase`;
- joining creates one controller and one character;
- each peer controls only its input-authority character;
- leaving removes the controller;
- restarting the map creates a fresh `World` and world subsystems.

For the longer inspector-by-inspector version, see [Your First Multiplayer Scene](first-multiplayer-scene.md).
For admission, spawn selection, match states, and respawning, see the
[GameMode manual](../manual/game-mode.md).

Next: choose a small task from [Recipes](recipes/index.md), then use
[Where to Go Next](where-to-go-next.md) to enter the Manual.
