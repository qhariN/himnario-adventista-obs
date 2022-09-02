<script setup lang="ts">
import { Ref, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import { store } from '../store'

const isOpen = ref(false)
const local: Ref<boolean> = ref(false)

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

function setLocal() {
  store.local = local.value
}
</script>

<template>
  <button @click="openModal" title="Configuration" type="button" class="btn w-7 h-7 ml-auto">
    <img class="dark:invert" src="/svg/gear.svg" alt="search">
  </button>
  <Dialog :open="isOpen" @close="closeModal" class="relative z-10">
    <div class="fixed inset-0 bg-black bg-opacity-50" />
    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center">
        <DialogPanel class="w-full max-w-[240px] overflow-hidden rounded-lg bg-white dark:bg-zinc-800 p-4 align-middle">
          <DialogTitle as="h2" class="font-bold text-center leading-none dark:text-white">
            Settings
          </DialogTitle>
          <DialogDescription class="text-sm dark:text-white my-3">
            <div class="mb-2">
              <h3 class="font-bold">On search:</h3>
              <div class="flex items-center gap-1">
                <label for="local">Autoplay music</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="local">Switch to scene</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="local">Autodrive verses</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="local">Split verse (for long verses)</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>
            </div>
            <div class="mb-2">
              <h3 class="font-bold">On music end:</h3>
              <div class="flex items-center gap-1">
                <label for="local">Switch to scene</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>  
            </div>
            <div class="mb-2">
              <h3 class="font-bold">Network:</h3>
              <div class="flex items-center gap-1">
                <label for="local">Custom OBS websocket URL</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>  
              <div class="flex items-center gap-1">
                <label for="local">Custom music host</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>  
              <div class="flex items-center gap-1">
                <label for="local">Custom hymnal API URL</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>  
            </div>
            <div>
              <div class="flex items-center gap-1">
                <label for="local">Only instrumental</label>
                <input v-model="local" @change="setLocal()" type="checkbox" id="local" class="ml-auto">
              </div>
            </div>
          </DialogDescription>
          <div class="mt-4 flex">
            <button type="button" class="btn ml-auto dark:text-white" @click="closeModal">
              Save and close
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.btn {
  @apply border border-neutral-700 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 active:bg-gray-200 dark:active:bg-neutral-500 rounded px-2 py-1 disabled:opacity-50 disabled:pointer-events-none
}
</style>
