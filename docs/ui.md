# UI and Widgets

`RedEngine.UI` provides an application-level widget stack. Screens represent navigation, windows layer
temporary UI above them, notifications are queued transient messages, and the loading screen follows
world travel automatically.

The system owns presentation only. Widgets read state and request actions; replicated gameplay remains
in actors, abilities, inventories, and other Fusion-aware components.

![Placeholder: widget root, layers, screens, windows, and notifications](/images/ui-widget-layers-placeholder.svg)

## Set up WidgetSettings

Create **Assets > Create > RedEngine > UI > WidgetSettings**. Assign:

- **Default Canvas:** a `WidgetLayer` prefab used as the persistent root;
- **Loading Screen Widget:** an `AssetReference<ScreenWidget>` shown during `GameInstance` travel.

If no default canvas is assigned, `WidgetSubsystem` creates an overlay canvas at runtime with a
1920×1080 reference resolution. The root survives scene travel and belongs to the `GameInstance`.

## Widget types

| Type | Use |
| --- | --- |
| `Widget` | Reusable UI block with child widgets, variables, and localization bindings |
| `WidgetLayer` | Persistent root for instantiated widgets |
| `ScreenWidget` | Navigable full-screen state with show/hide animation and `LayerIndex` |
| `WindowWidget` | Modal or additive UI above screens; can close itself |
| `NotificationWidget` | Temporary queued window with optional lifespan |

`ScreenWidget.LayerIndex` controls sibling sorting. Use low values for normal screens, higher values for
overlays, dialogs, and system UI. Show and hide animation clips are queued so lifecycle callbacks occur
after their visual transition.

## Navigate between screens

```csharp
[SerializeField] private AssetReference<MainMenuWidget> mainMenu = new();
[SerializeField] private AssetReference<SettingsWidget> settings = new();

WidgetSubsystem widgets = gameInstance.GetSubsystem<WidgetSubsystem>()!;

MainMenuWidget? menu = widgets.ShowScreen(
    mainMenu,
    new ScreenShownParameters(
        openMode: EScreenOpenMode.ClearStackAndOpen));

SettingsWidget? settingsScreen = widgets.ShowScreen(
    settings,
    new ScreenShownParameters(
        openMode: EScreenOpenMode.Push));
```

Screen modes:

- `Push` disables the current screen and resumes it when the new screen closes;
- `ReplaceCurrent` closes the current screen before opening the next;
- `ClearStackAndOpen` closes the entire navigation stack.

Call `CloseCurrentScreen()` for Back behavior, or close a specific screen returned from `ShowScreen`.

## Open windows

```csharp
[SerializeField] private AssetReference<ConfirmPurchaseWindow> confirmPurchase = new();

ConfirmPurchaseWindow? window = widgets.OpenWindow(
    confirmPurchase,
    new WindowShownParameters(
        state: new ConfirmPurchaseState(itemId, price),
        group: "Store.Modal",
        openMode: EWindowOpenMode.Additive,
        instancePolicy: EWindowInstancePolicy.SingleInstanceInGroup));
```

Windows support additive display, replacement of all visible windows, and queued opening. Group policy
is useful for ensuring only one dialog from the same flow remains open. A `WindowWidget` can call
`Close()` from its button handler.

State objects are plain project-defined classes derived from `ScreenState`, `WindowState`, or
`NotificationState`. They keep initialization data out of global fields and are available through the
widget's `Parameters` property.

## Show notifications

```csharp
[SerializeField] private AssetReference<ItemReceivedNotification> itemReceived = new();

ItemReceivedNotification? toast = widgets.EnqueueNotification(
    itemReceived,
    new NotificationShownParameters(
        state: new ItemReceivedState(itemName, quantity)));
```

Set `NotificationWidget.initialLifeSpan` for automatic local dismissal, or call `Hide()` explicitly.
Notification timing is presentation-only and therefore uses the game-instance timer manager rather
than replicated Fusion state.

## Variables and bindings

Every widget owns a `VariablesContext` that inherits values from its parent. `SetVariable` updates the
context and notifies child widgets:

```csharp
public sealed class PlayerHud : Widget
{
    public void Present(Character character)
    {
        SetVariable("playerName", character.name);
        SetVariable("health", character.Health);
        SetVariable("maxHealth", character.MaxHealth);
    }
}
```

The showcase's `ShowcaseTextBinding` reads these variables in `OnVariablesChanged`. Localized TMP text
can also consume variables through RedEngine's localization markup. `ValueBinding<T>` is available for
small polled getter/setter bindings.

Child contexts inherit parent values but can override a key locally. This makes it practical to set a
player name once on a screen and provide per-slot values inside inventory child widgets.

## Loading screen and lifecycle events

`WidgetSubsystem` subscribes to `GameInstance.BeginLoadWorld` and `OnWorldLoadComplete`. It shows the
configured loading widget before travel and hides it when the new world is ready. You can also call
`ShowLoadingScreen` and `HideLoadingScreen` manually for non-travel content work.

The subsystem publishes `OnScreenShown`, `OnScreenHidden`, `OnWindowShown`, `OnWindowClosed`,
`OnNotificationShown`, and `OnNotificationHidden` for presentation coordination and analytics.

Next: [Diagnostics and Console](diagnostics-console.md).
