import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
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

interface IUserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string;
}

const defaultState: IUserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: ''
};

export const getUserThunk = createAsyncThunk('user/get', () => getUserApi());

export const updateUserThunk = createAsyncThunk(
  'user/update',
  (data: Partial<TRegisterData>) => updateUserApi(data)
);

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

export const userSlice = createSlice({
  name: 'user',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateUserThunk.pending, (state) => {
      state.error = '';
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.error = action.error.message || '';
    });

    builder.addCase(registerThunk.pending, (state) => {
      state.error = '';
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.error = action.error.message ?? '';
    });

    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = '';
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? '';
    });

    builder.addCase(getUserThunk.pending, (state) => {
      state.isInit = false;
      state.isLoading = true;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isInit = true;
      state.isLoading = false;
      state.user = action.payload.user;
    });
    builder.addCase(getUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isInit = true;
    });

    builder.addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const userReducer = userSlice.reducer;
