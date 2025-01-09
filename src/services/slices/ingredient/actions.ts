import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';

export const loadIngredientsThunk = createAsyncThunk(
  'ingredient/load',
  getIngredientsApi
);
