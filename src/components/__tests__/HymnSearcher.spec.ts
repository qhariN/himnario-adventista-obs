import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import HymnSearcherVue from '../HymnSearcher.vue'
import sHymn from '../../services/HymnService'

spyOn(sHymn, 'all').mockResolvedValue([
  {
    id: 1,
    number: 1,
    title: "Cantad Alegres",
    mp3Filename: "cantad_alegres.mp3",
    mp3Url: "https://example.com/cantad_alegres.mp3",
    mp3UrlInstr: "https://example.com/cantad_alegres_instr.mp3",
  },
  {
    id: 2,
    number: 2,
    title: "Dá gloria al Señor",
    mp3Filename: "cantad_alegres.mp3",
    mp3Url: "https://example.com/cantad_alegres.mp3",
    mp3UrlInstr: "https://example.com/cantad_alegres_instr.mp3",
  }
])

describe("HymnSearcher component", () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = mount(HymnSearcherVue)

    expect(sHymn.all).toHaveBeenCalled()
    await flushPromises()
  })

  it("has a list of hymns", () => {
    const hymns = wrapper.findAll('[data-test="hymn-item"]')

    expect(hymns).toHaveLength(2)
    expect(hymns[0].text()).toContain("Cantad Alegres")
    expect(hymns[1].text()).toContain("Dá gloria al Señor")
  })

  it('emits event when selecting a hymn', async () => {
    const hymn = wrapper.get('[data-test="hymn-item"]')
    await hymn.trigger('click')
    const emitted = wrapper.emitted()

    expect(emitted).toHaveProperty('onPlayHymn')
    expect(emitted.onPlayHymn).toHaveLength(1)
    expect(emitted.onPlayHymn[0]).toEqual([1])
  })

  describe("when searching", () => {
    it("shows only the hymns that match the search", async () => {
      const search = wrapper.get('[data-test="search-hymn"]')
      await search.setValue("Cantad Alegres")

      const hymns = wrapper.findAll('[data-test="hymn-item"]')

      expect(hymns).toHaveLength(1)
      expect(hymns[0].text()).toContain("Cantad Alegres")
    })

    it("is diacritics insensitive", async () => {
      const search = wrapper.get('[data-test="search-hymn"]')
      await search.setValue("da gloria al senor")

      const hymns = wrapper.findAll('[data-test="hymn-item"]')

      expect(hymns).toHaveLength(1)
      expect(hymns[0].text()).toContain("Dá gloria al Señor")
    })
  })
})
