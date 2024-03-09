import packageJson from '../../package.json'

describe('Release Notes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays release notes at first visit', () => {
    cy.get('[data-test="release-notes"]')
      .should('be.visible')
      .then(($el) => {
        cy.wrap($el)
          .find('h1')
          .should('contain', 'Himnario Adventista Broadcast')

        cy.wrap($el)
          .find('span')
          .contains('Versión')
          .next()
          .should('contain', packageJson.version)
      })
  })

  it('does not display release notes after first visit', () => {
    cy.get('[data-test="release-notes"]').as('releaseNotes')

    cy.get('@releaseNotes').should('be.visible')
    cy.get('@releaseNotes').find('button[title="Cerrar"]').click()
    cy.get('@releaseNotes').should('not.be.visible')

    cy.reload()
    cy.get('@releaseNotes').should('not.be.visible')
  })

  it('displays release notes when clicking on About', () => {
    cy.reload()
    cy.get('[title="Acerca de"]').click()
    cy.get('[data-test="release-notes"]').should('be.visible')
  })
})
