import { createAsyncThunk } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi, TServerResponse } from '@api';

export const forgotPassword = createAsyncThunk<
  TServerResponse<{}>,
  { email: string },
  { rejectValue: { message: string } }
>('passwordRecovery/forgotPassword', async (form, { rejectWithValue }) => {
  try {
    return forgotPasswordApi(form);
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Request failed'
    });
  }
});

export const resetPassword = createAsyncThunk<
  TServerResponse<{}>,
  { password: string; token: string },
  { rejectValue: { message: string } }
>('password/reset', async (form, { rejectWithValue }) => {
  try {
    return resetPasswordApi(form);
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Cannot reset password'
    });
  }
});
