# Recipe: Open a UI Screen

**Outcome:** a button pushes an instructions screen and Back returns to the previous screen.

## 1. Create the widget

Create a prefab derived from `ScreenWidget`. Add the content and a Back button. Store it through a
typed `AssetReference` on the screen that opens it.

## 2. Push the screen

```csharp
[SerializeField]
private AssetReference<InstructionsWidget> instructions = new();

public void OpenInstructions()
{
    if (instructions.IsValid)
        WidgetSubsystem?.ShowScreen(
            instructions,
            new ScreenShownParameters(openMode: EScreenOpenMode.Push));
}
```

Bind the Back button to `WidgetSubsystem.CloseCurrentScreen()`. `Push` disables the previous screen and
resumes it after the instructions screen closes.

## Verify

Open and close the screen several times. Confirm it does not create duplicate visible instances and
that each Multi-Peer view shows UI only for its selected game instance.

## Understand the system

Continue with [Manual: UI](../../manual/ui.md) for screen modes, windows, notifications, state objects,
variables, and loading screens.
