import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { loadIngredientsThunk } from './actions';

interface IIngredientState {
  isLoading: boolean;
  ingredients: TIngredient[];
}

const defaultState: IIngredientState = {
  isLoading: false,
  ingredients: []
};

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
