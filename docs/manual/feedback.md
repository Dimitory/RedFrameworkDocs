# Feedback

Feedback separates non-deterministic presentation from simulation. Use it for audio, particles,
camera response, floating values, and other effects that react to gameplay without owning gameplay
state.

## Play and stop feedback

`PresentationManager` is a world subsystem. Pass it a serialized `PresentationBehaviour` prefab
and `FeedbackParameters` for the source, target, position, and optional magnitude.

```csharp
using RedEngine.Gameplay.AbilitySystem.Presentation;

var manager = World.GetSubsystem<PresentationManager>();
if (manager != null && presentationPrefab)
{
    var parameters = new FeedbackParameters(gameObject, gameObject, transform.position);
    manager.PlayFeedback(presentationPrefab, parameters);
}
```

Call `PlayFeedback` from state authority to replicate a request; `PlayFeedbackLocal` stays on the
current peer. Use the returned `FeedbackHandle` with `StopFeedback` when managing lifetime yourself.
Mount replicated presentation prefabs on every peer before playback. Automatic lifetime uses the
game-instance timer, so never mutate authoritative gameplay from presentation callbacks.

See [Abilities](abilities.md) and [Attributes & Effects](attributes-effects.md) for gameplay systems
that can request presentation after producing a simulation result.
