# Ability Sample

This walkthrough follows the framework `SprintAbility` used by the Compact Multiplayer Showcase.

## The complete loop

1. The ability is granted to `ShowcaseCharacter`.
2. `AbilityInputSettings` binds it to the sprint network input.
3. `CanActivate` requires positive Stamina after base policies pass.
4. `Activate` adds a movement speed bonus of `speedMultiplier - 1`.
5. Every Fusion tick removes Stamina through `AbilitySystemComponent.ApplyModifier`.
6. Releasing input, interruption, or reaching zero Stamina exits the loop.
7. `finally` removes the speed bonus.

The important detail is cleanup. Ability execution may end through several paths, so temporary
movement state is restored in `finally` when the input is released or execution is interrupted.

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

Compare it with Jump, which has a fixed action and cooldown, and weapon fire/reload, which resolve the
currently equipped `Weapon`. Then use [Manual: Abilities](../manual/abilities.md) to build your own.
