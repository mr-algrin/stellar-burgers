import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';

export const getFeedsThunk = createAsyncThunk('feed/getAll', getFeedsApi);
