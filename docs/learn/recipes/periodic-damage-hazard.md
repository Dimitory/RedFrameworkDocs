# Recipe: Create a Periodic Damage Hazard

**Outcome:** a volume applies damage once per second while a character remains inside it.

::: info Execution model
- **Authority** — State Authority applies and refreshes the effect.
- **Prediction** — do not run a second client-only damage effect; predicted movement remains separate.
- **Replicated** — Health, effect duration, execution period, stacks, and resulting movement state.
- **Local only** — fire particles, damage numbers, hit flash, UI bar, and audio.
:::

## 1. Duplicate the known-good assets

From Compact Multiplayer Showcase, duplicate `GE_Burning` and the lava volume prefab into your game
content. This preserves the duration, period, stacking, collider, and trigger wiring.

Set the effect to a three-second duration, one-second period, aggregate by source, and stack limit one.
Adjust the damage value only after the effect runs correctly.

## 2. Apply and refresh on authority

The volume applies the effect on enter and refreshes its duration on stay:

```csharp
if (!Object.HasStateAuthority || character.Owner is not ArenaCharacter target)
    return;

if (!target.Effects.TryRefreshEffectDuration(burningEffect, Object))
{
    var context = new EffectContext(target.Attributes, target.Attributes);
    target.Effects.ApplyEffect(burningEffect, context, sourceObject: Object);
}
```

Refreshing prevents a new stack every tick and does not reset the existing periodic execution phase.

## Verify

Enter the volume with two peers running. Health should change once per second and match on both peers.
Leave the volume and confirm the remaining duration expires instead of becoming permanent.

## Understand the system

Continue with [Manual: Attributes & Effects](../../manual/attributes-effects.md) for formulas,
modifier order, stacking, captures, and effect contexts.
