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

.btn {
  @apply border border-neutral-700 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 active:bg-gray-200 dark:active:bg-neutral-500 rounded px-2 py-1 disabled:opacity-50 disabled:pointer-events-none
}
</style>
