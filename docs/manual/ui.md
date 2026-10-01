# UI and Widgets

`RedEngine.UI` provides an application-level widget stack. Screens represent navigation, windows layer
temporary UI above them, notifications are queued transient messages, and the loading screen follows
world travel automatically.

The system owns presentation only. Widgets read state and request actions; replicated gameplay remains
in actors, abilities, inventories, and other Fusion-aware components.

## Configure widgets in UISettings

Open the project's `EngineSettings` asset, add the `UI` section, and assign:

- **Default Widget Layer:** a prefab with `WidgetLayer` used as the persistent root;
- **Loading Screen Widget:** a prefab with `ScreenWidget` shown during `GameInstance` travel.

If no default canvas is assigned, `WidgetSubsystem` creates an overlay canvas at runtime with a
1920×1080 reference resolution. The root survives scene travel and belongs to the `GameInstance`.
In multi-peer play, the root is active only while that instance's `ProvideInput` is true. Calling
`GameInstance.SetActiveGameInstance` switches visible widget roots along with input. Code that needs
to react to a direct `ProvideInput` change can subscribe to `GameInstance.OnProvideInputChanged`.

## Widget types

| Type | Use |
| --- | --- |
| `Widget` | Reusable UI block with child widgets, variables, and localization bindings |
| `WidgetLayer` | Persistent root for instantiated widgets |
| `ScreenWidget` | Navigable full-screen state with its own `Canvas` and show/hide animation |
| `WindowWidget` | Modal or additive UI above screens; can close itself |
| `NotificationWidget` | Temporary queued window with optional lifespan |

Put a `Canvas` and `GraphicRaycaster` on the root of each `ScreenWidget` prefab. Set the Canvas
**Sort Order** in the prefab inspector; every screen has independent canvas sorting and the subsystem
does not reorder its GameObjects. A higher order renders above a lower one. `ScreenWidget.ScreenCanvas`
exposes the instance Canvas for changes at runtime, for example `screen.ScreenCanvas.sortingOrder = 50`.
The subsystem enables **Override Sorting** and adds a Canvas and raycaster to older prefabs that lack
them. Newly created fallback canvases use orders 10 for screens, 20 for windows, 30 for notifications,
and 1000 for the loading screen. Keep the root `WidgetLayer` Canvas at order 0 for world markers and
other widgets. Show and hide animation clips are queued so lifecycle callbacks occur after their
visual transition.

Each `ScreenWidget` prefab has a **Capture Cursor** option. When the top visible screen has it
enabled, `WidgetSubsystem` locks the cursor to the center and hides it. Otherwise the cursor is
free and visible. Windows and the loading screen take precedence when their Canvas sorting order
places them above the current screen. Only the `GameInstance` providing input controls the cursor;
switching the active instance reapplies its top screen's setting.

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

`WidgetSubsystem` creates top-level screens, windows, and notifications from their typed
`AssetReference` values. Compose smaller `Widget` blocks as children of those prefabs; construction
walks the child hierarchy, gives every child an inherited variables context, and calls `OnCreated`.

### Pass state and observe the lifecycle

```csharp
public sealed class InventoryScreenState : ScreenState
{
    public InventoryComponent Inventory { get; }

    public InventoryScreenState(InventoryComponent inventory) =>
        Inventory = inventory;
}

InventoryScreen? screen = widgets.ShowScreen(
    inventoryScreen,
    new ScreenShownParameters(
        state: new InventoryScreenState(playerInventory),
        openMode: EScreenOpenMode.Push,
        onShown: shown => analytics.Track("inventory_opened"),
        onHidden: hidden => analytics.Track("inventory_closed")));
```

Inside `InventoryScreen`, read the typed state after construction:

```csharp
protected override void OnWillShown()
{
    base.OnWillShown();
    if (Parameters?.State is InventoryScreenState state)
        Bind(state.Inventory);
}

protected override void OnHidden()
{
    Unbind();
    base.OnHidden();
}
```

Use the callbacks for presentation cleanup and analytics, not authoritative gameplay. The hidden
callback runs after the hide animation and immediately before the widget GameObject is destroyed.

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

Queue destructive confirmations when only one modal should be interactive at a time:

```csharp
widgets.OpenWindow(
    deleteSaveWindow,
    new WindowShownParameters(
        state: new DeleteSaveState(slotId),
        group: "Frontend.Confirmation",
        openMode: EWindowOpenMode.Queue,
        instancePolicy: EWindowInstancePolicy.SingleInstanceInGroup));
```

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

If the underlying item is removed before the toast appears, hide the queued instance directly:

```csharp
if (toast)
    widgets.HideNotification(toast);
```

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

`Widget` automatically binds TMP text containing named placeholders such as `{health:0}` to its
`VariablesContext`. Text beginning with `#` uses the localization table and also receives the
context as Smart String arguments. No binding component is needed on each text object.

Child contexts inherit parent values but can override a key locally. This makes it practical to set a
player name once on a screen and provide per-slot values inside inventory child widgets.

## World markers

World-marker responsibilities are split between three Framework types:

- `WorldMarker` describes the world target, widget prefab, offset, distance and occlusion settings;
- `WorldMarkerWidget` is the extensible screen-space presentation created for a registered marker;
- `WorldMarkerSubsystem` creates marker widgets in the root `WidgetLayer`, then centrally projects,
  range-culls and occlusion-tests every marker in its `World`.

Use `Bind(target, offset)` for runtime-spawned actors and `SetVisible` for gameplay-driven availability.
The subsystem requests the camera depth texture and runs occlusion queries in the target's `PhysicsScene`,
so overlay views remain correctly isolated in Fusion Multi-Peer scenes. Compact Showcase uses this path
for level labels, sample-specific interaction prompts and the widget-based NPC health bar; characters
contain no marker scan.

### Configure a marker

Add `WorldMarker` to the world object and configure:

- **Widget Prefab** — a prefab containing `WorldMarkerWidget`;
- **Anchor** and **Local Offset** — the transform and local position projected to the screen;
- **Culling Mode** — distance plus viewport, or distance only for an off-screen indicator;
- **Fade Start Distance** and **Maximum Visible Distance** — the range fade;
- **Occlusion Mode** — `None`, `Hide`, or `Fade`;
- **Occlusion Mask**, radius, and padding — what blocks the marker and how broadly it is sampled.

For an actor created at runtime, a project-specific marker can expose its gameplay model while the
widget remains presentation-only:

```csharp
public sealed class ObjectiveWorldMarker : WorldMarker
{
    public string Label { get; private set; } = string.Empty;

    public void Initialize(Transform target, string label)
    {
        Label = label;
        Bind(target, new Vector3(0f, 1.8f, 0f));
        SetVisible(true);
    }
}

public sealed class ObjectiveWorldMarkerWidget : WorldMarkerWidget
{
    [SerializeField] private TMP_Text label = null!;

    protected override void OnMarkerBound(WorldMarker marker)
    {
        if (marker is ObjectiveWorldMarker objective)
            label.text = objective.Label;
    }

    protected override void OnMarkerUnbound(WorldMarker marker)
    {
        label.text = string.Empty;
    }
}
```

Do not run `Camera.WorldToScreenPoint` independently in every marker component. The world subsystem
batches ownership, projection, culling, and occlusion and creates the widget in the correct
`WidgetLayer` for the active peer.

Typical uses include player names, NPC health bars, interaction prompts, quest objectives, damage
directions, and off-screen targets. For a marker that must remain visible at the screen edge, use
`DistanceOnly` and clamp its visual position in the derived widget.

## Loading screen and lifecycle events

`WidgetSubsystem` subscribes to `GameInstance.OnBeginLoadWorld` and `OnWorldLoadComplete`. It shows the
configured loading widget before travel and hides it when the new world is ready. You can also call
`ShowLoadingScreen` and `HideLoadingScreen` manually for non-travel content work.

The subsystem publishes `OnScreenShown`, `OnScreenHidden`, `OnWindowShown`, `OnWindowClosed`,
`OnNotificationShown`, and `OnNotificationHidden` for presentation coordination and analytics.

The subsystem shows it on `GameInstance.OnBeginLoadWorld` and hides it on `OnWorldLoadComplete`.
If the project can recover from travel without shutting down, also close the overlay from its failure
handler:

```csharp
gameInstance.OnTravelFailure += (_, reason) =>
{
    widgets.HideLoadingScreen();
    ShowTravelError(reason);
};
```

`BeginHide` lets the configured hide animation complete before the widget is destroyed.

For local content work that does not perform travel, bracket the operation manually:

```csharp
WidgetSubsystem widgets = gameInstance.GetSubsystem<WidgetSubsystem>()!;

widgets.ShowLoadingScreen();
try
{
    await LoadFrontendCatalogAsync();
}
finally
{
    widgets.HideLoadingScreen();
}
```

The manual API is presentation state, not network synchronization. For additive Fusion levels, await
`World.LoadSceneAsync` on the authoritative flow and decide separately whether every peer needs a
full-screen overlay or a smaller streaming indicator.

Next: [Diagnostics](diagnostics.md) · [Developer Console](developer-console.md).
