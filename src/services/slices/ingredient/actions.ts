import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

export const loadIngredientsThunk = createAsyncThunk(
  'ingredient/load',
  getIngredientsApi
);
