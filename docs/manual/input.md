# Input

RedEngine maps Unity Input System actions into a fixed `NetworkInputData` packet, then routes packet
channels through prioritized `InputContext` assets.

::: info Execution model
- **Authority** — State Authority validates input-driven outcomes and authors the final gameplay state.
- **Prediction** — Input Authority produces `NetworkInputData` and may run prediction-safe handlers.
- **Replicated** — the resulting character, ability, and weapon state; Fusion transports input packets.
- **Local only** — physical device state, action maps, button prompts, rebinding UI, and input icons.
:::

## Configure InputSettings

Create **Red Engine > Input > Input Settings**. Each binding maps an Input Action to `Move`, `Look`,
`Primary`, `Secondary`, or one of the fixed button channels. `InputComponent` creates a separate action
instance for the peer with input authority and submits the packet to Fusion.

## Route an InputContext

An `InputContextBinding` selects the channel, trigger, `[InputHandler]` method, and whether it consumes
the input. Higher-priority contexts run first. `ConsumeUnhandledInput` stops lower contexts even when
no local binding handled the channel.

```csharp
public sealed class HeroInput : CharacterComponent
{
    [InputHandler]
    public void Move(Vector2 value) => Controller.SetMovementInput(value);

    [InputHandler]
    public void OpenInventory() => inventoryUi.Toggle();
}
```

`Started` is the press edge, `Triggered` is held, `Ongoing` is held after the first tick, and
`Completed`/`Canceled` represent release.

Push temporary contexts for menus, vehicles, or targeting and dispose the handle when the mode ends:

```csharp
using InputContextHandle handle = inputComponent.PushContext(vehicleContext);
```

Do not read legacy `UnityEngine.Input`, and do not mutate authoritative state directly from a local
Input Action callback. Route it through the Fusion input packet.

Next: [Abilities](abilities.md).
