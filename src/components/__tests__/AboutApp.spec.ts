import { mount } from '@vue/test-utils'
import { describe, expect, it, spyOn } from 'bun:test'
import AboutApp from '../AboutApp.vue'
import packageJson from '../../../package.json'
import { store } from '../../store'
import { DialogHTMLAttributes } from 'vue'

describe("AboutApp component", () => {
  it("displays release notes at first visit", () => {
    const wrapper = mount(AboutApp)
    const hymns = wrapper.find('[data-test="release-notes"]')
    const dialog = hymns.element as DialogHTMLAttributes
    expect(dialog.open).toBeTrue()
    expect(hymns.text()).toContain(packageJson.version)
  })

  it('does not display release notes if not first visit', async () => {
    spyOn(store, 'isFirstTimeInVersion').mockResolvedValue(false)
    const wrapper = mount(AboutApp)
    const dialog = wrapper.find('[data-test="release-notes"]').element as DialogHTMLAttributes
    expect(dialog.open).toBeFalse()
  })

  it('displays release notes when clicking on "Acerca de" button', async () => {
    const wrapper = mount(AboutApp)
    const dialog = wrapper.find('[data-test="release-notes"]').element as DialogHTMLAttributes
    expect(dialog.open).toBeFalse()
    const aboutButton = wrapper.find('[title="Acerca de"]')
    await aboutButton.trigger('click')
    expect(dialog.open).toBeTrue()
  })
})
