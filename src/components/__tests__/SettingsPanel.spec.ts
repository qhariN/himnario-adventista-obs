import { beforeEach, describe, expect, it } from 'bun:test'
import { VueWrapper, mount } from '@vue/test-utils'
import SettingsPanel from '../SettingsPanel.vue'

describe("AdminPanel component", () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = mount(SettingsPanel)
  })

  it('enable only instrumental', async () => {
    const onlyInstrumental = wrapper.get('input#oi')
    await onlyInstrumental.setValue('true')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('onlyInstrumental')).toBe('true')
  })

  it('enable autoplay music', async () => {
    const autoplayMusic = wrapper.get('input#am')
    await autoplayMusic.setValue('true')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('autoplayMusic')).toBe('true')
  })

  it('enable autodrive verses', async () => {
    const autodriveVerses = wrapper.get('input#av')
    await autodriveVerses.setValue('true')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('autodriveVerses')).toBe('true')
  })

  it('enable switch to hymn scene on search', async () => {
    const onSearchSwitchToHymnScene = wrapper.get('input#sch')
    await onSearchSwitchToHymnScene.setValue('true')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('onSearchSwitchToHymnScene')).toBe('true')
  })

  it.skip('set hymn scene', async () => {
    const onSearchHymnScene = wrapper.get('select#hs')
    await onSearchHymnScene.setValue('Scene')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('onSearchHymnScene')).toBe('Scene')
  })

  it.skip('set switch to scene on music end', async () => {
    const switchToSceneOnMusicEnd = wrapper.get('select#sc')
    await switchToSceneOnMusicEnd.setValue('Scene')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('switchToSceneOnMusicEnd')).toBe('Scene')
  })

  it('set OBS websocket url', async () => {
    const obsWebsocketUrl = wrapper.get('input#ow')
    await obsWebsocketUrl.setValue('localhost:4455')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('obsWebsocketUrl')).toBe('localhost:4455')
  })

  it('set music host url', async () => {
    const musicHostUrl = wrapper.get('input#mh')
    await musicHostUrl.setValue('localhost')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('musicHostUrl')).toBe('localhost')
  })

  it('set hymnal api url', async () => {
    const hymnalApiUrl = wrapper.get('input#ha')
    await hymnalApiUrl.setValue('https://sdah.my.to')
    const saveButton = wrapper.find('button[title="Guardar y cerrar"]')
    await saveButton.trigger('click')

    expect(window.localStorage.getItem('hymnalApiUrl')).toBe('https://sdah.my.to')
  })
})
