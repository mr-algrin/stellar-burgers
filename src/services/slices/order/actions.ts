import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../../utils/burger-api';

export const getOrdersThunk = createAsyncThunk('order/getAll', getOrdersApi);
