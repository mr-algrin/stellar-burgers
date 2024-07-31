import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

enum IngredientVariant {
  Bun = 'bun',
  Main = 'main',
  Sauce = 'sauce'
}

interface IIngredientState {
  isLoading: boolean;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
}

const defaultState: IIngredientState = {
  isLoading: false,
  buns: [],
  mains: [],
  sauces: []
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
      state.buns = action.payload.filter(
        (i) => i.type === IngredientVariant.Bun
      );
      state.mains = action.payload.filter(
        (i) => i.type === IngredientVariant.Main
      );
      state.sauces = action.payload.filter(
        (i) => i.type === IngredientVariant.Sauce
      );
    });
    builder.addCase(loadIngredientsThunk.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const ingredientReducer = ingredientSlice.reducer;
