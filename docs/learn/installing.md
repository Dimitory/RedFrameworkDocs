# Installing RedEngine

RedEngine is distributed through the Unity Asset Store. Import it into the target Unity project and
allow Unity to resolve and compile its package dependencies before configuring the framework.

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
2. confirm the package files appear under `Assets/RedEngine`;
3. use **Multiplayer Play Mode > Install** to add `com.unity.multiplayer.playmode` for virtual Editor players;
4. use the **Addressables**, **Cinemachine**, and **Localization** steps in Welcome to install missing packages.
   Addressables Groups opens after installation and can be reopened with **Open Groups**;
5. use **Input & UI > Install Packages** in Welcome to install any missing Input System, Unity UI,
   and TextMesh Pro packages together; then use **Import Essentials** in the same step if TMP
   resources are missing;
6. use **Build Scenes > Register Scenes** in Welcome to enable imported sample scenes in the active
   Build Profile; use **Build Profiles** there to inspect their order and add your own scenes;
7. use **Tools > RedEngine > Engine Settings** to select the active settings asset; the showcase
   includes one, while a project without one gets `Assets/Resources/EngineSettings.asset` on demand;
8. set **Single Peer** or **Multi Peer** in Welcome's Photon Fusion step, then open the Fusion
   Network Project Config and confirm the App Id. Use **Multi Peer** to run two editor peers.

The Welcome window reads each imported sample's `sample.json`: `scene` identifies the scene opened
from the sample card, while `scenes` lists the scenes to include in the build. Scene registration
preserves existing entries and their order.

Use the menu command to edit the active asset. The showcase settings are named
`ShowcaseEngineSettings`, so a project's own `EngineSettings` takes precedence when present.

## Assembly references

RedEngine is split into focused assemblies. Add only the modules your game assembly uses—for example,
`RedEngine.Core` for actors and world lifecycle, then `RedEngine.Gameplay.AbilitySystem` if that code
uses abilities. There is no umbrella `RedEngine.Gameplay` assembly.

Next: [Getting Started](getting-started.md).
