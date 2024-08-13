import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

export const createBurgerThunk = createAsyncThunk(
  'burger/create',
  orderBurgerApi
);
