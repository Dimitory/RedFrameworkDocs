# Tutorial: Your First Multiplayer Scene

This tutorial describes the smallest useful scene of your own. Use the showcase prefabs as references
while you build it; they expose the exact inspector relationships that text cannot show as clearly.

## 1. Create the global settings

Create **Assets > Create > RedEngine > EngineSettings** and keep the asset at
`Assets/Resources/EngineSettings.asset`. Assign:

- a prefab containing `NetworkRunner`;
- the default game scene;
- the server scene, if it differs;
- the default server port, if your connection flow uses one.

Do not add Fusion's `NetworkSceneManagerDefault` to the runner prefab. `GameInstance` supplies
RedEngine's scene manager.

![Placeholder: EngineSettings inspector](/images/engine-settings-placeholder.svg)

## 2. Add a game mode

Create a prefab with:

- `NetworkObject`;
- your `GameModeBase` subclass;
- its player-controller and default-character prefab assignments.

Place one instance of that game mode prefab in the gameplay scene. The server looks for the scene's
game mode when the world initializes; a separate `WorldSettings` component is not required.

```csharp
using RedEngine.Core;

public sealed class ArenaGameMode : GameModeBase
{
    public override void Spawned()
    {
        base.Spawned();
        // Initialize authoritative match rules here.
    }
}
```

## 3. Prepare player prefabs

The game mode needs a player controller and a character. Any spawnable network actor needs a
`NetworkObject`, and network behaviors should derive from RedEngine's actor/component types where the
framework owns their lifecycle. Register these prefabs in Fusion's network project configuration.

For a first pass, duplicate the corresponding showcase prefabs and remove features you do not need.
That gives you a known-good hierarchy before you customize movement, visuals, or abilities.

## 4. Add input

1. Create a Unity Input Actions asset.
2. Create **Assets > Create > Red Engine > Input > Input Settings**.
3. Map actions to `Move`, `Look`, `Primary`, `Secondary`, or `Button0…Button31`.
4. Create an `InputContext` and route channel/trigger pairs to component methods.
5. Add the appropriate RedEngine input component to the player controller.

Handlers are explicit:

```csharp
using RedEngine.Core.Input;
using UnityEngine;

public sealed class HeroInput : MonoBehaviour
{
    [InputHandler]
    public void Move(Vector2 value) { }

    [InputHandler]
    public void Jump() { }
}
```

Use `Started` for the press edge, `Triggered` while held, `Ongoing` after the first held tick, and
`Completed`/`Canceled` for release. RedEngine keeps a separate Input Actions instance for each local
peer.

![Placeholder: InputSettings and InputContext](/images/input-settings-placeholder.svg)

## 5. Make the scene runnable

Add the gameplay scene to the active Build Profile and assign it in `EngineSettings`. Confirm every
spawnable prefab is registered with Fusion. Then enter Play Mode with one peer first.

Once one peer spawns correctly, enable Fusion Multi-Peer and try two. Verify both input paths before
adding inventory, abilities, or weapons; a small working baseline makes later failures much easier to
locate.

## 6. Add one feature at a time

A practical order is:

1. movement and camera;
2. one gameplay ability;
3. one replicated attribute such as Health;
4. one interactable pickup;
5. inventory and equipment;
6. player UI;
7. diagnostics and developer commands.

Use [Features](features.md) to jump to the matching guide.
