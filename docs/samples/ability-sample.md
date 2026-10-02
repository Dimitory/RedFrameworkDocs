# Ability Sample

This walkthrough examines the framework's `SprintAbility` as implemented in the Compact Multiplayer
Showcase.

## The complete loop

1. The ability is granted to `ShowcaseCharacter`.
2. `AbilityInputSettings` binds it to the sprint network input.
3. `CanActivate` requires positive Stamina after base policies pass.
4. `Activate` adds a movement speed bonus of `speedMultiplier - 1`.
5. Every Fusion tick removes Stamina through `AbilitySystemComponent.ApplyModifier`.
6. Releasing input, interruption, or reaching zero Stamina exits the loop.
7. `finally` removes the speed bonus.

Cleanup must cover every exit path. The `finally` block restores temporary movement state whether
input is released, execution is interrupted, or the ability ends for another reason.

```csharp
while (!coroutine.Interrupted &&
       coroutine.AbilitySystem.IsInputPressed(InputSettings.Input) &&
       coroutine.AbilitySystem.GetCurrentValue(staminaAttribute) > 0f)
{
    if (characterController.MovementIntent.sqrMagnitude > 0.0001f)
        coroutine.AbilitySystem.ApplyModifier(staminaAttribute, ModifierOperation.Additive,
            -staminaPerSecond * coroutine.AbilitySystem.Runner.DeltaTime);

    yield return new AbilityWaitTicks(1);
}
```

Compare it with Jump, which has a fixed action and cooldown, and with weapon fire and reload, which
resolve the currently equipped `Weapon`. Consult [Manual: Abilities](../manual/abilities.md) before
implementing a new ability.
