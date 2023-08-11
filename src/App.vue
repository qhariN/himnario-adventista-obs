<script setup lang="ts">
import AdminPanel from './components/AdminPanel.vue'
</script>

<template>
  <AdminPanel />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  select {
    @apply border-white dark:border-dark-input-bg border-r-8;
  }
  input[type="checkbox"] {
    @apply dark:accent-dark-input-bg;
  }
  audio::-webkit-media-controls-panel {
    @apply dark:bg-dark-button-bg;
  }
}

@layer components {
  .btn {
    @apply rounded px-2 py-1;
    @apply bg-light-button-bg hover:bg-light-button-hover active:bg-light-button-active;
    @apply dark:bg-dark-button-bg dark:hover:bg-dark-button-hover dark:active:bg-dark-button-active;
    @apply disabled:opacity-50 disabled:pointer-events-none;
  }
  .input__text {
    @apply text-sm rounded px-2 py-1 outline-none dark:bg-dark-input-bg;
  }
}

:root {
  color-scheme: light dark;
}
</style>
