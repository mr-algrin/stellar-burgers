import { describe, expect, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import { feedReducer, feedInitialState } from './feedSlice';
import { getFeedsThunk } from './actions';
import { TOrder } from '../../../utils/types';
import { getFeedsApi } from '../../../utils/burger-api';

export const testOrders: TOrder[] = [
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
  },
  {
    _id: 'order3',
    status: 'in progress',
    name: 'Chicken Sandwich',
    createdAt: '2024-08-03T14:00:00Z',
    updatedAt: '2024-08-03T14:45:00Z',
    number: 1003,
    ingredients: ['bun3', 'chicken_patty1', 'lettuce3', 'mayo1']
  },
  {
    _id: 'order4',
    status: 'cancelled',
    name: 'Double Cheeseburger',
    createdAt: '2024-08-04T15:00:00Z',
    updatedAt: '2024-08-04T15:05:00Z',
    number: 1004,
    ingredients: ['bun4', 'cheese2', 'patty2', 'patty3', 'sauce3', 'onion1']
  },
  {
    _id: 'order5',
    status: 'completed',
    name: 'Fish Fillet Burger',
    createdAt: '2024-08-05T16:00:00Z',
    updatedAt: '2024-08-05T16:25:00Z',
    number: 1005,
    ingredients: ['bun5', 'fish_patty1', 'lettuce4', 'tartar_sauce1']
  }
];

jest.mock('../../../utils/burger-api');
(getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockImplementation(
  () =>
    Promise.resolve({
      orders: testOrders,
      totalToday: 2,
      total: testOrders.length,
      success: true
    })
);

const store = configureStore({
  reducer: {
    feed: feedReducer
  }
});

describe('Тест feed slice', () => {
  test('Тест 1 - начальное состояние', () => {
    const state = store.getState().feed;
    expect(state).toEqual(feedInitialState);
  });

  test('Тест 2 - обработка состояния pending для getFeedsThunk', () => {
    store.dispatch(getFeedsThunk.pending('requestId'));
    expect(store.getState().feed.isLoading).toBe(true);
  });

  test('Тест 3 - обработка состояния fulfilled для getFeedsThunk', () => {
    // Проверка состояния success - true
    store.dispatch(
      getFeedsThunk.fulfilled(
        {
          success: true,
          total: testOrders.length,
          totalToday: 5,
          orders: testOrders
        },
        'requestId'
      )
    );
    let feed = store.getState().feed;
    expect(feed.isLoading).toBe(false);
    expect(feed.feeds).toEqual(testOrders);
    expect(feed.total).toBe(testOrders.length);
    expect(feed.totalToday).toBe(5);

    // Проверка состояния success - false
    store.dispatch(
      getFeedsThunk.fulfilled(
        { success: false, total: 0, totalToday: 0, orders: [] },
        'requestId'
      )
    );
    feed = store.getState().feed;
    expect(feed.isLoading).toBe(false);
    expect(feed.total).toBe(0);
    expect(feed.totalToday).toBe(0);
    expect(feed.feeds).toEqual([]);
  });

  test('Тест 4 - обработка состояния rejected для getFeedsThunk', () => {
    store.dispatch(
      getFeedsThunk.rejected({ name: '', message: 'Ошибка' }, 'requestId')
    );
    expect(store.getState().feed.isLoading).toBe(false);
  });

  test('Тест 5 - загрузка заказов с сервера', async () => {
    await store.dispatch(getFeedsThunk());
    const { isLoading, total, totalToday, feeds } = store.getState().feed;
    expect(getFeedsApi).toHaveBeenCalledTimes(1);
    expect(isLoading).toBe(false);
    expect(total).toBe(testOrders.length);
    expect(totalToday).toBe(2);
    expect(feeds).toEqual(testOrders);
  });
});
