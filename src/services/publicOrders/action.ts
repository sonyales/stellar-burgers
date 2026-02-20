import { getFeedsApi, TFeedsResponse } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getPublicOrders = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: { message: string } }
>('publicOrders/getPublicOrders', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Cannot find public orders'
    });
  }
});
