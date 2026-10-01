# Equipment

Equipment turns an inventory item into a replicated actor attached to a character slot. It also grants
the item's abilities and effects while that equipment remains active.

## Main types

| Type | Responsibility |
| --- | --- |
| `CharacterEquipment` | Slot/socket configuration and replicated equipped instances |
| `EquipmentSlotTag` | Strong slot identity such as Weapon or Head |
| `EntityFragmentEquipment` | Equip and unequip abilities, allowed slots, default slot, and pickup behavior |
| `EquipAbility` / `UnequipAbility` | Ability System entry points for equipment changes |
| `EquipmentInstance` | Spawned actor representation of the item |
| `EntityFragmentAbilities` | Abilities granted from the equipment source |
| `EntityFragmentEffects` | Effects applied while equipped |

The equipment prefab comes from `ItemDefinition.Prefab`. The prefab must contain `NetworkObject` and a
concrete `EquipmentInstance`, and it must be available to Fusion spawning.

## Configure the character

On `CharacterEquipment`, map each `EquipmentSlotTag` to a deterministic simulation socket. For a
smoothed moving character, add a matching presentation socket under the visual root.

On the equipment prefab, assign `EquipmentInstance.Presentation Root` to a visual-only child. During
`Render`, that child follows the presentation socket without feeding interpolated transforms into the
replicated actor pose.

## Configure the item

1. Assign the equipment prefab to `ItemDefinition.Prefab`.
2. Add `EntityFragmentEquipment` and list its allowed slots. An empty list permits any configured slot.
   Set **Default Slot** to the character's slot name (for example, `Equipment.Weapon.Primary`).
   Assign **Equip Ability** and **Unequip Ability**. Enable **Equip On Pickup** to activate the equip
   ability when collected through `PickupItem`.
3. Add `EntityFragmentAbilities` for fire, reload, block, or other equipment actions.
4. Add `EntityFragmentEffects` for effects that should remain while equipped.
5. Ensure the assigned `ItemScheme` allows these fragments, then normalize the definition.

## Equip and unequip

```csharp
CharacterEquipment equipment = character.GetComponent<CharacterEquipment>();
if (!character.Object.HasStateAuthority || !equipment)
    return;

bool equipped = equipment.EquipItem(item, weaponSlot);
```

`EquipItem` validates the character socket and allowed slot, spawns the prefab through `World`, stores
the replicated instance, grants abilities with the equipment `NetworkObject` as their source, applies
configured effects, and calls `OnEquipped`.

`PickupItem` adds the item to inventory first, then activates its configured `EquipAbility` when
**Equip On Pickup** is enabled. If equipping fails, the collected item stays in inventory. The Compact
Showcase inventory keys activate `UnequipAbility` for an equipped item and `EquipAbility` otherwise;
consumable items continue to activate their consume ability. `EquipAbility` uses the fragment's
default slot, falling back to its own configured slot for older items.

```csharp
if (character.Object.HasStateAuthority && equipment)
    equipment.UnequipItemFromSlot(weaponSlot);
```

Unequip revokes abilities granted by that source, removes effects associated with the equipment
object, clears the slot, calls `OnUnequipped`, and normally destroys the actor.

## Create an equipment implementation

```csharp
public sealed class LanternEquipment : EquipmentInstance
{
    [Networked] public bool IsLit { get; private set; }

    public void SetLit(bool value)
    {
        if (Object.HasStateAuthority)
            IsLit = value;
    }
}
```

Keep mutable gameplay state on the equipment actor or its components. Read authored values from
`ItemInstance.Definition` and fragments.

## Common failure checks

- `CanEquipItem` fails: confirm the character has the slot and the fragment permits it.
- Nothing spawns: confirm `ItemDefinition.Prefab`, `NetworkObject`, and Fusion prefab registration.
- Ability remains after unequip: grant it through the equipment fragment/source path, not independently.
- Visuals jitter: separate the presentation root and configure the matching presentation socket.

Try it: [Recipe: Equip a Weapon](../learn/recipes/equip-weapon.md).

Next: [Interaction](interaction.md).
