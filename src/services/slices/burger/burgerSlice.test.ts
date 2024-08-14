import { test, expect, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import {
  IBurgerState,
  burgerReducer,
  initBurger,
  addBurgerBun,
  addBurgerIngredient,
  removeIngredient,
  ingredientMoveUp,
  ingredientMoveDown
} from './burgerSlice';
import { createBurgerThunk } from './actions';

import { TIngredient, TOrder } from '../../../utils/types';
import { orderBurgerApi, TNewOrderResponse } from '../../../utils/burger-api';

const testUuids = [
  '4f6c2db5-4c3f-4d5c-b51e-7f49a0deac7d',
  '2f71423d-8df1-46e6-89db-85d2c96f7c99',
  'e2d3b42b-4859-4e13-a624-4b33b865baf2',
  '3ad63a98-dc7c-4f36-918b-c178084ef3e1',
  'b7c1ed91-7d9f-4ac2-84b4-5b5991c239cf'
];

let currentUuid = testUuids[0];

const ingredientWithId = (ingredient: TIngredient, id: string) => ({
  ...ingredient,
  id
});

// Mock the uuid4 module
jest.mock('uuid4', () => jest.fn(() => currentUuid));

// Тестовые данные ингредиентов
const ingredients = [
  {
    _id: '1',
    name: 'Sesame Bun',
    type: 'bun',
    proteins: 7,
    fat: 4,
    carbohydrates: 25,
    calories: 150,
    price: 200,
    image: 'https://example.com/images/sesame-bun.png',
    image_large: 'https://example.com/images/sesame-bun-large.png',
    image_mobile: 'https://example.com/images/sesame-bun-mobile.png'
  },
  {
    _id: '2',
    name: 'Tomato Sauce',
    type: 'sauce',
    proteins: 2,
    fat: 0.5,
    carbohydrates: 6,
    calories: 30,
    price: 80,
    image: 'https://example.com/images/tomato-sauce.png',
    image_large: 'https://example.com/images/tomato-sauce-large.png',
    image_mobile: 'https://example.com/images/tomato-sauce-mobile.png'
  },
  {
    _id: '3',
    name: 'Beef Patty',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 250,
    price: 300,
    image: 'https://example.com/images/beef-patty.png',
    image_large: 'https://example.com/images/beef-patty-large.png',
    image_mobile: 'https://example.com/images/beef-patty-mobile.png'
  },
  {
    _id: '4',
    name: 'BBQ Sauce',
    type: 'sauce',
    proteins: 1,
    fat: 0.3,
    carbohydrates: 10,
    calories: 50,
    price: 70,
    image: 'https://example.com/images/bbq-sauce.png',
    image_large: 'https://example.com/images/bbq-sauce-large.png',
    image_mobile: 'https://example.com/images/bbq-sauce-mobile.png'
  },
  {
    _id: '5',
    name: 'Lettuce',
    type: 'main',
    proteins: 1,
    fat: 0.2,
    carbohydrates: 2,
    calories: 15,
    price: 50,
    image: 'https://example.com/images/lettuce.png',
    image_large: 'https://example.com/images/lettuce-large.png',
    image_mobile: 'https://example.com/images/lettuce-mobile.png'
  }
];

const orderIngredients = [ingredients[0], ingredients[1], ingredients[2]];

// Тестовый заказ
const order: TOrder = {
  _id: currentUuid,
  name: '',
  ingredients: orderIngredients.map((i) => i._id),
  status: '',
  number: orderIngredients
    .map((i) => i.price)
    .reduce((next, current) => next + current, 0),
  createdAt: '',
  updatedAt: ''
};

jest.mock('../../../utils/burger-api');
(
  orderBurgerApi as jest.MockedFunction<typeof orderBurgerApi>
).mockImplementation((data: Array<string>) =>
  Promise.resolve<TNewOrderResponse>({ name: '', order: order, success: true })
);

const createStore = () =>
  configureStore({
    reducer: {
      burger: burgerReducer
    }
  });

let store = createStore();

beforeEach(() => {
  store = createStore();
});

describe('Тест burger slice', () => {
  const initialState: IBurgerState = {
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderData: null
  };

  test('Тест 1a - обработка начального состояния', () => {
    expect(store.getState().burger).toEqual(initialState);
  });

  test('Тест 1b - инициализация состояния', () => {
    store.dispatch(addBurgerIngredient(ingredients[1]));
    store.dispatch(initBurger());
    expect(store.getState().burger).toEqual(initialState);
  });

  test('Тест 2 - добавление ингредиента булочки', () => {
    const bun = ingredients[0];
    store.dispatch(addBurgerBun(bun));
    const { burgerConstructor } = store.getState().burger;
    expect(burgerConstructor.bun).toEqual(bun);
    expect(burgerConstructor.ingredients).toHaveLength(0);
  });

  test('Тест 3 - добавление ингредиента в бургер', () => {
    const ingredient = ingredients[ingredients.length - 1];
    store.dispatch(addBurgerIngredient(ingredient));
    const { burgerConstructor } = store.getState().burger;
    expect(burgerConstructor.ingredients).toHaveLength(1);
    expect(burgerConstructor.ingredients).toEqual([
      ingredientWithId(ingredient, currentUuid)
    ]);
  });

  test('Тест 4 - удаление ингредиента', () => {
    const ingredient = ingredients[ingredients.length - 1];
    store.dispatch(addBurgerIngredient(ingredient));
    let { burgerConstructor } = store.getState().burger;

    // Добавление ингредиента
    store.dispatch(removeIngredient(0));
    expect(burgerConstructor.ingredients).toHaveLength(1);

    // Удаление ингредиента
    burgerConstructor = store.getState().burger.burgerConstructor;
    expect(burgerConstructor.ingredients).toHaveLength(0);
    expect(burgerConstructor.ingredients).toEqual([]);
  });

  test('Тест 5 - перемещение ингредиента вверх', () => {
    // Добавление двух ингредиентов
    currentUuid = testUuids[0];
    let ingredient = ingredients[1];
    store.dispatch(addBurgerIngredient(ingredient));
    const firstIngredient = ingredientWithId(ingredient, currentUuid);
    currentUuid = testUuids[1];
    ingredient = ingredients[2];
    store.dispatch(addBurgerIngredient(ingredient));
    const secondIngredient = ingredientWithId(ingredient, currentUuid);

    let { burgerConstructor } = store.getState().burger;
    expect(burgerConstructor.ingredients).toEqual([
      firstIngredient,
      secondIngredient
    ]);
    expect(burgerConstructor.ingredients).toHaveLength(2);
    store.dispatch(ingredientMoveUp(1));
    burgerConstructor = store.getState().burger.burgerConstructor;
    expect(burgerConstructor.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
    expect(burgerConstructor.ingredients).toHaveLength(2);
  });

  test('Тест 6 - перемещение ингредиента вниз', () => {
    // Добавление двух ингредиентов
    currentUuid = testUuids[0];
    let ingredient = ingredients[1];
    store.dispatch(addBurgerIngredient(ingredient));
    const firstIngredient = ingredientWithId(ingredient, currentUuid);
    currentUuid = testUuids[1];
    ingredient = ingredients[2];
    store.dispatch(addBurgerIngredient(ingredient));
    const secondIngredient = ingredientWithId(ingredient, currentUuid);

    let { burgerConstructor } = store.getState().burger;
    expect(burgerConstructor.ingredients).toEqual([
      firstIngredient,
      secondIngredient
    ]);
    expect(burgerConstructor.ingredients).toHaveLength(2);
    store.dispatch(ingredientMoveDown(0));
    burgerConstructor = store.getState().burger.burgerConstructor;
    expect(burgerConstructor.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
    expect(burgerConstructor.ingredients).toHaveLength(2);
  });

  test('Тест 7 - проверка состояния pending для createBurgerThunk', () => {
    store.dispatch(createBurgerThunk.pending('requestId', []));
    const { orderRequest } = store.getState().burger;
    expect(orderRequest).toBe(true);
  });

  test('Тест 8 - проверка состояния fulfilled для createBurgerThunk', () => {
    store.dispatch(
      createBurgerThunk.fulfilled(
        { success: true, name: '', order: order },
        'requestId',
        []
      )
    );
    const { orderRequest, orderData } = store.getState().burger;
    expect(orderRequest).toBe(false);
    expect(orderData).toEqual(order);
  });

  test('Тест 9 - проверка состояния rejected для createBurgerThunk', () => {
    store.dispatch(
      createBurgerThunk.rejected(
        { name: '', message: 'Ошибка' },
        'requestId',
        []
      )
    );
    expect(store.getState().burger.orderRequest).toBe(false);
  });

  test('Тест 10 - action создания заказа', async () => {
    await store.dispatch(createBurgerThunk(order.ingredients));
    expect(orderBurgerApi).toHaveBeenCalledTimes(1);
    expect(store.getState().burger.orderData).toEqual(order);
  });
});
