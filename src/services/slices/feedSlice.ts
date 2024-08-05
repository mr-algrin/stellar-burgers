import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

interface IFeedState {
  isLoading: boolean;
  feeds: Array<TOrder>;
  total: number;
  totalToday: number;
}

const defaultState: IFeedState = {
  isLoading: false,
  feeds: [],
  total: 0,
  totalToday: 0
};

export const getFeedsThunk = createAsyncThunk('feed/getAll', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState: defaultState,
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
