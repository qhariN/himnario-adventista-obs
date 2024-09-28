// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AboutApp from '../AboutApp.vue'
import packageJson from '../../../package.json'
import { store } from '../../store'
import { DialogHTMLAttributes } from 'vue'

describe("AdminPanel component", () => {
  it("displays release notes at first visit", () => {
    const wrapper = mount(AboutApp)
    const hymns = wrapper.find('[data-test="release-notes"]')
    const dialog = hymns.element as DialogHTMLAttributes
    expect(dialog.open).toBe(true)
    expect(hymns.text()).toContain(packageJson.version)
  })

  it('does not display release notes if not first visit', async () => {
    vi.spyOn(store, 'isFirstTimeInVersion', 'get').mockReturnValue(false)
    const wrapper = mount(AboutApp)
    const dialog = wrapper.find('[data-test="release-notes"]').element as DialogHTMLAttributes
    expect(dialog.open).toBe(false)
  })

  it('displays release notes when clicking on "Acerca de" button', async () => {
    const wrapper = mount(AboutApp)
    const dialog = wrapper.find('[data-test="release-notes"]').element as DialogHTMLAttributes
    expect(dialog.open).toBe(false)
    const aboutButton = wrapper.find('[title="Acerca de"]')
    await aboutButton.trigger('click')
    expect(dialog.open).toBe(true)
  })
})
