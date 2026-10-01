# Getting Started

The shortest useful introduction to RedEngine is not an API tour. It is a small multiplayer session
running in the Unity Editor. This path gets you there first; architecture and customization come after.

## What you will have at the end

- RedEngine imported from the Unity Asset Store;
- the Compact Multiplayer Showcase imported;
- a valid Photon Fusion App Id and runner configuration;
- a server and at least one client running through Fusion Multi-Peer;
- a clear next step for building your own scene.

Allow about 20 minutes if Fusion is already installed.

## 1. Install the package

Follow [Installing RedEngine](installing.md). When Unity finishes compiling, open
**Tools > RedEngine > Welcome**. The welcome window is a quick health check: it links to the settings
asset, Fusion configuration, documentation, and samples.

![Welcome window](/images/welcome-window.png)

## 2. Import the showcase {#import-the-showcase}

1. Open **Window > Package Manager**.
2. Select **RedEngine Framework**.
3. Open the **Samples** tab.
4. Import **Compact Multiplayer Showcase**.
5. Open the imported `Content/Scenes` folder.

The showcase is intentionally small enough to inspect. It is a better starting point than an empty
scene because the important relationships—runner, game mode, controller, character, input, and UI—are
already wired together.

## 3. Connect Fusion

Set the Photon App Id in Fusion's project configuration. The sample installer updates the explicit
sections in the single `Assets/Resources/EngineSettings.asset`, enables both showcase scenes in the
active Build Profile, adds the sample assembly to Fusion Weaver, and selects Multi-Peer mode. It runs
automatically when `EngineSettings` has no sections. In an already configured project, run
**RedEngine > Samples > Configure Compact Showcase** to connect the sample. Re-running the command
preserves existing preload labels, Addressables groups, gameplay tags, and logger settings.

## 4. Run two peers

1. Right-click the **Fusion ×1** play control and choose **Start with 2 peer(s)**.
2. Use the neighboring **Peer** menu during Play Mode to choose which peer receives input.

You should be able to move both players, collect the weapon, fire, ride the moving platform, and see
the same result from either peer. If only one peer responds, verify Peer Mode before debugging input.

## 5. Trace one action through the framework

Pick a simple action—jump is a good one—and follow it in the imported sample:

1. the Input Actions asset produces an input value;
2. `InputSettings` maps it to a fixed network input channel;
3. an `InputContext` routes the channel to gameplay code;
4. Fusion carries the input through the simulation tick;
5. a gameplay ability changes authoritative state;
6. presentation code reacts to the replicated result.

That path is the framework in miniature. Keep simulation state in the Fusion path; reserve ordinary
Unity timing and callbacks for presentation work.

## Where to go next

- Building your own scene: [Your first multiplayer scene](first-multiplayer-scene.md)
- Understanding the moving parts: [Framework overview](framework-overview.md)
- Choosing a gameplay system: [Features](../manual/features.md)
- Understanding shared services: start from [Subsystems](../manual/subsystems.md)
- Looking up a gameplay feature: start from [Features](../manual/features.md)

## A quick troubleshooting pass

| Symptom | First thing to check |
| --- | --- |
| Unity cannot resolve RedEngine assemblies | Package path and required dependencies |
| Play Mode quits during startup | `EngineSettings` exists and its `Core` section has a runner |
| Scene travel fails | Scene is in the active Build Profile and assigned in `CoreSettings` |
| Multi-Peer refuses to start | Fusion Peer Mode is **Multiple** |
| Fusion reports `InvalidAuthentication` | Set a valid Fusion App Id in `PhotonAppSettings` |
| A player does not receive input | The correct player is selected in the **Peer** toolbar menu |
| A network actor is missing | Its prefab has `NetworkObject` and is registered with Fusion |
