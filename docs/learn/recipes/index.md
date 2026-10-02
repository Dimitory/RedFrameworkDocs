# Recipes

Recipes connect the first playable scene to the system-level Manual. Each introduces an observable
change in approximately 10–20 minutes and concludes with a multiplayer verification step.

## Recommended order

1. [Host, join, and travel](host-join-travel.md)
2. [Add a dash ability](add-dash-ability.md)
3. [Create a periodic damage hazard](periodic-damage-hazard.md)
4. [Put a pickup into inventory](inventory-pickup.md)
5. [Equip a weapon](equip-weapon.md)
6. [Open a UI screen](open-ui-screen.md)
7. [Add a world marker](add-world-marker.md)
8. [Stream an additive level](stream-additive-level.md)

Select the recipe relevant to your immediate task, verify its behavior, then consult the linked
Manual page for the wider system contract.

Every recipe contains an execution-model block. Read it before implementing the steps: it identifies
what belongs to State Authority, what is safe to predict on Input Authority, which values replicate,
and which effects must stay local presentation.

::: tip Keep the showcase available
Several recipes ask you to duplicate a working showcase asset. This keeps each exercise focused on
one integration point rather than configuring an entire subsystem at once.
:::
