# Gameplay Tags

Gameplay tags are small network-safe identifiers such as `State.Stunned` or `Item.Rarity.Rare`. Their
dot-separated names form hierarchies, but RedEngine does not put every tag into one global bucket. You
can declare several strongly typed tag domains that cannot be mixed accidentally.

## Separate domains are separate types

```csharp
using RedEngine.Gameplay.GameplayTags;

[GameplayTag]
public readonly partial struct DamageTypeTag { }

[GameplayTag]
public readonly partial struct FactionTag { }
```

The source generator supplies the network string storage, equality, registry lookup, enumeration, and
metadata helpers. `DamageTypeTag` and `FactionTag` remain distinct C# types even if both domains contain
a tag named `Neutral`. An API accepting `FactionTag` cannot receive `DamageTypeTag` without an explicit
conversion in project code.

`GameplayTagRegistry` stores domains by tag type, so their names and metadata tables are isolated at
runtime as well.

![Placeholder: two independent Gameplay Tag domains](/images/gameplay-tag-domains-placeholder.svg)

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

Add `DamageTypeDomain` to the `GameplayTagRegistry` asset and populate its `entries`. Each entry has the
base `name` and `comment` fields plus the custom metadata fields.

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

`TagsContainer` stores replicated `GameplayTag` state on an actor. `TagRequirements` combines required
and forbidden tags and is reused by abilities and effects:

```text
required:  State.Alive
forbidden: State.Stunned, State.Dead
```

Use tags for categorical state and gating. Use attributes for numeric state such as Health, Armor, or
MoveSpeed.

Next: [Attributes and Effects](attributes-effects.md).
