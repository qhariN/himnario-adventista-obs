<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})

defineExpose({
  open,
  close
})

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value!.showModal()
}

function close() {
  dialog.value!.close()
}
</script>

<template>
  <dialog ref="dialog" class="backdrop:bg-black backdrop:bg-opacity-50 w-full max-w-[280px] rounded-lg bg-light-background dark:bg-dark-background text-black dark:text-white px-4 py-5 align-middle text-base">
    <h1 class="font-bold text-center leading-none">
      {{ title }}
    </h1>
    <slot></slot>
    <div class="flex">
      <slot name="footer"></slot>
    </div>
  </dialog>
</template>