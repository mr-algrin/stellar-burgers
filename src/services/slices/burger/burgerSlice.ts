import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';
import uuid4 from 'uuid4';

import { createBurgerThunk } from './actions';
import store from '../../store';

export type BurgerConstructor = {
  bun: TIngredient | null;
  ingredients: Array<TIngredient>;
};

export interface IBurgerState {
  burgerConstructor: BurgerConstructor;
  orderRequest: boolean;
  orderData: TOrder | null;
}

export const burgerInitialState: IBurgerState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderData: null
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState: burgerInitialState,
  reducers: {
    initBurger: (state) => {
      state.burgerConstructor = { bun: null, ingredients: [] };
      state.orderData = null;
      state.orderRequest = false;
    },
    addBurgerBun: (state, action: PayloadAction<TIngredient>) => {
      state.burgerConstructor.bun = action.payload;
    },
    addBurgerIngredient: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        state.burgerConstructor.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid4() }
      })
    },
    removeIngredient: (
      { burgerConstructor },
      action: PayloadAction<number>
    ) => {
      const index = action.payload;
      if (index >= 0 && index < burgerConstructor.ingredients.length) {
        burgerConstructor.ingredients = [
          ...burgerConstructor.ingredients.slice(0, index),
          ...burgerConstructor.ingredients.slice(index + 1)
        ];
      }
    },
    ingredientMoveUp: (
      { burgerConstructor },
      action: PayloadAction<number>
    ) => {
      const index = action.payload;
      if (index > 0 && index < burgerConstructor.ingredients.length) {
        const ingredient = { ...burgerConstructor.ingredients[index - 1] };
        burgerConstructor.ingredients[index - 1] = {
          ...burgerConstructor.ingredients[index]
        };
        burgerConstructor.ingredients[index] = ingredient;
      }
    },
    ingredientMoveDown: (
      { burgerConstructor },
      action: PayloadAction<number>
    ) => {
      const index = action.payload;

      if (index >= 0 && index < burgerConstructor.ingredients.length - 1) {
        const ingredient = { ...burgerConstructor.ingredients[index + 1] };
        burgerConstructor.ingredients[index + 1] = {
          ...burgerConstructor.ingredients[index]
        };
        burgerConstructor.ingredients[index] = ingredient;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createBurgerThunk.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(createBurgerThunk.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderData = action.payload.order;
    });
    builder.addCase(createBurgerThunk.rejected, (state) => {
      state.orderRequest = false;
    });
  }
});

export const {
  initBurger,
  addBurgerBun,
  addBurgerIngredient,
  removeIngredient,
  ingredientMoveUp,
  ingredientMoveDown
} = burgerSlice.actions;

export const burgerReducer = burgerSlice.reducer;
