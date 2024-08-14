import { describe, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import { IIngredientState, ingredientReducer } from './ingredientSlice';
import { loadIngredientsThunk } from './actions';

import { getIngredientsApi } from '../../../utils/burger-api';

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

jest.mock('../../../utils/burger-api');
(
  getIngredientsApi as jest.MockedFunction<typeof getIngredientsApi>
).mockImplementation(() => Promise.resolve(ingredients));

const store = configureStore({
  reducer: {
    ingredient: ingredientReducer
  }
});

describe('Тест ingredient slice', () => {
  const initialState: IIngredientState = {
    isLoading: false,
    ingredients: []
  };

  test('Тест 1 - начальное состояние', () => {
    const state = store.getState().ingredient;
    expect(state).toEqual(initialState);
  });

  test('Тест 2 - проверка состояния pending для loadIngredientsThunk', () => {
    store.dispatch(loadIngredientsThunk.pending('requestId'));
    expect(store.getState().ingredient.isLoading).toBe(true);
  });

  test('Тест 3', () => {
    store.dispatch(loadIngredientsThunk.fulfilled([], 'requestId'));
    expect(store.getState().ingredient.ingredients).toEqual([]);
    expect(store.getState().ingredient.isLoading).toBe(false);
  });

  test('Тест 4', () => {
    store.dispatch(
      loadIngredientsThunk.rejected({ name: '', message: 'Ошибка' }, '')
    );
    expect(store.getState().ingredient.isLoading).toBe(false);
  });

  test('Тест 5 - проверка action loadIngredientsThunk', async () => {
    await store.dispatch(loadIngredientsThunk());
    expect(getIngredientsApi).toHaveBeenCalledTimes(1);
    expect(store.getState().ingredient.ingredients).toEqual(ingredients);
  });
});
