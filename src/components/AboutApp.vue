<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { store } from '../store'
import packageJson from '../../package.json'
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
  <BasicDialog ref="dialog" title="Himnario Adventista Broadcast">
    <div class="flex flex-col gap-1">
      <div>
        <span class="font-bold">Versión</span>
        <p>{{ packageJson.version }}</p>
      </div>
      <div>
        <span class="font-bold">Notas de la versión</span>
        <ul class="list-disc pl-6">
          <li>El <b>buscador de himnos</b> ahora es agnóstico a diacríticos, esto mejora la búsqueda de himnos</li>
          <li>Ahora el contenido de los versos es más corto, con el fin de soportar pantallas de resolución baja</li>
          <li>Ahora solo se hacen transiciones a la escena del himno cuando la configuración <b>Cambiar a escena de himno</b></li>
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
  </BasicDialog>
</template>

<style scoped>
.link {
  @apply text-blue hover:underline;
}
</style>
