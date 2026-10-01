# Recipe: Put a Pickup into Inventory

**Outcome:** interacting with a world object adds one item, despawns it, and lets a separate point respawn it.

::: info Execution model
- **Authority** — State Authority creates and inserts the item and starts the respawn timer.
- **Prediction** — inventory mutation is not predicted; the client may show a pending interaction only.
- **Replicated** — pickup availability, respawn deadline, item definition, seed, quantity, and placement.
- **Local only** — prompt, pickup glow, sound, toast, and drag/slot animation.
:::

## 1. Create the item

Create an `ItemDefinition`, assign its catalog ID, and apply an `ItemScheme`. For the first test, use a
one-cell item with no generated affixes. Confirm the definition passes schema normalization.

## 2. Configure the character

Add `CharacterInventory` and assign a small `SlotInventoryLayout`. Grant `InteractAbility` and confirm
the input prompt already works with a simple interactable.

## 3. Create the pickup

Add `PickupItem` to an actor prefab, assign its definition and marker, and register the actor with Fusion.
The authoritative interaction inserts the item through the layout:

```csharp
if (inventory.Layout.Add(itemDefinition))
    Owner.Destroy();
```

Place a `RespawnPoint`, assign that pickup prefab, and configure its replicated respawn delay.

## Verify

Pick the item up with peer one. Both peers should see the pickup disappear, but only the interacting
character's inventory should contain it. Wait for the replicated respawn timer and collect it again.

## Understand the system

Continue with [Manual: Inventory](../../manual/inventory.md) for fragments, schemas, stacks, slot
layouts, and tetris placement.
