import Cypress from 'cypress';

const testBun = {
  _id: '60d3b41abdacab0026a733c6',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 200,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
};

const testMain = {
  _id: '60d3b41abdacab0026a733c7',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 300,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png'
};

const testSauce = {
  _id: '60d3b41abdacab0026a733c8',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 70,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

beforeEach(() => {
  // Перехват запроса на эндпоинт `api/ingredients` и возврат моковых данных
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  // Перехват запроса на эндпоинт `api/auth/user` и возврат моковых данных
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
    fixture: 'user.json'
  }).as('getUser');

  // Перехват запроса на эндпоинт `/api/orders` и возврат моковых данных
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
    fixture: 'order.json'
  }).as('createOrder');

  // Открытие страницы конструктора
  cy.visit('http://localhost:4000/');
  // Ожидаем завершение загрузки пользователя
  cy.wait('@getUser');
  // Ожидаем завершение загрузки ингредиентов
  cy.wait('@getIngredients');
});

describe('Тест Constructor Page', () => {
  it('Добавление булки в конструктор', () => {
    // Добавление булки в конструктор
    cy.get(`[data-test-id="bun-${testBun._id}"]`)
      .should('contain', testBun.name)
      .within(() => {
        cy.get('.common_button').click();
      });
    // Проверка что булка есть в конструкторе
    cy.get('.constructor-element_pos_top').should('contain', testBun.name);
    cy.get('.constructor-element_pos_bottom').should('contain', testBun.name);
  });

  it('Добавление булки и ингредиентов в конструктор', () => {
    // Добавление булки в конструктор
    cy.get(`[data-test-id="bun-${testBun._id}"]`).within(() => {
      cy.get('.common_button').click();
    });
    // Проверка что булка есть в конструкторе
    cy.get('.constructor-element_pos_top').should('contain', testBun.name);
    cy.get('.constructor-element_pos_bottom').should('contain', testBun.name);
    // Добавление ингредиента и соуса в конструктор
    cy.get(`[data-test-id="main-${testMain._id}"]`).within(() => {
      cy.get('.common_button').click();
    });
    cy.get(`[data-test-id="sauce-${testSauce._id}"]`).within(() => {
      cy.get('.common_button').click();
    });
    // Проверка что ингредиенты добавлены в конструктор
    cy.get('.constructor-element').should('have.length', 4);
  });

  it('Открытие модального окна ингредиента', () => {
    cy.get(`[data-test-id="bun-${testBun._id}"]`).click();
    cy.get('#modals').should('contain', testBun.name);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.get(`[data-test-id="bun-${testBun._id}"]`).click();
    cy.get('#modals').should('contain', testBun.name);
    cy.get('#modals-close').click();
    cy.get('#modals').should('not.contain.html');
  });

  it('Открытие и закрытие модального окна по клику на оверлей', () => {
    cy.get(`[data-test-id="main-${testMain._id}"]`).click();
    cy.get('#modals').should('contain', testMain.name);
    cy.get('[data-test-id="modals-overlay"]')
      .invoke('css', 'z-index', '9999')
      .should('be.visible')
      .click();
  });

  it('Создание нового заказа', () => {
    // Подставляем токен авторизации
    cy.setCookie('accessToken', 'test-access-token');

    // Добавление ингредиентов в конструктор
    cy.get(`[data-test-id="bun-${testBun._id}"]`).within(() => {
      cy.get('.common_button').click();
    });
    cy.get(`[data-test-id="main-${testMain._id}"]`).within(() => {
      cy.get('.common_button').click();
    });
    cy.get(`[data-test-id="sauce-${testSauce._id}"]`).within(() => {
      cy.get('.common_button').click();
    });

    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get('.constructor-element').should('have.length', 4);

    // Нажимаем кнопку «Оформить заказ»
    cy.get('button').contains('Оформить заказ').click();

    // Ожидание ответа о создании заказа
    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    // Проверяем, что заказ отобразился в модальном окне
    cy.get('#modals').should('contain.html');
    cy.get('#modals').should('contain', 50076);

    // Закрытие модального окна
    cy.get('#modals-close').click();
    cy.get('#modals').should('not.contain.html');

    // Проверяем, что конструктор пуст после создания заказа
    cy.get('.constructor-element').should('have.length', 0);
  });
});
