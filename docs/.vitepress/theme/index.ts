import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import UnityDemo from './components/UnityDemo.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.component('UnityDemo', UnityDemo)
  }
} satisfies Theme