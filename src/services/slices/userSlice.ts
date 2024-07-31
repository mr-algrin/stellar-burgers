import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface IUserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
}

const defaultState: IUserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState: defaultState,
  reducers: {
    logout: (state) => {
      state.user = null;
    }
  },
  extraReducers: () => {}
});

export const { logout } = userSlice.actions;

export const userReducer = userSlice.reducer;
