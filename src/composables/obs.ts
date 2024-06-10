import obsWebSocket, { OBSWebSocketError } from 'obs-websocket-js'
import { type Ref, ref } from 'vue'
import { defaultValues, sceneStatus, store } from '../store'

const obs = new obsWebSocket()

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
        sceneStatus.source.himnoNumero = items.includes('himno_numero')
        sceneStatus.source.himnoTitulo = items.includes('himno_titulo')
        sceneStatus.source.versoNumero = items.includes('verso_numero')
        sceneStatus.source.versoContenido = items.includes('verso_contenido')
      } else {
        sceneStatus.scene = false
        sceneStatus.source = {
          himnoNumero: false,
          himnoTitulo: false,
          versoNumero: false,
          versoContenido: false,
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

  async function reconnect() {
    if (!connected.value) {
      return
    }
    await disconnect()
    await connect()
  }

  async function getScenes() {
    const { scenes } = await obs.call('GetSceneList')
    store.sceneList = scenes
  }

  async function getSceneItems(sceneName: string) {
    let { sceneItems } = await obs.call('GetSceneItemList', { sceneName })
    // Get group scene items
    const groupSceneItems = []
    for (const item of sceneItems) {
      if (!item.isGroup) {
        continue
      }
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
      if (!(error instanceof OBSWebSocketError)) {
        return
      }
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
    reconnect,
    connected,
    getSceneItems,
    setCurrentScene,
    setSourceVisibility,
    setSourceText,
    createScene,
    createSource,
  }
}
