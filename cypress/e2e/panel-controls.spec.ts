describe('Panel Controls', () => {
  beforeEach(() => {
    cy.intercept('**/hymn/25').as('getHymn')
    cy.visit('/')
    cy.reload()
  })

  it.skip('connects and disconnects', () => {
    cy.get('button[title="Conectar"]').click()
    cy.wait(1000)
    cy.get('button[title="Conectar"]').should('not.exist')  
    cy.get('button[title="Desconectar"]').should('be.visible')
    cy.get('button[title="Desconectar"]').click()
    cy.get('button[title="Desconectar"]').should('not.exist')
    cy.get('button[title="Conectar"]').should('be.visible')
  })

  it('searches a hymn', () => {
    cy.get('input#number').type('25')
    cy.get('button[title="Buscar"]').click()
    cy.wait('@getHymn').its('response.statusCode').should('eq', 200)
    cy.get('[data-test="hymn-title"]').should('contain', 'Reproduciendo: Siento la presencia del Señor')
    cy.get('audio>source').should('have.attr', 'src')
  })

  it('searches a hymn by pressing enter', () => {
    cy.get('input#number').type('25{enter}')
    cy.wait('@getHymn').its('response.statusCode').should('eq', 200)
    cy.get('[data-test="hymn-title"]').should('contain', 'Reproduciendo: Siento la presencia del Señor')
    cy.get('audio>source').should('have.attr', 'src')
  })

  it.skip('enable/disable autoplay', () => {
    cy.get('button[title="Conectar"]').click()
    cy.wait(1000)
    cy.get('input#number').type('25{enter}')
    cy.wait('@getHymn')

    cy.get('button[title="Activar"]').click()
    cy.get('button[title="Activar"]').should('not.exist')
    cy.get('button[title="Desactivar"]').should('be.visible')
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')

    cy.get('button[title="Desactivar"]').click()
    cy.get('button[title="Desactivar"]').should('not.exist')
    cy.get('button[title="Activar"]').should('be.visible')
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('not.be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')
  })

  it.skip('enables/disables controls when connected/disconnected', () => {
    // disables controls when disconnected
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('be.disabled')
    cy.get('button[title="Detener"]').should('be.disabled')

    cy.get('button[title="Conectar"]').click()
    cy.wait(1000)

    // enables stop button when connected
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')

    cy.get('input#number').type('25{enter}')
    cy.wait('@getHymn')

    // enables next button when hymn is on title
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('not.be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')

    // enables home button when hymn is on first verse
    cy.get('button[title="Verso siguiente"]').click()
    cy.get('button[title="Principio"]').should('not.be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('not.be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')

    // enables previous button and disables next button when hymn is on last verse
    cy.get('button[title="Verso siguiente"]').click()
    cy.get('button[title="Principio"]').should('not.be.disabled')
    cy.get('button[title="Verso anterior"]').should('not.be.disabled')
    cy.get('button[title="Verso siguiente"]').should('be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')

    // disables home and previous buttons when hymn is on title
    cy.get('button[title="Principio"]').click()
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('not.be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')

    cy.get('button[title="Verso siguiente"]').click()
    cy.get('button[title="Verso siguiente"]').click()
    cy.get('button[title="Buscar"]').click()
    cy.wait('@getHymn')

    // resets controls when searching a hymn
    cy.get('button[title="Principio"]').should('be.disabled')
    cy.get('button[title="Verso anterior"]').should('be.disabled')
    cy.get('button[title="Verso siguiente"]').should('not.be.disabled')
    cy.get('button[title="Detener"]').should('not.be.disabled')
  })
})
