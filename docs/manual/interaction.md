# Interaction

Interaction separates local target presentation from authoritative validation. `InteractAbility`
scans for candidates, selects one by priority and score, then invokes the target only after distance,
angle, availability, and authority checks pass.


## Configure the player

Grant one `InteractAbility` to the player. Configure:

- scan origin offset;
- interaction radius;
- maximum angle;
- interaction layer mask;
- optional scan interval;
- input target or ability input tag.

The scan uses the actor's `World` physics query and Fusion lag-compensated hits. Candidates with higher
`InteractionPriority` win; equal-priority candidates are scored by distance and angle.

`TargetChanged` is appropriate for local prompts and highlights. It does not mean the interaction has
been accepted.

## Implement an interactable

Derive an actor component from `Interactable` and keep the authoritative mutation in `Interact`:

```csharp
public sealed class TerminalInteraction : Interactable
{
    [SerializeField] private WorldMarker marker;

    public override WorldMarker InteractionMarker => marker;
    public override int InteractionPriority => 0;
    public override bool CanInteract(Actor interactor) => Owner.HasAuthority;

    public override IEnumerator Interact(Actor interactor)
    {
        if (!Owner.HasAuthority)
            yield break;
        // Mutate authoritative state here.
    }
}
```

The owner actor prefab requires `NetworkObject`. `InteractionPriority` resolves overlapping candidates,
and `InteractionMarker` supplies optional presentation.

## Built-in references

- `PickupItem` inserts its configured definition into `CharacterInventory` and despawns its owner only
  after the layout accepts the item. Its actor prefab requires `NetworkTransform` so clients receive
  the position and rotation supplied when the pickup is spawned.
- `RespawnPoint` owns the pickup prefab, tracks the spawned actor, and starts a replicated `TickTimer`
  after that actor disappears.

## Present the current target

On the locally controlled actor, call `InteractAbility.RefreshPresentationTarget(actor)` during `Render()`.
It queries that peer's physics scene, updates `CurrentTarget`, raises `TargetChanged`, and shows only
the selected target's `InteractionMarker`. Call `ClearPresentationTarget()` when the actor despawns.
The server still validates the target during ability activation; presentation does not change network state.
`PickupItem` starts with its marker hidden until selected.

## Common failure checks

- No target is selected: check radius, angle, layer mask, collider, and interaction transform.
- Prompt appears but activation fails: confirm `CanInteract` still passes during revalidation.
- State changes only locally: ensure the owner has State Authority before mutation.
- The same object is detected several times: the ability already de-duplicates colliders by interactable.

Try it: [Recipe: Inventory Pickup](../learn/recipes/inventory-pickup.md) and
[Recipe: Add a World Marker](../learn/recipes/add-world-marker.md).

Next: [Character Controller](character-controller.md).
