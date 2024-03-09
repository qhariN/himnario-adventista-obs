describe('Settings', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.reload()
    cy.get('button[title="Conectar"]').click()
    cy.wait(1000)
    cy.get('button[title="Configuración"]').click()
    cy.get('[data-test="settings"]').should('be.visible')
  })

  it('enable only instrumental', () => {
    cy.contains('Solo instrumental').click()
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const onlyInstrumental = win.localStorage.getItem('onlyInstrumental')
      expect(onlyInstrumental).to.eq('true')
    })
  })

  it('enable autoplay music', () => {
    cy.contains('Autoreproducir música').click()
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const autoplayMusic = win.localStorage.getItem('autoplayMusic')
      expect(autoplayMusic).to.eq('true')
    })
  })

  it('enable autodrive verses', () => {
    cy.contains('Autoconducir versos').click()
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const autodriveVerses = win.localStorage.getItem('autodriveVerses')
      expect(autodriveVerses).to.eq('true')
    })
  })

  it('enable switch to hymn scene on search', () => {
    cy.contains('Cambiar a escena de himno').click()
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const onSearchSwitchToHymnScene = win.localStorage.getItem(
        'onSearchSwitchToHymnScene',
      )
      expect(onSearchSwitchToHymnScene).to.eq('true')
    })
  })

  it.skip('set hymn scene', () => {
    cy.get('select#hs').select('Scene')
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const onSearchHymnScene = win.localStorage.getItem('onSearchHymnScene')
      expect(onSearchHymnScene).to.eq('Scene')
    })
  })

  it.skip('set switch to scene on music end', () => {
    cy.get('select#sc').select('Scene')
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const onMusicEndSwitchToScene = win.localStorage.getItem(
        'onMusicEndSwitchToScene',
      )
      expect(onMusicEndSwitchToScene).to.eq('Scene')
    })
  })

  it('set OBS websocket url', () => {
    cy.get('input#ow').type('localhost:4455')
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const obsWebsocketUrl = win.localStorage.getItem('obsWebsocketUrl')
      expect(obsWebsocketUrl).to.eq('localhost:4455')
    })
  })

  it('set music host url', () => {
    cy.get('input#mh').type('localhost')
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const musicHostUrl = win.localStorage.getItem('musicHostUrl')
      expect(musicHostUrl).to.eq('localhost')
    })
  })

  it('set hymnal api url', () => {
    cy.get('input#ha').type('https://sdah.my.to')
    cy.contains('Guardar y cerrar').click()

    cy.window().then((win) => {
      const hymnalApiUrl = win.localStorage.getItem('hymnalApiUrl')
      expect(hymnalApiUrl).to.eq('https://sdah.my.to')
    })
  })
})
