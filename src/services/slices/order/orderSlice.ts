import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

import { getOrdersThunk } from './actions';

interface IOrderState {
  isLoading: boolean;
  orders: Array<TOrder>;
}

const defaultState: IOrderState = {
  orders: [],
  isLoading: false
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrdersThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(getOrdersThunk.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const orderReducer = orderSlice.reducer;
