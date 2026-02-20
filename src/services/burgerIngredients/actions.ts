import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: { message: string } }
>('burgerIngredients/getIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error: any) {
    return rejectWithValue({ message: error?.message ?? 'Request failed' });
  }
});
