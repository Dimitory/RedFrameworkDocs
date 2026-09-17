import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RedEngine',
  description: 'Tutorial-first documentation for the RedEngine Unity multiplayer framework.',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,
  base: '/RedFrameworkDocs/',
  head: [
    ['meta', { name: 'theme-color', content: '#b4242d' }],
  ],
  themeConfig: {
    logo: '/redengine-mark.svg',
    siteTitle: 'RedEngine',
    search: { provider: 'local' },
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Features', link: '/features' },
      { text: 'Release', link: '/release-notice' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Welcome', link: '/' },
          { text: 'Install', link: '/installing' },
          { text: 'Introduction', link: '/introduction' },
          { text: 'Overview', link: '/overview' },
          { text: 'Run the showcase', link: '/getting-started' },
          { text: 'Your first scene', link: '/first-multiplayer-scene' },
          { text: 'Features', link: '/features' },
        ],
      },
      {
        text: 'Core pipeline',
        items: [
          { text: 'GameInstance and Travel', link: '/game-instance-travel' },
          { text: 'GameMode pipeline', link: '/game-mode' },
          { text: 'Core runtime reference', link: '/core-runtime' },
          { text: 'Foundation and collections', link: '/foundation-collections' },
        ],
      },
      {
        text: 'Gameplay',
        items: [
          { text: 'Gameplay Tags', link: '/gameplay-tags' },
          { text: 'Attributes and Effects', link: '/attributes-effects' },
          { text: 'Gameplay Abilities', link: '/gameplay-abilities' },
          { text: 'Inventory and equipment', link: '/gameplay-items' },
          { text: 'Movement and combat', link: '/movement-combat' },
          { text: 'Assets and serialization', link: '/assets-serialization' },
        ],
      },
      {
        text: 'Presentation and tools',
        items: [
          { text: 'UI and Widgets', link: '/ui' },
          { text: 'Diagnostics and Console', link: '/diagnostics-console' },
        ],
      },
      {
        text: 'Project',
        items: [
          { text: 'Release Notice', link: '/release-notice' },
          { text: 'Planned Updates', link: '/planned-updates' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    lastUpdated: { text: 'Updated' },
    footer: {
      message: 'RedEngine Framework documentation',
      copyright: 'Built with VitePress',
    },
  },
})
