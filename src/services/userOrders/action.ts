import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const getUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: { message: string } }
>('userOrders/getuserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Request failed'
    });
  }
});
