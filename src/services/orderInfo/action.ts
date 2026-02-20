import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: { message: string } }
>('orderInfo/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);
    return res.orders?.[0];
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Cannot find order'
    });
  }
});
