# UI Sample

The showcase demonstrates four UI workflows: screen navigation, loading state, HUD variables, and
world markers.

## Screens and loading

`ShowcaseMainMenuWidget` opens the game and pushes the instructions screen. The loading screen is
configured in `EngineSettings`; `WidgetSubsystem` shows it during travel and lets its hide animation
finish after the world and local character are ready.

## HUD variables

`ShowcaseHud` subscribes to the local `ShowcasePlayerController.OnActiveCharacterChanged` event
after the world loads. It publishes health, stamina, inventory, equipment, and ammunition through
`SetVariable`:

```csharp
SetVariable("health", abilitySystem.GetCurrentValue(new AttributeReference("Health")));
SetVariable("inventoryCount", inventoryCount);
SetVariable("ammoMagazine", weapon.AmmoInMagazine);
```

The HUD's TMP strings contain named placeholders such as `{health:0}` and `{ammoMagazine}`. The parent
`Widget` binds them to its variables automatically. Replicated gameplay remains on the character and
weapon; the widget holds no authoritative state.

## World markers

Specialized markers present labels, interaction prompts, and dummy health. `WorldMarkerSubsystem`
performs camera projection, distance fade, viewport checks, and occlusion centrally for the active
world and peer.

Continue with [Manual: UI](../manual/ui.md).
