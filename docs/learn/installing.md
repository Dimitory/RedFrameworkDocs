# Installing RedEngine

RedEngine is distributed through the Unity Asset Store. Import it into the Unity project where you
want to use the framework, then let Unity resolve and compile its package dependencies.

## Before you begin

You need:

- Unity 6000.0 or newer;
- Photon Fusion 2 configured for the project;
- the dependencies declared in RedEngine's `package.json`.

The package uses Unity's Input System. The legacy `UnityEngine.Input` API is not part of the runtime.

## Import from the Asset Store

1. Open the [RedEngine Asset Store page](https://assetstore.unity.com/preview/409964/1489558) and add it to **My Assets**.
2. Open **Window > Package Manager** in the target project.
3. Select **My Assets**, find **RedEngine Framework**, and choose **Download** or **Import**.
4. Import the package contents and wait for Unity to finish compilation.

After an update, keep the project open until script compilation and Addressables refresh have both
finished. Review the [Release Notice](../release-notice.md) before upgrading an existing multiplayer
project.

## Confirm the installation

After compilation:

1. open **Tools > RedEngine > Welcome**;
2. confirm RedEngine appears in Package Manager;
3. create or select `Assets/Resources/EngineSettings.asset` and explicitly add the module sections
   required by the project;
4. open the Fusion Network Project Config and confirm the App Id and peer mode.

Do not create multiple `EngineSettings` assets under `Resources`. RedEngine expects one default asset.

## Assembly references

RedEngine is split into focused assemblies. Add only the modules your game assembly uses—for example,
`RedEngine.Core` for actors and world lifecycle, then `RedEngine.Gameplay.AbilitySystem` if that code
uses abilities. There is no umbrella `RedEngine.Gameplay` assembly.

Next: [Getting Started](getting-started.md).
