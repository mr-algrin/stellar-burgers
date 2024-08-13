import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  clearSession,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  saveSession,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

export const updateUserThunk = createAsyncThunk('user/update', updateUserApi);

export const registerThunk = createAsyncThunk(
  'user/register',
  (data: TRegisterData) =>
    registerUserApi(data).then((res) => {
      saveSession(res);
      return res;
    })
);

export const loginThunk = createAsyncThunk('user/login', (data: TLoginData) =>
  loginUserApi(data).then((res) => {
    saveSession(res);
    return res;
  })
);

export const logoutThunk = createAsyncThunk('user/logout', () =>
  logoutApi().then(() => {
    clearSession();
  })
);
