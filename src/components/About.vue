<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import { store } from '../store'
import packageJson from '../../package.json'

const isOpen = ref(false)

onMounted(() => {
  if (store.isFirstTimeInVersion) {
    store.isFirstTimeInVersion = false
    localStorage.setItem('version', packageJson.version)
    openModal()
  }
})

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}
</script>

<template>
  <button @click="openModal" title="About" type="button" class="btn w-7 h-7">
    <img class="dark:invert" src="/svg/about.svg" alt="letter i">
  </button>
  <Dialog :open="isOpen" @close="closeModal" class="relative z-10">
    <div class="fixed inset-0 bg-black bg-opacity-50" />
    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center">
        <DialogPanel class="w-full max-w-[240px] overflow-hidden rounded-lg bg-light-background dark:bg-dark-background p-4 align-middle">
          <DialogTitle as="h2" class="font-bold text-center leading-none">
            Himnario Adventista Broadcast
          </DialogTitle>
          <DialogDescription class="text-sm mt-3">
            <div class="flex flex-col gap-1">
              <div>
                <span class="font-bold">Version</span>
                <p>{{ packageJson.version }}</p>
              </div>
              <div>
                <span class="font-bold">Release notes</span>
                <ul class="list-disc pl-6">
                  <li>Se corrigió un error que hacía que la autoconducción de himnos siempre estuviera en funcionamiento</li>
                  <li>Ahora se muestra un indicador cuando la autoconducción de himnos está activada</li>
                  <li>Se añadió soporte para poder agrupar las fuentes especiales</li>
                </ul>
              </div>
              <div>
                <span class="font-bold">Creator</span>
                <p><a href="https://github.com/jhormanrus" target="_blank" rel="noopener noreferrer" class="link">Jhorman Rus</a></p>
              </div>
              <div>
                <span class="font-bold">Github repository</span>
                <p><a href="https://github.com/jhormanrus/himnario-adventista-broadcast" target="_blank" rel="noopener noreferrer" class="link">himnario-adventista-broadcast</a></p>
              </div>
              <div>
                <span class="font-bold">License</span>
                <p>MIT License</p>
              </div>
            </div>
          </DialogDescription>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.link {
  @apply text-blue hover:underline;
}
</style>
