# Inventory Sample

This walkthrough traces a world pickup through the showcase inventory and into the HUD.

## Pickup path

1. `InteractAbility` selects the framework `PickupItem` component.
2. Authority inserts its definition through `CharacterInventory.Layout.Add`.
3. The pickup actor despawns only when insertion succeeds.
4. Its `RespawnPoint` notices the missing actor, starts a `TickTimer`, then spawns a replacement.
5. The weapon equips when picked up. Number keys 1–3 consume potions, toggle the weapon's equipment, or move ammunition into the equipped weapon's reserve. Ammunition remains in the inventory when no weapon is equipped or its reserve is full.

```csharp
if (inventory.Layout.Add(itemDefinition))
    Owner.Destroy();
```

The definitions illustrate three schema families: weapons, consumables, and ammunition. Inspect
their required fragments and compare stackable ammunition with a distinct weapon instance.

`ShowcaseHud` reads actual inventory placements and writes each catalog ID into `slot0` through `slot5`.
This example favors clarity; a production UI can derive reusable slot widgets from the same layout.

Continue with [Manual: Inventory](../manual/inventory.md) and
[Manual: Equipment](../manual/equipment.md).
