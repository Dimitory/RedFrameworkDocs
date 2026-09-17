# Inventory, Equipment, and Interaction

Build this path in layers: define one item, put it in an inventory, equip it, then add a world pickup.
Testing each handoff separately is much easier than wiring a complete loot loop at once.

## RedEngine.Gameplay.Inventory

`ItemDefinition` is a networked ScriptableObject prototype. Behavior is composed from
`EntityFragment` types: attributes, abilities, effects, inventory, and affixes. A runtime
item is a `NetworkModel` class named `ItemInstance`, and `InventorySlot` is a nested
NetworkModel stored by `ReplicatedCollection<InventorySlot>`. `ItemInstance` reconstructs
its fragments locally from `ItemDefinition` and `Seed`; generated affixes follow the same
deterministic path on authority and proxies. Definitions are wrapped and restored by generated
serialization, so gameplay code does not handle GUID/buffer conversion.

![Placeholder: ItemDefinition with schema and fragments](/images/inventory-item-definition-placeholder.svg)

### Built-in item fragments

RedEngine already includes the common building blocks. Compose an item from these before creating a
project-specific fragment:

| Fragment | What it contributes |
| --- | --- |
| `EntityFragmentInventory` | Grid footprint (`Width`, `Height`) and inventory-facing stack settings |
| `EntityFragmentStack` | Replicated quantity, maximum quantity, add/remove behavior |
| `EntityFragmentDurability` | Authored maximum and replicated current durability |
| `EntityFragmentRarity` | Deterministic rarity selection between configured minimum and maximum tags |
| `EntityFragmentAffixes` | Deterministic affix rolls from a pool, driven by rarity metadata and item seed |
| `EntityFragmentAttributes` | Attribute modifiers contributed by the item |
| `EntityFragmentAbilities` | Gameplay abilities granted while the item is equipped |
| `EntityFragmentEffects` | Gameplay effects granted while the item is equipped |

The definition contains prototypes. `ItemInstance` rebuilds local fragments from the definition, then
uses the replicated `Seed` to reproduce generated rarity and affixes. Only mutable fields marked for
fragment replication need network payload.

```csharp
using RedEngine.Gameplay.Inventory;

EntityFragmentAbilities? abilities = itemDefinition
    .GetFragment<EntityFragmentAbilities>();

if (abilities != null)
{
    foreach (GameplayAbility ability in abilities.GrantedAbilities)
        PreviewGrantedAbility(ability);
}
```

### Use schemas to keep definitions consistent

`EntityTypeSchema` is an authoring contract for a family of items—for example Weapon, Consumable, or
Armor. Assign it to `ItemDefinition.TypeSchema` and configure:

- **Fragment Rules:** the allowed fragment types and their prototype values;
- **Required:** automatically add the rule's fragment when missing;
- **Forbidden Fragments:** remove disallowed base or derived fragment types.

Normalization removes null, forbidden, unlisted, and duplicate fragments; adds required fragments; and
lets fragments that support prototype application inherit schema defaults. The schema's **Apply
Defaults** action normalizes every `ItemDefinition` that references it.

![Placeholder: EntityTypeSchema rules and normalization](/images/inventory-schema-placeholder.svg)

A practical weapon schema might require `EntityFragmentInventory`, `EntityFragmentDurability`, and the
equipment fragment; allow Abilities, Effects, Attributes, Rarity, and Affixes; and forbid Stack for
weapons that must remain individual instances.

::: tip Schema rules form an allow-list
When a definition has a schema, fragments without a matching rule are removed during normalization.
Add optional fragment types as non-required rules before adding them to an item.
:::

Modify slots only on the state authority:

```csharp
if (inventory.Object.HasStateAuthority)
{
    bool added = inventory.Layout.Add(item);
    bool moved = inventory.Layout.Move(item, new InventoryPlacement(3));
}
```

Fragments are local by default. Opt in only mutable runtime state that cannot be reconstructed:

```csharp
[Serializable, NetworkFragment]
public sealed partial class EntityFragmentDurability : EntityFragment
{
    [SerializeField] private float max;
    [SerializeField, NetworkField] private float current;

    public float Max => max;
    // Current is generated; assigning it marks this fragment dirty.
}
```

The generated `Current` property is the mutation API. `Max` is never included in the fragment
serializer and survives network reads. `GetFragment<T>()` returns the fragment or `null`;
use `TryGetFragment<T>(out T fragment)` when branching explicitly. Fragment type IDs use deterministic
FNV-1a hashes and collisions fail compilation with `REDFRAG001`.

Item network state is bounded to eight network fragments with at most sixteen words each.
Serialization uses a per-fragment revision and performs no reflection or hot-path allocation.
The generator reports invalid declarations and fields through `REDFRAG002`-`REDFRAG006`.

`ItemDefinition` is the inventory identifier; `ItemInstance` has no separate ID. Stackable items
with `EntityFragmentStack` merge when their definitions match, while overflow may occupy additional
placements. This makes simple consumables usable without creating or tracking an instance identifier:

```csharp
bool added = inventory.Layout.Add(potionDefinition);
bool consumed = inventory.Layout.Remove(potionDefinition);

EntityFragmentStack? stack = item.GetFragment<EntityFragmentStack>();
ushort quantity = stack?.Quantity ?? 1;
```

Initial inventory entries serialize an `ItemInstance` directly together with its definition, seed,
and fragment state. Set `Definition` and `Seed` in the inspector. Use the `ItemInstance` overloads
when an operation must target one exact non-stackable runtime object. An instance's definition,
seed, and fragment composition are fixed after creation; item-specific data is read from its fragments.

Inventory placement is defined by an `InventoryLayout` asset. `SlotInventoryLayout` uses one
integer slot index. `TetrisInventoryLayout` uses `InventoryPlacement(x, y)` on a rectangular grid
and rejects items that cross the grid boundary or overlap any occupied cell. Configure an item's
rectangular footprint with `EntityFragmentInventory.Width` and `Height`; definitions without that
fragment occupy one cell. `GetAtCell(x, y)` returns an item even when the queried cell is not its
top-left placement.

```csharp
var placement = new InventoryPlacement(x: 2, y: 1);
if (inventory.Layout is TetrisInventoryLayout grid && grid.CanPlace(item, in placement))
    grid.Add(item, in placement);
```

Run normalization as part of authoring or validation, never during simulation. Runtime item instances
consume the already-normalized definition.

## RedEngine.Gameplay.Equipment

`EquipmentLayout` describes slots, `EquipmentComponent` manages equipped items, and
`Equipment` is the spawnable actor representation of an item.
`EquipmentAbilityController` synchronizes abilities granted by equipment.

Create an item definition with `EntityFragmentEquipment`, assign an equipment prefab and a
slot in the layout, and perform programmatic operations through `EquipmentComponent`. This
ensures replicated slots, abilities, and representations are updated together.

```csharp
public sealed class LanternEquipment : Equipment
{
    public override void ApplyDefinition()
    {
        base.ApplyDefinition();
        // Apply visual or runtime settings from the definition.
    }
}
```

## RedEngine.Gameplay.Interaction

Grant one `InteractAbility` to the interacting actor. The ability starts its deterministic
target scan in `OnGranted`; activating it directly runs the selected target's interaction
coroutine. Networked targets implement `IInteractable` or derive from `Interactable`.

```csharp
using System.Collections;
using RedEngine.Core;
using RedEngine.Gameplay.Interaction;

public sealed class Terminal : Interactable
{
    public override IEnumerator Interact(Actor interactor)
    {
        if (!ValidateInteractionRequest(interactor))
            yield break;

        // Change the terminal state on the authority.
        yield break;
    }
}
```

`InteractAbility` uses Fusion-tick coroutine waits and invokes interactions on state authority;
interactables do not need RPCs to forward interaction requests.

The built-in `Door` and `PickupItem` types serve as reference implementations. The ability
revalidates distance and angle immediately before activation; interactables change state only
on the authority, while the UI prompt may remain local.
