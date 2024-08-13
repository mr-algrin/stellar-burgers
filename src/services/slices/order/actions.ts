import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';

export const getOrdersThunk = createAsyncThunk('order/getAll', getOrdersApi);
