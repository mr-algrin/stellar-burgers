import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';

export const getFeedsThunk = createAsyncThunk('feed/getAll', getFeedsApi);
