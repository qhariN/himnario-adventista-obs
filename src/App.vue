<script setup lang="ts">
import Admin from './components/Admin.vue';
</script>

<template>
  <Admin />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply rounded px-2 py-1;
    @apply bg-light-button-bg hover:bg-light-button-hover active:bg-light-button-active;
    @apply dark:bg-dark-button-bg dark:hover:bg-dark-button-hover dark:active:bg-dark-button-active;
    @apply disabled:opacity-50 disabled:pointer-events-none;
  }
  .input__text {
    @apply text-sm dark:text-black rounded px-2 py-1 outline-none;
  }
}
</style>
