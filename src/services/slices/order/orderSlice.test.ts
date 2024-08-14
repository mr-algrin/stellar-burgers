import { describe, expect, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import { IOrderState, orderReducer } from './orderSlice';
import { getOrdersThunk } from './actions';

import { getOrdersApi } from '../../../utils/burger-api';

const testOrders = [
  {
    _id: 'order1',
    status: 'completed',
    name: 'Cheeseburger Deluxe',
    createdAt: '2024-08-01T12:00:00Z',
    updatedAt: '2024-08-01T12:30:00Z',
    number: 1001,
    ingredients: ['bun1', 'cheese1', 'patty1', 'lettuce1', 'sauce1']
  },
  {
    _id: 'order2',
    status: 'pending',
    name: 'Vegan Burger',
    createdAt: '2024-08-02T13:00:00Z',
    updatedAt: '2024-08-02T13:15:00Z',
    number: 1002,
    ingredients: ['bun2', 'vegan_patty1', 'tomato1', 'lettuce2', 'sauce2']
  }
];

jest.mock('../../../utils/burger-api');

(getOrdersApi as jest.MockedFunction<typeof getOrdersApi>).mockImplementation(
  () => Promise.resolve(testOrders)
);

const store = configureStore({
  reducer: {
    order: orderReducer
  }
});

describe('Тест order slice', () => {
  const initialState: IOrderState = {
    orders: [],
    isLoading: false
  };

  test('Тест 1 - начальное состояние ', () => {
    expect(store.getState().order).toEqual(initialState);
  });

  test('Тест 2 - проверка состояния pending для getOrdersThunk', () => {
    store.dispatch(getOrdersThunk.pending('requestId'));
    expect(store.getState().order.isLoading).toBe(true);
  });

  test('Тест 3 - проверка состояния fulfilled для getOrdersThunk', () => {
    store.dispatch(getOrdersThunk.fulfilled(testOrders, 'requestId'));
    expect(store.getState().order.isLoading).toBe(false);
    expect(store.getState().order.orders).toEqual(testOrders);
  });

  test('Тест 4 - проверка состояния rejected для getOrdersThunk', () => {
    store.dispatch(
      getOrdersThunk.rejected({ name: '', message: 'Ошибка' }, 'requestId')
    );
    expect(store.getState().order.isLoading).toBe(false);
  });

  test('Тест 5 - загрузка заказов с сервера', async () => {
    await store.dispatch(getOrdersThunk());
    expect(getOrdersApi).toHaveBeenCalledTimes(1);
    expect(store.getState().order.orders).toEqual(testOrders);
    expect(store.getState().order.isLoading).toEqual(false);
  });
});
