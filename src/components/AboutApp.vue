<script setup lang="ts">
import { onMounted, ref } from 'vue'
import packageJson from '../../package.json'
import { store } from '../store'
import BasicDialog from './BasicDialog.vue'
import AboutIcon from './icons/AboutIcon.vue'

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)

onMounted(() => {
  if (store.isFirstTimeInVersion) {
    store.isFirstTimeInVersion = false
    localStorage.setItem('version', packageJson.version)
    dialog.value!.open()
  }
})
</script>

<template>
  <button @click="dialog!.open" title="Acerca de" type="button" class="btn w-7 h-7">
    <AboutIcon />
  </button>
  <BasicDialog ref="dialog" title="Himnario Adventista Broadcast" data-test="release-notes">
    <div class="flex flex-col gap-1">
      <div>
        <span class="font-bold">Versión</span>
        <p>{{ packageJson.version }}</p>
      </div>
      <div>
        <span class="font-bold">Notas de la versión</span>
        <ul class="list-disc pl-6">
          <li>Se renombraron las fuentes requeridas, ahora las fuentes requeridas son: <b>himno_numero, himno_titulo, verso_numero, verso_contenido</b></li>
          <li>Ahora se mostrarán las fuentes requeridas faltantes al conectarse a <b>OBS Studio</b></li>
          <li>Se agregó una sección de guías</li>
        </ul>
      </div>
      <div>
        <span class="font-bold">Guías</span>
        <ul class="list-disc pl-6">
          <li>
            <a href="https://github.com/jhormanrus/himnario-adventista-broadcast/wiki/C%C3%B3mo-configurar-OBS-Studio-para-usar-el-Himnario-Adventista-Broadcast" target="_blank" rel="noopener noreferrer" class="link">
              Cómo configurar OBS Studio para usar el Himnario Adventista Broadcast
            </a>
          </li>
          <li>
            <a href="https://github.com/jhormanrus/himnario-adventista-broadcast/wiki/C%C3%B3mo-configurar-el-servidor-WebSocket-en-OBS-Studio" target="_blank" rel="noopener noreferrer" class="link">
              Cómo configurar el servidor WebSocket en OBS Studio
            </a>
          </li>
        </ul>
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
  </BasicDialog>
</template>

<style scoped>
.link {
  @apply text-blue hover:underline;
}
</style>
