import OBSWebSocket, { OBSWebSocketError } from 'obs-websocket-js'
import { type Ref, ref } from 'vue'
import { defaultValues, sceneStatus, store } from '../store'

const obs = new OBSWebSocket()

const connected: Ref<boolean> = ref(false)

export function useObs() {
  async function connect() {
    const url = `ws://${store.obsWebsocketUrl || defaultValues.obsWebsocketUrl}`
    try {
      await obs.connect(url)
      await getScenes()
      if (
        store.sceneList.find((s) => s.sceneName === store.onSearchHymnScene)
      ) {
        sceneStatus.scene = true
        await getSceneItems(store.onSearchHymnScene)
        const items = store.sourceList.map((s) => s.sourceName)
        sceneStatus.source.himno_numero = items.includes('himno_numero')
        sceneStatus.source.himno_titulo = items.includes('himno_titulo')
        sceneStatus.source.verso_numero = items.includes('verso_numero')
        sceneStatus.source.verso_contenido = items.includes('verso_contenido')
      } else {
        sceneStatus.scene = false
        sceneStatus.source = {
          himno_numero: false,
          himno_titulo: false,
          verso_numero: false,
          verso_contenido: false,
        }
      }
      connected.value = true
    } catch {
      alert('Conexión fallida')
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
        sceneName: item.sourceName as string,
      })
      sceneItems.map((i) => {
        i.groupName = item.sourceName
        return i
      })
      groupSceneItems.push(...sceneItems)
    }
    sceneItems = sceneItems.filter((item) => !item.isGroup)
    sceneItems.push(...groupSceneItems)
    // Set source list
    store.sourceList = sceneItems
  }

  async function setCurrentScene(sceneName: string) {
    await obs.call('SetCurrentProgramScene', { sceneName })
  }

  async function setSourceVisibility(sourceName: string, visible: boolean) {
    const sceneItem = store.sourceList.find((s) => s.sourceName === sourceName)
    await obs.call('SetSceneItemEnabled', {
      sceneName: sceneItem.groupName ?? store.onSearchHymnScene,
      sceneItemId: sceneItem.sceneItemId,
      sceneItemEnabled: visible,
    })
  }

  async function setSourceText(sourceName: string, text = '') {
    await obs.call('SetInputSettings', {
      inputName: sourceName,
      inputSettings: {
        text: text,
      },
    })
  }

  async function createScene() {
    await obs.call('CreateScene', { sceneName: store.onSearchHymnScene })
  }

  async function createSource(
    inputName:
      | 'himno_numero'
      | 'himno_titulo'
      | 'verso_numero'
      | 'verso_contenido',
  ) {
    try {
      await obs.call('CreateInput', {
        sceneName: store.onSearchHymnScene,
        inputName,
        inputKind: 'text_gdiplus_v2',
      })
    } catch (error) {
      if (!(error instanceof OBSWebSocketError)) return
      if (error.code === 601) {
        alert(`Este nombre ya está en uso: ${inputName}`)
      }
    }
  }

  function on(
    event: 'SceneListChanged' | 'SceneItemCreated' | 'SceneItemRemoved',
    callback: (data: any) => void,
  ) {
    obs.on(event, callback)
  }

  return {
    on,
    connect,
    disconnect,
    connected,
    getSceneItems,
    setCurrentScene,
    setSourceVisibility,
    setSourceText,
    createScene,
    createSource,
  }
}
