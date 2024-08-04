import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

export type BurgerConstructor = {
  bun: TIngredient | null;
  ingredients: Array<TIngredient>;
};

interface IBurgerState {
  burgerConstructor: BurgerConstructor;
  orderRequest: boolean;
  orderData: TOrder | null;
}

const defaultState: IBurgerState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderData: null
};

export const createBurgerThunk = createAsyncThunk(
  'burger/create',
  orderBurgerApi
);

export const burgerSlice = createSlice({
  name: 'burger',
  initialState: defaultState,
  reducers: {
    initBurger: (state) => {
      state.burgerConstructor = { bun: null, ingredients: [] };
      state.orderData = null;
      state.orderRequest = false;
    },
    addBurgerBun: (state, action: PayloadAction<TIngredient>) => {
      state.burgerConstructor.bun = action.payload;
    },
    addBurgerIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.burgerConstructor.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.burgerConstructor.ingredients.length) {
        state.burgerConstructor.ingredients.splice(index, 1);
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
  addBurgerIngredient,
  removeIngredient,
  addBurgerBun
} = burgerSlice.actions;

export const burgerReducer = burgerSlice.reducer;
