# Inventory

Inventory separates authored item definitions from deterministic runtime instances. Define the item,
compose it from fragments, normalize it with a scheme, and let an `InventoryLayout` own placement and
replication.

## Definitions and instances

`ItemDefinition` is a `NetworkScriptableObject` prototype. `ItemInstance` is a generated network model
containing the definition, deterministic seed, and runtime fragment collection.

```csharp
if (!ItemInstance.TryCreate(potionDefinition, default, seed: 1, out var potion))
    return;

bool added = inventory.Layout.Add(potion);
```

The definition and seed reconstruct authored and generated fragment data on every peer. Mutable fields
marked with the inventory `[Replicated]` annotation occupy network payload.

![ItemDefinition with scheme and fragments](/images/inventory-item-definition.png)

## Built-in fragments

| Fragment | Purpose |
| --- | --- |
| `EntityFragmentInventory` | Grid width and height |
| `EntityFragmentStack` | Replicated quantity and authored maximum quantity |
| `EntityFragmentDurability` | Authored maximum and replicated current durability |
| `EntityFragmentRarity` | Deterministic rarity selection |
| `EntityFragmentAffixes` | Deterministic affix rolls from rarity metadata and seed |
| `EntityFragmentAttributes` | Attribute contribution |
| `EntityFragmentAbilities` | Abilities granted by equipment |
| `EntityFragmentEffects` | Effects applied by equipment or consumed by `ConsumeAbility` |

Read optional behavior through the definition or runtime instance:

```csharp
if (item.TryGetFragment<EntityFragmentStack>(out var stack))
    quantityLabel.text = stack.Quantity.ToString();
```

## Schemes

`ItemScheme` is an authoring contract for a family such as Weapon, Consumable, or Armor. Its rules
define allowed fragment types, required fragments, forbidden fragments, and prototype defaults.

Normalization removes null, forbidden, unlisted, and duplicate fragments, adds required fragments,
and applies supported prototype defaults. Run it while authoring or validating content, never during
network simulation.

::: tip Scheme rules are an allow-list
When a definition has a scheme, an optional fragment still needs a non-required rule. Otherwise
normalization removes it.
:::

![ItemScheme rules and normalization](/images/inventory-schema.png)

## Slot and tetris layouts

`SlotInventoryLayout` stores a one-dimensional slot index and respects `UnlockedSlots`.
`TetrisInventoryLayout` stores `(x, y)` and rejects items outside the grid or overlapping occupied
cells. Items without `EntityFragmentInventory` use a `1 × 1` footprint.

```csharp
if (!inventory.Object.HasStateAuthority)
    return;

var placement = new InventoryPlacement(x: 2, y: 1);
if (inventory.Layout is TetrisInventoryLayout grid &&
    grid.CanPlace(item, in placement))
{
    grid.Add(item, in placement);
}
```

`GetAtCell(x, y)` returns the item covering the cell, even when that cell is not its top-left origin.
Use the `ItemInstance` overloads when an operation must target one exact non-stackable object.

## Stacking and mutation

Items stack when their definitions match and both support `EntityFragmentStack`. Overflow may continue
into another placement.

```csharp
bool added = inventory.Layout.Add(ammoDefinition);
bool consumed = inventory.Layout.Remove(ammoDefinition, quantity: 3);
bool moved = inventory.Layout.Move(item, new InventoryPlacement(4));
```

`OnInventoryChanged` reports add, remove, move, layout, and content changes for UI. Treat the event as a
presentation signal; mutation still belongs to State Authority.

## Use a slot

`GrantAbilityAndActivate(consumeAbility, sourceObject: character.Object, sourceIndex: slot)` grants a
`ConsumeAbility` for the selected inventory slot. The ability reads the item at a slot placement, applies every effect from its
`EntityFragmentEffects`, and removes one item only after activation succeeds. A slot without consumable
effects is rejected, allowing another slot action such as `EquipAbility` to handle the same button.

## Replicated fragment fields

Make the fragment a sealed partial class. Ordinary serialized fields are copied from the prototype;
mark only mutable runtime fields with `RedEngine.Gameplay.Inventory.Replicated`:

```csharp
[Serializable]
public sealed partial class EntityFragmentCharges : EntityFragment
{
    [SerializeField, Min(1)] private ushort maximum = 3;
    [SerializeField, Replicated, Min(0)] private ushort current = 3;

    public ushort Maximum => maximum;
    public ushort Current => current;
}
```

The generator supplies prototype application, deterministic type ID, serializer, and registration.
An occupied inventory entry reserves 64 network words for its complete fragment payload. Invalid
declarations and unsupported fields produce `REDFRAG` compile diagnostics.

## Common failure checks

- Mutation returns `false`: confirm State Authority, layout capacity, placement, and item validity.
- A fragment disappears: add it to the assigned scheme's rules and normalize again.
- Peers disagree on generated content: verify they use the same definition and non-zero seed.
- Stack quantity does not change: confirm both items share the same definition and stack fragment.

Try it: [Recipe: Inventory Pickup](../learn/recipes/inventory-pickup.md).

Next: [Equipment](equipment.md).
