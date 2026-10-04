<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const launched = ref(false)

const demoUrl = withBase('/demo_app/index.html')
</script>

<template>
  <div class="unity-demo">
    <div v-if="!launched" class="unity-demo__launcher">
      <div class="unity-demo__badge">
        Interactive Demo
      </div>

      <h2>RedEngine Playground</h2>

      <p>
        Launch the playable WebGL demo and explore RedEngine systems
        directly in your browser.
      </p>

      <button
        class="unity-demo__button"
        @click="launched = true"
      >
        Launch Demo
      </button>

      <span class="unity-demo__note">
        Unity WebGL · Opens directly on this page
      </span>
    </div>

    <div v-else class="unity-demo__player">
        <iframe
          :src="demoUrl"
          allow="fullscreen; pointer-lock"
          allowfullscreen
        />

      <div class="unity-demo__toolbar">
        <a
          :href="demoUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open fullscreen ↗
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unity-demo {
  margin: 32px 0;
}

.unity-demo__launcher {
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 420px;
  padding: 48px 32px;

  text-align: center;

  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(61, 124, 255, 0.16),
      transparent 45%
    ),
    var(--vp-c-bg-soft);
}

.unity-demo__launcher::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.25;
  pointer-events: none;

  background-image:
    linear-gradient(
      var(--vp-c-divider) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      var(--vp-c-divider) 1px,
      transparent 1px
    );

  background-size: 32px 32px;
}

.unity-demo__launcher > * {
  position: relative;
  z-index: 1;
}

.unity-demo__badge {
  margin-bottom: 16px;
  padding: 6px 12px;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;

  color: var(--vp-c-brand-1);
}

.unity-demo__launcher h2 {
  margin: 0;
  border: 0;

  font-size: 32px;
  line-height: 1.2;
}

.unity-demo__launcher p {
  max-width: 560px;
  margin: 16px 0 28px;

  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.6;
}

.unity-demo__button {
  padding: 12px 24px;

  border: 0;
  border-radius: 8px;

  cursor: pointer;

  font-size: 15px;
  font-weight: 600;

  color: white;
  background: var(--vp-c-brand-1);

  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.unity-demo__button:hover {
  transform: translateY(-1px);
  background: var(--vp-c-brand-2);
}

.unity-demo__note {
  margin-top: 14px;

  color: var(--vp-c-text-3);
  font-size: 12px;
}

.unity-demo__player {
  overflow: hidden;

  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;

  background: #000;
}

.unity-demo__player iframe {
  display: block;

  width: 100%;
  height: min(75vh, 850px);
  min-height: 600px;

  border: 0;
}

.unity-demo__toolbar {
  display: flex;
  justify-content: flex-end;

  padding: 10px 14px;

  border-top: 1px solid var(--vp-c-divider);

  background: var(--vp-c-bg-soft);
}

.unity-demo__toolbar a {
  font-size: 13px;
  font-weight: 500;
}
</style>