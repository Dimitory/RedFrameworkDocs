# Glossary

**Actor** — RedEngine network entity built on a Fusion `NetworkBehaviour` and associated with a
`World`.

**ActorComponent** — network-aware component owned by an `Actor`.

**Authority** — the peer allowed to author a category of network state. State authority mutates
replicated state; input authority supplies a player's input.

**Bootstrap** — runtime entry point that initializes settings and content and creates game instances.

**GameInstance** — application-level owner of one runner, travel, and persistent subsystems.

**GameMode** — authoritative world actor that admits players, creates controllers and characters, and
drives match state.

**Gameplay Effect** — definition that changes attributes or tags immediately, periodically, or for a
duration.

**Gameplay Tag domain** — one generated tag struct type with its own registry and optional metadata.

**Input context** — prioritized mapping from network input channels and triggers to handler methods.

**Network model** — generated deterministic state representation for a regular class or struct.

**Network ScriptableObject** — authored definition with a stable asset identity understood by Fusion.

**Prediction / rollback** — Fusion simulation of expected state and correction by replaying ticks when
authority disagrees.

**Subsystem** — automatically owned service with either `GameInstance` or `World` lifetime.

**TickTimer** — Fusion deadline stored in network state and evaluated against simulation ticks.

**Travel** — replacing the current runner/world map through `GameInstance`.

**Widget** — RedEngine UI presentation element managed by `WidgetSubsystem`.

**World** — RedEngine wrapper around the active Fusion runner simulation scene and its world-scoped
services.

**WorldMarker** — world target projected into a managed screen-space widget with culling and occlusion.
