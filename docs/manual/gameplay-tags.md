# Gameplay Tags

Gameplay tags are small network-safe identifiers such as `State.Stunned` or `Item.Rarity.Rare`. Their
dot-separated names form hierarchies. The built-in `GameplayTag` is itself a `[GameplayTag]` domain and
is authored in the same registry as project-defined tag types. Additional strongly typed domains keep
unrelated tag categories from being mixed accidentally.

## Separate domains are separate types

```csharp
using RedEngine.Gameplay.GameplayTags;

[GameplayTag("#E57373")]
public partial struct DamageTypeTag { }

[GameplayTag("#4FC3F7")]
public partial struct FactionTag { }
```

The source generator supplies serialized network string storage, equality, registry lookup, enumeration, and
metadata and hierarchy helpers. Every generated type exposes its own typed `Parent`, `IsChildOf`,
`MatchesExact`, and `MatchesTag` API. `DamageTypeTag` and `FactionTag` remain distinct C# types even if
both domains contain a tag named `Neutral`. An API accepting `FactionTag` cannot receive `DamageTypeTag`
without an explicit conversion in project code.

`GameplayTagRegistry` remains a standalone `Resources/GameplayTagRegistry.asset`; it is not embedded
in `EngineSettings`. It stores domains by tag type, so their names and metadata tables are isolated at
runtime as well. The optional HTML color in `GameplayTagAttribute` controls that type's header and
field tint in the editor. The registry inspector discovers every attributed tag type automatically;
types without a specialized metadata domain receive a basic domain with `name` and `comment` fields.
The built-in **Gameplay Tag** group uses that same basic metadata and is the source for every serialized
field declared as `GameplayTag`, including `TagsContainer` and `TagRequirements` values.

![Gameplay Tag domains](/images/gameplay-tag.png)

## Give a domain its own metadata

Metadata turns a tag into more than a string. For example, a damage-type domain can provide a UI color
and resistance attribute, while a faction domain can provide a relationship mask.

```csharp
using System;
using RedEngine.Gameplay.AbilitySystem.Attributes;
using RedEngine.Gameplay.GameplayTags;
using UnityEngine;

[Serializable]
public sealed class DamageTypeMetadata : GameplayTagEntry
{
    [SerializeField] private Color color = Color.white;
    [SerializeField] private AttributeReference resistance;

    public Color Color => color;
    public AttributeReference Resistance => resistance;
}

[Serializable]
public sealed class DamageTypeDomain
    : GameplayTagDomain<DamageTypeTag, DamageTypeMetadata>
{
}
```

Open the `GameplayTagRegistry` asset and use **Add New Damage Type Tag**. Each type is shown as an
always-expanded colored group. Tags can be reordered by dragging, expanded to edit metadata, and
removed through the per-tag delete button after confirmation. Each entry has the base `name` and
`comment` fields plus the custom metadata fields.

Fields whose type implements `IGameplayTag` use the same registry automatically. Their dropdown lists
all entries in the matching group, while the adjacent plus button creates a new entry and selects it.
Tag declarations must be non-readonly partial structs: Unity serializes the generated `NetworkString`
field so selected tags survive asset and scene reloads, while Fusion uses the same field for replication.

```csharp
DamageTypeTag fire = GameplayTagRegistry.Request<DamageTypeTag>("Damage.Fire");

if (fire.TryGetMetadata<DamageTypeMetadata>(out var metadata))
    damageNumber.SetColor(metadata.Color);
```

The inventory module uses this pattern directly: `RarityTagMetadata` supplies the minimum and maximum
number of generated affixes for each rarity.

## Hierarchical matching

Parents are separated with dots:

```csharp
GameplayTag stunned = GameplayTagRegistry.Request<GameplayTag>("State.Control.Stunned");
GameplayTag control = GameplayTagRegistry.Request<GameplayTag>("State.Control");

bool exact = stunned.MatchesExact(control); // false
bool belongsToControl = stunned.MatchesTag(control); // true
```

Explicit leaf entries automatically make their parent names available for matching. Automatically
created parents are not returned by `Enumerate()` and have no metadata unless they are also configured
as entries.

## Enumerate one domain

Generated types expose their own count and enumeration helpers:

```csharp
foreach (DamageTypeTag type in DamageTypeTag.Enumerate("Elemental"))
    BuildDamageFilter(type);
```

The filter is case-insensitive and only searches the selected domain.

## Runtime tag containers and requirements

`TagsContainer` stores replicated tags from every `[GameplayTag]` domain on an actor. Its network key
contains both the tag domain and name, so identically named values from two different tag types remain
independent. The generic API preserves the concrete tag type for adds, removes, counts, and queries:

```csharp
tags.AddGameplayTag(GameplayTagRegistry.Request<DamageTypeTag>("Damage.Fire"));
tags.AddGameplayTag(GameplayTagRegistry.Request<FactionTag>("Faction.Enemy"));

bool hasFireDamage = tags.HasTag(GameplayTagRegistry.Request<DamageTypeTag>("Damage.Fire"));
```

A mixed collection can be added or removed in one call by using `IEnumerable<IGameplayTag>`. Change
events expose a `GameplayTagReference`; use `Is<T>()` or `TryGet<T>(out T)` to recover its domain type.
Replicated tag names are limited to 64 characters. The `GameplayTagRegistry` inspector reports tag
types or entries that exceed this capacity, and the tag creation window rejects oversized names.
`TagRequirements` combines required and forbidden built-in tags and is reused by abilities and effects:

```text
required:  State.Alive
forbidden: State.Stunned, State.Dead
```

Use tags for categorical state and gating. Use attributes for numeric state such as Health, Armor, or
MoveSpeed.

Next: [Attributes and Effects](attributes-effects.md).
