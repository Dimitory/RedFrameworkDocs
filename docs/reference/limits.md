# Limits

RedEngine uses fixed capacities where network layouts must remain deterministic. Treat these values as
part of the current runtime contract and verify them again when upgrading.

| Area | Current limit or constraint |
| --- | --- |
| Ability slots | 16 replicated slots per `AbilitySystemComponent` |
| Active effect slots | 16 replicated slots per `AbilitySystemComponent` |
| Attribute entries | 32 networked entries per `AbilitySystemComponent` |
| Equipment entries | 32 networked entries per `CharacterEquipment` |
| Gameplay tags in `TagsContainer` | 32 networked entries |
| Type-erased gameplay tag name | 64 characters |
| Generated tag-domain string capacity | One of 2, 4, 8, 16, 32, 64, 128, 256, or 512 characters |
| Inventory fragment payload | 64 network words in each occupied inventory entry |
| Attribute effect parameters | Fixed 256-byte storage; runtime capacity depends on entry size |
| Character trigger overlap tracking | 32 colliders per fixed query buffer |
| General `World` physics query buffer | 128 hits |
| Buffered diagnostics | 1000 messages before older entries are discarded |
| Travel readiness waits | 30 seconds for scene and local-player readiness |
| Projectile visual pool | Default hard capacity of 64 per prefab pool |

Additional constraints:

- only one `EngineSettings` default asset should exist in `Resources`;
- a gameplay scene must contain exactly one authoritative game mode;
- only one travel is processed at a time; later requests queue;
- a concrete subsystem exists once per owning game instance or world;
- gameplay-tag structs must be top-level non-readonly `partial struct` declarations;
- replicated collection owners must be non-generic partial `RedNetworkBehaviour` classes;
- network actor prefabs require `NetworkObject` and Fusion registration;
- replicated gameplay timers must use Fusion `TickTimer`.

Do not design content exactly at a limit without testing overflow and failure behavior.
