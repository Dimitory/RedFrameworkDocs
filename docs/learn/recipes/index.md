# Recipes

Recipes bridge the first playable scene and the system-level Manual. Each one makes a small,
observable change in roughly 10–20 minutes and ends with a multiplayer verification step.

## Recommended order

1. [Host, join, and travel](host-join-travel.md)
2. [Add a dash ability](add-dash-ability.md)
3. [Create a periodic damage hazard](periodic-damage-hazard.md)
4. [Put a pickup into inventory](inventory-pickup.md)
5. [Equip a weapon](equip-weapon.md)
6. [Open a UI screen](open-ui-screen.md)
7. [Add a world marker](add-world-marker.md)
8. [Stream an additive level](stream-additive-level.md)

You do not need to complete every recipe. Choose the closest feature, make it work, then open the
linked Manual page to understand the wider system.

Every recipe contains an execution-model block. Read it before implementing the steps: it identifies
what belongs to State Authority, what is safe to predict on Input Authority, which values replicate,
and which effects must stay local presentation.

::: tip Keep the showcase imported
Several recipes ask you to duplicate a known-good showcase asset. This keeps the exercise focused on
one relationship instead of making you configure an entire subsystem at once.
:::
