<script setup lang="ts">
import { ref } from 'vue'
import CloseIcon from './icons/CloseIcon.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
})

defineExpose({
  open,
  close,
})

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="backdrop:bg-black backdrop:bg-opacity-50 w-full max-w-[280px] rounded-lg bg-light-background dark:bg-dark-background text-black dark:text-white p-0">
    <div class="sticky top-0 inline-flex items-center bg-dark-background border-b border-dark-button-hover p-4 py-3 w-full text-base z-10">
      <h1 class="font-bold leading-none">
        {{ title }}
      </h1>
      <slot name="header"></slot>
      <button @click="close" title="Cerrar" type="button" class="btn w-7 h-7 flex-shrink-0 ms-auto">
        <CloseIcon />
      </button>
    </div>
    <div class="p-4 py-3 text-sm">
      <slot></slot>
      <div class="flex text-base">
        <slot name="footer"></slot>
      </div>
    </div>
  </dialog>
</template>