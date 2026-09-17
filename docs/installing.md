# Installing RedEngine

RedEngine is a Unity package. For day-to-day development, use a local package reference so changes in
this repository are picked up by the game project without copying files.

## Before you begin

You need:

- Unity 6000.0 or newer;
- Photon Fusion 2 configured for the project;
- Git, if the package lives outside the game repository;
- the dependencies declared in RedEngine's `package.json`.

The package uses Unity's Input System. The legacy `UnityEngine.Input` API is not part of the runtime.

## Option A: add the package from disk

1. Open **Window > Package Manager**.
2. Choose **+ > Add package from disk…**.
3. Select RedEngine's `package.json`.
4. Wait for Unity to finish compiling.

This is the easiest option when framework and game are developed on the same machine.

![Placeholder: Add package from disk](/images/package-manager-placeholder.svg)

## Option B: edit the manifest

Add a local dependency to the game's `Packages/manifest.json`:

```json
{
  "dependencies": {
    "com.redengine.framework": "file:../RedEngine"
  }
}
```

The path is relative to the game project's `Packages` directory. Keep the entry in source control if
the rest of the team uses the same repository layout; otherwise agree on a Git or registry source.

## Confirm the installation

After compilation:

1. open **Tools > RedEngine > Welcome**;
2. confirm RedEngine appears in Package Manager;
3. create or select `Assets/Resources/EngineSettings.asset`;
4. open the Fusion Network Project Config and confirm the App Id and peer mode.

Do not create multiple `EngineSettings` assets under `Resources`. RedEngine expects one default asset.

## Assembly references

RedEngine is split into focused assemblies. Add only the modules your game assembly uses—for example,
`RedEngine.Core` for actors and world lifecycle, then `RedEngine.Gameplay.AbilitySystem` if that code
uses abilities. There is no umbrella `RedEngine.Gameplay` assembly.

Next: [Getting Started](getting-started.md).
