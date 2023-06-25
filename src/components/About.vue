<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { store } from '../store'
import packageJson from '../../package.json'

const modal = ref<HTMLDialogElement | null>(null)

function openModal() {
  modal.value!.showModal()
}

function closeModal() {
  modal.value!.close()
}

onMounted(() => {
  if (store.isFirstTimeInVersion) {
    store.isFirstTimeInVersion = false
    localStorage.setItem('version', packageJson.version)
    openModal()
  }
})
</script>

<template>
  <button @click="openModal" title="Acerca de" type="button" class="btn w-7 h-7">
    <img class="dark:invert" src="/svg/about.svg" alt="letter i">
  </button>
  <dialog ref="modal" class="backdrop:bg-black backdrop:bg-opacity-50 w-full max-w-[270px] rounded-lg bg-light-background dark:bg-dark-background text-black dark:text-white p-5 align-middle text-base">
    <h1 class="font-bold text-center leading-none">
      Himnario Adventista Broadcast
    </h1>
    <div class="flex flex-col gap-1 text-sm my-4">
      <div>
        <span class="font-bold">Versión</span>
        <p>{{ packageJson.version }}</p>
      </div>
      <div>
        <span class="font-bold">Notas de la versión</span>
        <ul class="list-disc pl-6">
          <li>Se añadió un acceso rápido para activar <b>Autoconducir</b> desde el panel principal</li>
          <li>Se añadió el botón <b>Detener</b> para detener la reproducción (y cambiar de escena)</li>
        </ul>
      </div>
      <div>
        <span class="font-bold">Creador</span>
        <p><a href="https://github.com/jhormanrus" target="_blank" rel="noopener noreferrer" class="link">Jhorman Rus</a></p>
      </div>
      <div>
        <span class="font-bold">Repositorio</span>
        <p><a href="https://github.com/jhormanrus/himnario-adventista-broadcast" target="_blank" rel="noopener noreferrer" class="link">himnario-adventista-broadcast</a></p>
      </div>
      <div>
        <span class="font-bold">Licencia</span>
        <p>MIT License</p>
      </div>
    </div>
    <div class="flex">
      <button type="button" class="btn ml-auto" @click="closeModal">
        Cerrar
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.link {
  @apply text-blue hover:underline;
}
</style>
