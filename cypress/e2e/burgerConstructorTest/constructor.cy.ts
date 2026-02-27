describe('Тестирование конструктора бургера -- моки API', () => {
  const sel = {
    ingredient: '[data-cy="ingredient"]',
    dropzone: '[data-cy="constructor-dropzone"]',
    constructorItem: '[data-cy="constructor-item"]',
    orderBtn: '[data-cy="open-order-button"]',
    modal: '[data-cy="modal"]',
    modalClose: '[data-cy="modal-close"]',
    modalOverlay: '[data-cy="modal-overlay"]',
    constructorEmpty: '[data-cy="constructor-empty"]',
  }

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients')
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser')

    cy.visit('/')
    cy.wait('@getIngredients')
  })

  const addIngredient = (name: string) => {
    cy.contains(sel.ingredient, name)
      .scrollIntoView()
      .within(() => {
        cy.contains('button', /добавить/i).click()
      })
  }

  it('Добавление булки и начинки в конструктор', () => {
    addIngredient('Булка тестовая')
    addIngredient('Котлета тестовая')

    cy.contains(sel.constructorItem, 'Булка тестовая').should('exist')
    cy.contains(sel.dropzone, 'Котлета тестовая').should('exist')
  })

  it('Открытие и закрытие (на крестик) модалки', () => {
    cy.contains('Булка тестовая').click()

    cy.get(sel.modal).should('be.visible')
    cy.get(sel.modal).should('contain', 'Булка тестовая')

    cy.get(sel.modalClose).click()
    cy.get(sel.modal).should('not.exist')
  })

  it('Закрытие модалки по оверлею', () => {
    cy.contains('Булка тестовая').click()

    cy.get(sel.modal).should('be.visible')

    cy.get(sel.modalOverlay).click({ force: true })
    cy.get(sel.modal).should('not.exist')
  })

  it('Создание заказа', () => {
    // ВАЖНО: делаем новый визит, чтобы токены были ДО загрузки приложения
    cy.intercept('POST', '**/orders*', (req) => {
      expect(req.body.ingredients).to.be.an('array').and.not.to.be.empty
      req.reply({ fixture: 'order.json', delayMs: 800 })
    }).as('createOrder')

    cy.visit('createOrder')

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'Bearer test-access-token')
        win.localStorage.setItem('refreshToken', 'test-refresh-token')
      }
    })

    cy.wait('@getIngredients')
    cy.wait('@getUser')

    addIngredient('Булка тестовая')
    addIngredient('Котлета тестовая')

    cy.contains(sel.constructorItem, 'Булка тестовая').should('exist')
    cy.contains(sel.dropzone, 'Котлета тестовая').should('exist')

    cy.contains('button', /оформить заказ/i)
      .should('be.visible')
      .and('not.be.disabled')
      .click()

    cy.wait('@createOrder', { timeout: 10000 })

    cy.get(sel.modal, { timeout: 10000 }).should('be.visible')
    cy.contains(sel.modal, '12345').should('be.visible')

    cy.get(sel.modalClose).click()
    cy.get(sel.modal).should('not.exist')

    cy.get(sel.constructorEmpty).should('be.visible')
  })
})
