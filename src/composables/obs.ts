import ObsWebSocket from 'obs-websocket-js'
import { defaultValues, store } from '../store'
import { ref, type Ref } from 'vue'

export function useObs() {
  const obs = new ObsWebSocket()

  const connected: Ref<boolean> = ref(false)

  async function connect() {
    const url = `ws://${store.obsWebsocketUrl || defaultValues.obsWebsocketUrl}`
    try {
      await obs.connect(url)
      connected.value = true
      getScenes()
      getSceneItems(store.onSearchHymnScene)
    } catch {
      alert(`Conexión fallida`)
    }
  }

  async function disconnect() {
    await obs.disconnect()
    connected.value = false
  }

  async function getScenes() {
    const { scenes } = await obs.call('GetSceneList')
    store.sceneList = scenes
  }
  
  async function getSceneItems(sceneName: string) {
    let { sceneItems } = await obs.call('GetSceneItemList', { sceneName })
    // Get group scene items
    const groupSceneItems = [] as any[]
    for (const item of sceneItems) {
      if (!item.isGroup) continue
      const { sceneItems } = await obs.call('GetGroupSceneItemList', {
        sceneName: item.sourceName as string
      })
      sceneItems.map(i => i.groupName = item.sourceName)
      groupSceneItems.push(...sceneItems)
    }
    sceneItems = sceneItems.filter(item => !item.isGroup)
    sceneItems.push(...groupSceneItems)
    // Set source list
    store.sourceList = sceneItems
  }

  async function setCurrentScene(sceneName: string) {
    await obs.call('SetCurrentProgramScene', { sceneName })
  }

  async function setSourceVisibility(sourceName: string, visible: boolean) {
    const sceneItem = store.sourceList.find(s => s.sourceName === sourceName)
    await obs.call('SetSceneItemEnabled', {
      sceneName: sceneItem.groupName?? store.onSearchHymnScene,
      sceneItemId: sceneItem.sceneItemId,
      sceneItemEnabled: visible
    })
  }

  async function setSourceText(sourceName: string, text: string = '') {
    await obs.call('SetInputSettings', {
      inputName: sourceName,
      inputSettings: {
        text: text
      }
    })
  }

  return {
    connected,
    connect,
    disconnect,
    setCurrentScene,
    setSourceVisibility,
    setSourceText
  }
}
