# Getting Started

Begin with a working multiplayer session in the Unity Editor. This guide establishes a runnable
baseline before examining architecture or customization.

## What you will have at the end

- RedEngine imported from the Unity Asset Store;
- the Compact Multiplayer Showcase available under `Assets/RedEngine/Samples/CompactShowcase`;
- a valid Photon Fusion App Id and runner configuration;
- a server and at least one client running through Fusion Multi-Peer;
- a clear next step for building your own scene.

Allow about 20 minutes if Fusion is already installed.

## 1. Install the package

Follow [Installing RedEngine](installing.md). When Unity finishes compiling, open
**Tools > RedEngine > Welcome**. The welcome window provides a setup overview, installation buttons
for Addressables, Cinemachine, and Localization when needed, and links to the settings asset, Fusion
configuration, an optional Multiplayer Play Mode installer, Input System and UI package installation
with TMP Essential Resources, build scene registration, documentation, and samples.

![Welcome window](/images/welcome-window.png)

## 2. Open the showcase {#import-the-showcase}

1. Open **Tools > RedEngine > Welcome**.
2. Select **Open Scene** for **Compact Multiplayer Showcase**.
3. Use **Show Folder** to browse its assets under `Assets/RedEngine/Samples/CompactShowcase`.

The showcase keeps the essential relationships visible: runner, game mode, controller, character,
input, and UI are already configured as a working baseline.

## 3. Connect Fusion

Set the Photon App Id in Fusion's project configuration. The sample installer updates the explicit
sections in the showcase's `Content/Resources/ShowcaseEngineSettings.asset` (or an existing
`Assets/Resources/EngineSettings.asset`), adds the sample assembly to Fusion Weaver, and selects
Multi-Peer mode. You can switch between **Single Peer** and **Multi Peer** in Welcome's Photon Fusion
step. Use **Build Scenes > Register Scenes** in Welcome to enable both showcase scenes
in the active Build Profile. The installer runs
automatically when `EngineSettings` has no sections. In an already configured project, run
**RedEngine > Samples > Configure Compact Showcase** to connect the sample. Re-running the command
preserves existing preload labels, Addressables groups, gameplay tags, and logger settings.

## 4. Run two peers

1. Right-click the **Fusion ×1** play control and choose **Start with 2 peer(s)**.
2. Use the neighboring **Peer** menu during Play Mode to choose which peer receives input.

Both players should move, collect the weapon, fire, and ride the moving platform with consistent
results across peers. If only one responds, verify Peer Mode before investigating input bindings.

## 5. Trace one action through the framework

Trace a single action, such as jumping, through the showcase:

1. the Input Actions asset produces an input value;
2. `InputSettings` maps it to a fixed network input channel;
3. an `InputContext` routes the channel to gameplay code;
4. Fusion carries the input through the simulation tick;
5. a gameplay ability changes authoritative state;
6. presentation code reacts to the replicated result.

This sequence illustrates the framework's separation of concerns. Keep simulation state on the Fusion
path and reserve ordinary Unity timing and callbacks for presentation.

## Where to go next

- Building your own scene: [Your first multiplayer scene](first-multiplayer-scene.md)
- Understanding the moving parts: [Framework overview](framework-overview.md)
- Choosing a gameplay system: [Features](../manual/features.md)
- Understanding shared services: start from [Subsystems](../manual/subsystems.md)
- Looking up a gameplay feature: start from [Features](../manual/features.md)

## Troubleshooting checklist

| Symptom | First thing to check |
| --- | --- |
| Unity cannot resolve RedEngine assemblies | Package path and required dependencies |
| Play Mode quits during startup | `EngineSettings` exists and its `Core` section has a runner |
| Scene travel fails | Scene is in the active Build Profile and assigned in `CoreSettings` |
| Multi-Peer refuses to start | Fusion Peer Mode is **Multiple** |
| Fusion reports `InvalidAuthentication` | Set a valid Fusion App Id in `PhotonAppSettings` |
| A player does not receive input | The correct player is selected in the **Peer** toolbar menu |
| A network actor is missing | Its prefab has `NetworkObject` and is registered with Fusion |
