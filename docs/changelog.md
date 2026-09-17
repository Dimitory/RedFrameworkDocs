# Changelog

## 0.1.0

- Apply the network-model analyzer to every runtime assembly, restoring generated inventory-fragment
  `TypeId` constants and serializers outside the `RedEngine.Network` assembly.
- Ensure the generated network ScriptableObject table is labeled as Fusion's default global and
  return safe serialization/preload failures when the table is unavailable instead of throwing.
- Split trace, melee, and projectile attacks into `RangedWeapon`, `MeleeWeapon`, and
  `ThrowableWeapon`; projectile launch values now travel as `ProjectileLaunchParameters`, while the
  projectile subsystem only pools and ticks local visuals and state authority applies damage.
- Replace presentation definitions with pooled `PresentationBehaviour` prefabs, add stable GUID
  serialization for presentation RPCs, and replicate feedback context through `NetworkId` values.
- Reworked subsystem construction so `SimulationBehaviour` subsystems register themselves as
  Fusion globals and no longer require subsystem-specific driver components.
- Moved the serialized type selector to Foundation as the generic `TypeReference<TBase>`, removed
  legacy serialized-name fallbacks, and standardized public API class regions.
- Removed empty and fully commented-out framework source files.
- Force Fusion weaving for the Compact Showcase runtime assembly so its network behaviours work
  without host-project `NetworkProjectConfig` changes.
- Update Fusion Weaver configuration for the renamed `RedEngine.Gameplay.Movement` assembly, force
  weaving for that module, and remove the obsolete `RedEngine.Gameplay.CharacterController` entry.
- Defer `ReplicatedCollection` serializer lookup until network state is accessed so Unity component
  construction cannot race generated `NetworkModel` registration.
- Validate a missing `EngineSettings.NetworkRunner` before travel and include a ready-to-assign
  Fusion runner prefab in Compact Showcase.
- Expanded Compact Showcase with asset-driven ability input, prefab-authored UI events, a Cinemachine
  camera rig, a replicated moving platform and lava hazard, six inventory slots, and potion/ammo pickups.
- Fixed periodic Gameplay Effect expiration ordering and equipment ability source binding.
- Consolidated package samples into a small Compact Multiplayer Showcase with Framework `InputSettings`,
  Cinemachine follow, a weapon, tick-driven moving cubes, a respawning NPC health bar, and a bound
  multi-screen UI flow.
- Added `InlineScriptableObject` inspector support for creating and editing nested sub-assets while
  retaining ordinary external references, including concrete subtype selection for polymorphic fields.
- Simplified inventory layout replication by folding layout and placement serialization into a
  stack-only `InventoryNetworkState`, and removed the serializer interface and network-layout wrappers.
- Added `TetrisInventoryLayout` with rectangular grid placement and item footprints configured by
  `EntityFragmentInventory.Width` and `Height`.
- Removed `ItemInstanceId`; inventories now identify and merge items by `ItemDefinition`, support
  direct definition-based consumable operations, and retain instance overloads for exact objects.
- Reduced the public inventory mutation API to `Add`, `Remove`, and `Move`; removed item shortcuts
  for quantity, affixes, stacking, and removal so item data is accessed through fragments.
- Collapsed projectile logic, runtime state, and presentation into one non-replicated
  `Projectile` MonoBehaviour and removed prediction keys, rollback history, simulation type switches,
  and obsolete aliases. Projectile prefabs now own all movement, collision, and feedback behavior.
- Moved lock-on state, target acquisition, validation, and cleanup from `RangedWeapon` into
  `WeaponTargetLockAbility`; firing now only receives the selected target ID.
- Removed `WeaponShotRecord`; `RangedWeapon` now exposes only replicated firing fields and passes
  their values directly to `Projectile.Shoot`. Active projectiles outlive their source weapon.
- Moved interaction scanning and target ownership into `InteractAbility`, made interactions
  coroutine-based, and removed the legacy scanning component and interaction RPC forwarding.
- Reworked `RedEngine.Assets` initialization into an ordered Addressables, scene, AssetBundle
  manifest, bundle preload, and network-asset pipeline with logged result-based failures and
  deterministic handle cleanup.
- Changed `ItemInstance` from an `INetworkStruct` value to a `NetworkModel` class while
  keeping inventory and equipment replication backed by its generated unmanaged state.
- Extended the NetworkModel generator to use Fusion `[Networked]` members, nested models,
  `NetworkWrap`/`NetworkUnwrap`, generated serializers, and automatic registration.
- Converted `InventorySlot` into a NetworkModel and taught `ReplicatedCollection<T>` to
  serialize NetworkModel objects directly, with dirty-only writes and revision-gated
  reconciliation.
- Removed the ItemRuntimeData registry, persistence buffer, and generator; deterministic item
  fragments and affixes are rebuilt from `ItemDefinition` plus `Seed`.
- Moved authored initial-item application into `Inventory` and removed the separate
  `InventoryInitializer` network component.
- Converted `ItemAffixInstance` into a nested NetworkModel runtime `ItemFragment` and renamed
  the item rarity gameplay-tag type to `RarityTag`.
- Converted `RuntimeAbilitySlot` to a generated NetworkModel and added the one-parameter
  `ReplicatedCollection<T>` API for NetworkModel classes.
- Converted `RuntimeEffectSlot` to a generated NetworkModel and removed the custom-serializer
  variant and adapter layers from `ReplicatedCollection<T>`.
- Added strict `REDNET001`-`REDNET003` NetworkModel diagnostics, explicit null presence for nested
  reference models, and deterministic Unity editor/runtime serializer registration.
- Added dirty-slot writes and rollback-safe raw-word shadows to `ReplicatedCollection<T>` through
  `SetDirty`, `WriteChanges`, and `ReadChanges` while preserving runtime object identity.
- Added `[Replicated(MaxCapacity)]` generation of concrete Fusion `NetworkArray` backing state,
  automatic `RedNetworkBehaviour` lifecycle synchronization, logical prefab capacity validation,
  and per-slot `Added`/`Removed`/`Changed` reconciliation. `AbilitySystem` is the first migrated user.
- Added opt-in `[NetworkFragment]`/`[NetworkField]` generation with deterministic type IDs,
  collision diagnostics, generated dirty-aware properties, fixed bounded `ItemInstance` fragment
  state, and revision-gated application that leaves deterministic prototype fields untouched.
- Changed initial inventory authoring to store complete `ItemInstance` values and validate them
  without routing initialization through `ItemInstanceFactory`.
- Replaced `NetworkAssetAttribute` and content-pack network metadata with the generated
  `.redassets` table, standalone 128-bit `NetworkAssetReference`, and an always-loaded
  `NetworkScriptableObject` index backed directly by `AssetReference<T>` providers.
- Reworked `AssetReference<T>` around automatically selected static, Resources, and
  Addressables providers returning `AsyncOperationHandle<T>`, including migration of existing
  `directAsset` data.
- Initial package migration.
- Added Runtime, Editor, Samples~, and Documentation~ layout.
- Added in-game diagnostics console with automatic command registration.
- Added ScriptableObject-based GameInstance subsystem path.
- Added WorldSceneManager to separate world lifecycle from scene loading.
- Added Basic Sample scene generator and playable sample scripts.
