import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import AdminPanel from '../AdminPanel.vue'
import sHymn from '../../services/HymnService'
import OBSWebSocket from 'obs-websocket-js'

spyOn(sHymn, 'all').mockResolvedValue([])
spyOn(sHymn, 'byNumber').mockResolvedValue({
  id: 25,
  number: 25,
  title: "Siento la presencia del Señor",
  mp3Url: "https://docs.google.com/uc?export=download&id=1LGqFVV0O72W3KGykavnu-WgB-NSm9Se_",
  mp3UrlInstr: "https://docs.google.com/uc?export=download&id=18Gcl7OA_dSWx6ywFletCN4nGeBnhsleg",
  mp3Filename: "025 - Siento la presencia del Senor.mp3",
  verses: [],
  sequence: []
})
spyOn(OBSWebSocket.prototype, 'connect').mockResolvedValue(undefined as any)
spyOn(OBSWebSocket.prototype, 'call').mockResolvedValue({ scenes: [] } as any)

describe("AdminPanel component", () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = mount(AdminPanel)
  })

  it('connects and disconnects', async () => {
    const button = wrapper.get('[title="Conectar"]')

    expect(button.text()).toContain('Desconectado')

    await button.trigger('click')
    await flushPromises()

    expect(button.text()).toContain('Conectado')

    await button.trigger('click')
    await flushPromises()

    expect(button.text()).toContain('Desconectado')
  })

  it('searches a hymn', async () => {
    const numberInput = wrapper.get('[title="Número del himno"]')
    const searchButton = wrapper.get('[title="Buscar"]')

    await numberInput.setValue('25')
    await searchButton.trigger('click')

    const hymnTitle = wrapper.get('[data-test="hymn-title"]')

    expect(hymnTitle.text()).toContain('Reproduciendo: Siento la presencia del Señor')

    const sourceAudio = wrapper.get('audio>source')

    expect(sourceAudio.attributes('src')).toInclude('025%20-%20Siento%20la%20presencia%20del%20Senor.mp3')
  })

  it.skip('enable/disable autoplay', async () => {
    const connectButton = wrapper.get('[title="Conectar"]')
    const enableAutoplayButton = wrapper.get('[title="Activar"]')
    const startButton = wrapper.get('[title="Principio"]')
    const previousButton = wrapper.get('[title="Verso anterior"]')
    const nextButton = wrapper.get('[title="Verso siguiente"]')
    const stopButton = wrapper.get('[title="Detener"]')

    await connectButton.trigger('click')
    await flushPromises()
    await enableAutoplayButton.trigger('click')
    
    expect(enableAutoplayButton.find('.bg-green').exists()).toBeTrue()
    expect(wrapper.find('[title="Desactivar"]').exists()).toBeTrue()

    expect(startButton.attributes('disabled')).toBeDefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()

    await enableAutoplayButton.trigger('click')

    expect(enableAutoplayButton.find('.bg-red').exists()).toBeTrue()
    expect(wrapper.find('[title="Activar"]').exists()).toBeTrue()

    expect(startButton.attributes('disabled')).toBeDefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()
  })

  it.skip('enables/disables controls when connected/disconnected', async () => {
    const numberInput = wrapper.get('[title="Número del himno"]')
    const searchButton = wrapper.get('[title="Buscar"]')
    const startButton = wrapper.get('[title="Principio"]')
    const previousButton = wrapper.get('[title="Verso anterior"]')
    const nextButton = wrapper.get('[title="Verso siguiente"]')
    const stopButton = wrapper.get('[title="Detener"]')

    // enables stop button when connected
    expect(startButton.attributes('disabled')).toBeDefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()

    await numberInput.setValue('25')
    await searchButton.trigger('click')

    // enables next button when hymn is on title
    expect(startButton.attributes('disabled')).toBeDefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()

    await nextButton.trigger('click')

    // enables home button when hymn is on first verse
    expect(startButton.attributes('disabled')).toBeUndefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()

    await nextButton.trigger('click')

    // enables previous button and disables next button when hymn is on last verse
    expect(startButton.attributes('disabled')).toBeUndefined()
    expect(previousButton.attributes('disabled')).toBeUndefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()

    await startButton.trigger('click')

    // disables home and previous buttons when hymn is on title
    expect(startButton.attributes('disabled')).toBeDefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()

    await nextButton.trigger('click')
    await nextButton.trigger('click')
    await searchButton.trigger('click')

    // resets controls when searching a hymn
    expect(startButton.attributes('disabled')).toBeDefined()
    expect(previousButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
    expect(stopButton.attributes('disabled')).toBeUndefined()
  })
})
