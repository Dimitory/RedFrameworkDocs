import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RedEngine',
  description: 'Documentation for the RedEngine Unity multiplayer framework.',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,
  base: '/',
  head: [
    ['meta', { name: 'theme-color', content: '#b4242d' }],
    ['style', {}, '.VPHomeHero { --vp-home-hero-name-color: #F94B36; --vp-home-hero-name-background: none; }'],
  ],
  themeConfig: {
    logo: '/redengine-mark.svg',
    siteTitle: 'RedEngine',
    search: { provider: 'local' },
    nav: [
      { text: 'Learn', link: '/learn/' },
      { text: 'Manual', link: '/manual/' },
      { text: 'Samples', link: '/samples/' },
      { text: 'Reference', link: '/reference/' },
      {
        text: 'Project',
        items: [
          { text: 'Release Notice', link: '/release-notice' },
          { text: 'Planned Updates', link: '/planned-updates' },
          { text: 'Changelog', link: '/changelog' },
          { text: 'Asset Store', link: 'https://assetstore.unity.com/preview/409964/1489558' },
          { text: 'Report a bug', link: 'https://github.com/Dimitory/RedFrameworkDocs/issues' },
          { text: 'Demo', link: '/demo' },
        ],
      },
    ],
    sidebar: {
      '/learn/': [
        {
          text: 'Learn',
          items: [
            { text: 'Meet RedEngine', link: '/learn/introduction' },
            { text: 'Installation', link: '/learn/installing' },
            { text: 'Getting Started', link: '/learn/getting-started' },
            { text: 'Framework Overview', link: '/learn/framework-overview' },
            { text: 'First Multiplayer Game', link: '/learn/first-multiplayer-game' },
            { text: 'First Multiplayer Scene', link: '/learn/first-multiplayer-scene' },
            {
              text: 'Recipes',
              collapsed: false,
              items: [
                { text: 'Recipe overview', link: '/learn/recipes/' },
                { text: 'Host, join, and travel', link: '/learn/recipes/host-join-travel' },
                { text: 'Add a dash ability', link: '/learn/recipes/add-dash-ability' },
                { text: 'Periodic damage hazard', link: '/learn/recipes/periodic-damage-hazard' },
                { text: 'Inventory pickup', link: '/learn/recipes/inventory-pickup' },
                { text: 'Equip a weapon', link: '/learn/recipes/equip-weapon' },
                { text: 'Open a UI screen', link: '/learn/recipes/open-ui-screen' },
                { text: 'Add a world marker', link: '/learn/recipes/add-world-marker' },
                { text: 'Stream an additive level', link: '/learn/recipes/stream-additive-level' },
              ],
            },
            { text: 'Where to Go Next', link: '/learn/where-to-go-next' },
          ],
        },
      ],
      '/manual/': [
        {
          text: 'Manual',
          items: [
            { text: 'Feature Map', link: '/manual/features' },
            { text: 'Core', link: '/manual/core' },
            { text: 'Subsystems', link: '/manual/subsystems' },
            { text: 'Configuration', link: '/manual/configuration' },
            { text: 'GameInstance & Travel', link: '/manual/game-instance-travel' },
            { text: 'GameMode', link: '/manual/game-mode' },
            { text: 'Spawn & Networking', link: '/manual/spawn' },
            { text: 'Input', link: '/manual/input' },
            {
              text: 'Gameplay Features',
              collapsed: false,
              items: [
                { text: 'Gameplay Tags', link: '/manual/gameplay-tags' },
                { text: 'Abilities', link: '/manual/abilities' },
                { text: 'Attributes & Effects', link: '/manual/attributes-effects' },
                { text: 'Inventory', link: '/manual/inventory' },
                { text: 'Equipment', link: '/manual/equipment' },
                { text: 'Interaction', link: '/manual/interaction' },
                { text: 'Character Controller', link: '/manual/character-controller' },
                { text: 'Weapon', link: '/manual/weapon' },
                { text: 'Feedback', link: '/manual/feedback' },
              ],
            },
            { text: 'UI', link: '/manual/ui' },
            { text: 'Assets', link: '/manual/assets' },
            { text: 'Network ScriptableObjects', link: '/manual/network-scriptable-objects' },
            { text: 'Diagnostics', link: '/manual/diagnostics' },
            { text: 'Developer Console', link: '/manual/developer-console' },
            { text: 'Graph & Inspector', link: '/manual/authoring-tools' },
          ],
        },
      ],
      '/samples/': [
        {
          text: 'Samples',
          items: [
            { text: 'Compact Multiplayer Showcase', link: '/samples/compact-showcase' },
            { text: 'Ability Sample', link: '/samples/ability-sample' },
            { text: 'Inventory Sample', link: '/samples/inventory-sample' },
            { text: 'UI Sample', link: '/samples/ui-sample' },
            { text: 'Networking & Movement', link: '/samples/networking-movement-sample' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'API Reference', link: '/reference/api-reference' },
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'Attributes / annotations', link: '/reference/attributes-annotations' },
            { text: 'Generated code', link: '/reference/generated-code' },
            { text: 'Limits', link: '/reference/limits' },
            { text: 'Glossary', link: '/reference/glossary' },
          ],
        },
      ],
    },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    lastUpdated: { text: 'Updated' },
    footer: {
      message: 'RedEngine Framework documentation',
      copyright: 'Built with VitePress',
    },
  },
})
