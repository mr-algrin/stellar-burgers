import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../../utils/burger-api';

export const createBurgerThunk = createAsyncThunk(
  'burger/create',
  orderBurgerApi
);
