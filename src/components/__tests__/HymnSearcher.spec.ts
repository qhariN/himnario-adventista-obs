import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HymnSearcherVue from '../HymnSearcher.vue'
import sHymn from '@/services/HymnService'

vi.spyOn(sHymn, 'all').mockResolvedValue([
  {
    id: 1,
    number: 1,
    title: 'Cantad Alegres',
    mp3Url: '',
    mp3UrlInstr: '',
    mp3Filename: ''
  },
  {
    id: 2,
    number: 2,
    title: 'Dá gloria al Señor',
    mp3Url: '',
    mp3UrlInstr: '',
    mp3Filename: ''
  }
])

// describe('HelloWorld', () => {
//   it('playground', () => {
//     cy.mount(HelloWorld, { props: { msg: 'Hello Cypress' } })
//   })

//   it('renders properly', () => {
//     cy.mount(HelloWorld, { props: { msg: 'Hello Cypress' } })
//     cy.get('h1').should('contain', 'Hello Cypress')
//   })
// })

describe('HymnSearcher', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = mount(HymnSearcherVue)

    expect(sHymn.all).toHaveBeenCalled()
    await flushPromises()
  })

  it('has a list of hymns', async () => {
    const hymns = wrapper.findAll('[data-test="hymn-item"]')

    expect(hymns).toHaveLength(2)
    expect(hymns[0].text()).toContain('Cantad Alegres')
    expect(hymns[1].text()).toContain('Dá gloria al Señor')
  })

  describe('when searching', () => {
    it('shows only the hymns that match the search', async () => {
      const search = wrapper.get('[data-test="search-hymn"]')
      await search.setValue('Cantad Alegres')

      const hymns = wrapper.findAll('[data-test="hymn-item"]')

      expect(hymns).toHaveLength(1)
      expect(hymns[0].text()).toContain('Cantad Alegres')
    })

    it('is diacritics insensitive', async () => {
      const search = wrapper.get('[data-test="search-hymn"]')
      await search.setValue('da gloria al senor')

      const hymns = wrapper.findAll('[data-test="hymn-item"]')

      expect(hymns).toHaveLength(1)
      expect(hymns[0].text()).toContain('Dá gloria al Señor')
    })
  })
})