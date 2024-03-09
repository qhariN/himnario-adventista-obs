describe('Hymn Searcher', () => {
  beforeEach(() => {
    cy.intercept('**/hymn').as('getHymns')
    cy.visit('/')
    cy.reload()

    cy.wait('@getHymns').its('response.statusCode').should('eq', 200)
    cy.get('[title="Lista de himnos"]').click()
  })

  it('has a list of hymns', () => {
    cy.get('[data-test="hymn-item"]')
      .should('have.length', 613)
      .first()
      .should('contain', 'Cantad Alegres')
      .next()
      .should('contain', 'Dá gloria al Señor')
  })

  it('selects a hymn', () => {
    cy.get('[data-test="hymn-item"]').first().click()

    cy.get('[data-test="hymn-title"]').should(
      'contain',
      'Reproduciendo: Cantad Alegres',
    )
  })

  describe('when searching', () => {
    it('shows only the hymns that match the search', () => {
      cy.get('[data-test="search-hymn"]').type('Cantad Alegres')

      cy.get('[data-test="hymn-item"]')
        .should('have.length', 1)
        .should('contain', 'Cantad Alegres')
    })

    it('is diacritics insensitive', () => {
      cy.get('[data-test="search-hymn"]').type('da gloria al senor')

      cy.get('[data-test="hymn-item"]')
        .should('have.length', 1)
        .should('contain', 'Dá gloria al Señor')
    })
  })
})
