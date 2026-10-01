# Recipe: Equip a Weapon

**Outcome:** one inventory item spawns a weapon in an equipment slot and grants its fire ability.

::: info Execution model
- **Authority** — State Authority equips the item, spawns the weapon, and grants its abilities.
- **Prediction** — fire or reload may predict only when the individual ability policy permits it.
- **Replicated** — equipment slot, weapon actor, ammo, reload state, hits, and damage results.
- **Local only** — presentation socket smoothing, muzzle flash, tracer visual, recoil, audio, and crosshair.
:::

## 1. Start from the showcase weapon

Duplicate the showcase weapon definition, prefab, and scheme. Change its catalog ID and visuals, but
keep the existing equipment and ability fragments for the first run. The equipment fragment's
**Default Slot** selects the character socket, while **Equip Ability**, **Unequip Ability**, and
**Equip On Pickup** control pickup and inventory button actions.

## 2. Add the slot

On `CharacterEquipment`, add the weapon's `EquipmentSlotTag` and simulation socket. If the character
uses a smoothed visual root, also assign a presentation socket and keep the weapon's presentation root
separate from its network transform.

## 3. Equip on authority

Resolve the exact `ItemInstance` that entered inventory and equip it through the character component:

```csharp
if (character.Object.HasStateAuthority)
    character.Equipment.EquipItem(item, weaponSlot);
```

`CharacterEquipment` spawns the definition's prefab, fills the replicated slot, and grants abilities
from `EntityFragmentAbilities` using the equipment instance as their source.

## Verify

With two peers, collect and equip the item. Both peers should see the weapon on the same character.
Only that character should receive its fire/reload input. Unequip it and confirm the instance and
source-granted abilities are removed.

## Understand the system

Continue with [Manual: Equipment](../../manual/equipment.md) and
[Manual: Weapon](../../manual/weapon.md).
