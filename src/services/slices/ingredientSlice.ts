import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IIngredientState {
  isLoading: boolean;
  ingredients: TIngredient[];
}

const defaultState: IIngredientState = {
  isLoading: false,
  ingredients: []
};

export const loadIngredientsThunk = createAsyncThunk('ingredient/load', () =>
  getIngredientsApi()
);

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadIngredientsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadIngredientsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
    builder.addCase(loadIngredientsThunk.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const ingredientReducer = ingredientSlice.reducer;
