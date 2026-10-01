# Recipe: Add a World Marker

**Outcome:** a label follows a world object, fades by distance, and hides behind level geometry.

## 1. Create the presentation

Duplicate the showcase label marker and widget prefabs. On the widget prefab, keep a
`WorldMarkerWidget` subclass that copies the marker's label into TMP when bound.

## 2. Place the marker

Add the marker to a world object and assign:

- the widget prefab;
- an anchor or a local vertical offset;
- `DistanceAndViewport` culling;
- fade-start and maximum distances;
- `Hide` or `Fade` occlusion plus a level-geometry mask.

No camera script is required. `WorldMarkerSubsystem` discovers the enabled marker and creates its
widget in the active world's layer.

## 3. Control availability

For a pickup or objective, drive only the requested visibility:

```csharp
public override void Render()
{
    marker.SetVisible(IsAvailable);
}
```

## Verify

Walk toward and away from the marker, move it outside the viewport, and put a wall between it and the
camera. Repeat in Multi-Peer and confirm each view uses its own camera and physics scene.

## Understand the system

Continue with the [Manual: UI](../../manual/ui.md#world-markers) guide.
