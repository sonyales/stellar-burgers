import { orderBurgerApi, TNewOrderResponse } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: { message: string } }
>('order/createOrder', async (orderData: string[], { rejectWithValue }) => {
  try {
    return await orderBurgerApi(orderData);
  } catch (error: any) {
    return rejectWithValue({ message: error?.message ?? 'Order failed' });
  }
});
