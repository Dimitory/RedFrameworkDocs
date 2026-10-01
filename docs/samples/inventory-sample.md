# Inventory Sample

This walkthrough follows a world pickup into the showcase inventory and HUD.

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

The definitions demonstrate three schema families: weapon, consumable, and ammunition. Inspect their
required fragments and compare stackable ammo with the individual weapon instance.

`ShowcaseHud` reads actual inventory placements and writes each catalog ID into `slot0` through `slot5`.
This is deliberately simple; production UI can build reusable slot widgets from the same layout.

Continue with [Manual: Inventory](../manual/inventory.md) and
[Manual: Equipment](../manual/equipment.md).
