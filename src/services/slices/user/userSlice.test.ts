import { describe, test, jest, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import { userInitialState, userReducer } from './userSlice';
import {
  loginThunk,
  registerThunk,
  updateUserThunk,
  getUserThunk,
  logoutThunk
} from './actions';

import { TUser } from '../../../utils/types';
import {
  loginUserApi, logoutApi,
  registerUserApi,
  TAuthResponse,
  TRegisterData
} from '../../../utils/burger-api';

const initStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

let store = initStore();

const testRegisterData: TRegisterData = {
  email: 'test@test.ru',
  name: 'User',
  password: 'password'
};

const testAuthData = {
  email: testRegisterData.email,
  password: testRegisterData.password
};

const testUser: TUser = {
  name: testRegisterData.name,
  email: testRegisterData.email
};

const testAuthResponse: TAuthResponse = {
  success: true,
  user: testUser,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};

beforeEach(() => {
  store = initStore();
});

jest.mock('../../../utils/burger-api');
(
  registerUserApi as jest.MockedFunction<typeof registerUserApi>
).mockImplementation(() => Promise.resolve(testAuthResponse));

(loginUserApi as jest.MockedFunction<typeof loginUserApi>).mockImplementation(
  () => Promise.resolve(testAuthResponse)
);

(logoutApi as jest.MockedFunction<typeof logoutApi>).mockImplementation(() =>
  Promise.resolve({ success: true })
);

describe('Тест user slice', () => {
  test('Тест 1 - начальное состояние', () => {
    expect(store.getState().user).toEqual(userInitialState);
  });

  test('Тест 2 - проверка состояния pending для registerThunk', () => {
    store.dispatch(registerThunk.pending('requestId', testRegisterData));
    expect(store.getState().user.error).toBe('');
  });

  test('Тест 3 - проверка состояния fulfilled для registerThunk', () => {
    store.dispatch(
      registerThunk.fulfilled(testAuthResponse, 'requestId', testRegisterData)
    );
    expect(store.getState().user.user).toEqual(testUser);
  });

  test('Тест 4 - проверка состояни rejected для registerThunk', () => {
    const message = 'Wrong email or password';
    store.dispatch(
      registerThunk.rejected(
        { name: 'test', message: message },
        'requestId',
        testRegisterData
      )
    );
    expect(store.getState().user.error).toBe(message);
    store.dispatch(
      registerThunk.rejected(
        { name: 'test', message: undefined } as any,
        'requestId',
        testRegisterData
      )
    );
    expect(store.getState().user.error).toBe('');
  });

  test('Тест 5 - проверка состояния pending для updateUserThunk', () => {
    store.dispatch(updateUserThunk.pending('requestId', testRegisterData));
    expect(store.getState().user.error).toBe('');
  });

  test('Тест 6 - проверка состояния fulfilled для updateUserThunk', () => {
    store.dispatch(
      updateUserThunk.fulfilled(
        { user: testUser, success: true },
        'requestId',
        testRegisterData
      )
    );
    expect(store.getState().user.user).toEqual(testUser);
    expect(store.getState().user.error).toBe('');
  });

  test('Тест 7 - проверка состояния rejected для updateUserThunk', () => {
    const message = 'Ошибка обновления';
    store.dispatch(
      updateUserThunk.rejected(
        { name: '', message: message },
        'requestId',
        testRegisterData
      )
    );
    expect(store.getState().user.error).toBe(message);
    store.dispatch(
      updateUserThunk.rejected(
        { name: '', message: '' },
        'requestId',
        testRegisterData
      )
    );
    expect(store.getState().user.error).toBe('');
  });

  test('Тест 8 - проверка состояния pending для loginThunk', () => {
    store.dispatch(loginThunk.pending('requestId', testAuthData));
    const { isLoading, error } = store.getState().user;
    expect(isLoading).toBe(true);
    expect(error).toBe('');
  });

  test('Тест 9 - проверка состояния fulfilled для loginThunk', () => {
    store.dispatch(
      loginThunk.fulfilled(testAuthResponse, 'requestId', testAuthData)
    );
    const { isInit, isLoading, user } = store.getState().user;
    expect(user).toEqual(testUser);
    expect(isLoading).toBe(false);
    expect(isInit).toBe(true);
  });

  test('Тест 10 - проверка состояния rejected для loginThunk', () => {
    const message = 'Ошибка авторизации';
    store.dispatch(
      loginThunk.rejected(
        { name: '', message: message },
        'requestId',
        testAuthData
      )
    );
    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.error).toBe(message);

    store.dispatch(
      loginThunk.rejected(
        { name: '', message: undefined } as any,
        'requestId',
        testAuthData
      )
    );
    expect(store.getState().user.error).toBe('');
  });

  test('Тест 11 - проверка состояния pending для getUserThunk', () => {
    store.dispatch(getUserThunk.pending('requestId'));
    const { isInit, isLoading } = store.getState().user;
    expect(isInit).toBe(false);
    expect(isLoading).toBe(true);
  });

  test('Тест 12 - проверка состояния fulfilled для getUserThunk', () => {
    store.dispatch(getUserThunk.fulfilled(testAuthResponse, 'requestId'));
    const { isInit, isLoading, user } = store.getState().user;
    expect(isInit).toBe(true);
    expect(isLoading).toBe(false);
    expect(user).toEqual(testUser);
  });

  test('Тест 13 - проверка состояния rejected для getUserThunk', () => {
    const message = 'Error loading user';
    store.dispatch(
      getUserThunk.rejected({ name: '', message: message }, 'requestId')
    );
    const { isInit, isLoading } = store.getState().user;
    expect(isInit).toBe(true);
    expect(isLoading).toBe(false);
  });

  test('Тест 14 - проверка состояния pending для logoutThunk', () => {
    store.dispatch(logoutThunk.pending('requestId'));
    expect(store.getState().user.isLoading).toBe(true);
  });

  test('Тест 15 - проверка состояния fulfilled для logoutThunk', () => {
    store.dispatch(logoutThunk.fulfilled(undefined, 'requestId'));
    const { isLoading, user } = store.getState().user;
    expect(user).toBe(null);
    expect(isLoading).toBe(false);
  });

  test('Тест 16 - проверка состояния rejected для logoutThunk', () => {
    store.dispatch(
      logoutThunk.rejected({ name: '', message: '' }, 'requestId')
    );
    expect(store.getState().user.isLoading).toBe(false);
  });

  test('Тест 17 - регистрация пользователя через API', async () => {
    await store.dispatch(registerThunk(testRegisterData));
    const { user } = store.getState().user;
    expect(user).toEqual(testUser);
    expect(registerUserApi).toHaveBeenCalledTimes(1);
    expect(registerUserApi).toHaveBeenCalledWith(testRegisterData);
  });

  test('Тест 18 - авторизация пользователя через API', async () => {
    await store.dispatch(loginThunk(testAuthData));
    const { user } = store.getState().user;
    expect(user).toEqual(testUser);
    expect(loginUserApi).toHaveBeenCalledTimes(1);
    expect(loginUserApi).toHaveBeenCalledWith(testAuthData);
  });

  test('Тест 19 - авторизация и разлогирование пользователя', async () => {
    await store.dispatch(loginThunk(testAuthData));
    // Авторизация пользователя
    expect(store.getState().user.user).toEqual(testUser);
    expect(loginUserApi).toHaveBeenCalledTimes(2);
    expect(loginUserApi).toHaveBeenCalledWith(testAuthData);

    // Разлогирование пользователя
    await store.dispatch(logoutThunk());
    expect(store.getState().user.user).toEqual(null);
    expect(store.getState().user.isLoading).toBe(false);
    expect(logoutApi).toHaveBeenCalledTimes(1);
  });
});
