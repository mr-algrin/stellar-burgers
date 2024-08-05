import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  burgerReducer,
  feedReducer,
  ingredientReducer,
  orderReducer,
  userReducer
} from '@slices';

const rootReducer = {
  burger: burgerReducer,
  user: userReducer,
  ingredient: ingredientReducer,
  feed: feedReducer,
  order: orderReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
