import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsThunk } from './actions';

export interface IFeedState {
  isLoading: boolean;
  feeds: Array<TOrder>;
  total: number;
  totalToday: number;
}

export const feedInitialState: IFeedState = {
  isLoading: false,
  feeds: [],
  total: 0,
  totalToday: 0
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState: feedInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeedsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedsThunk.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.feeds = [...action.payload.orders];
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      } else {
        state.feeds = [];
        state.total = 0;
        state.totalToday = 0;
      }
      state.isLoading = false;
    });
    builder.addCase(getFeedsThunk.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const feedReducer = feedSlice.reducer;
