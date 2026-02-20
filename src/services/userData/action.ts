import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: { message: string } }
>('userData/registerUser', async (form, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(form);

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);

    return res.user;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Cannot register'
    });
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: { message: string } }
>('userData/loginUser', async (form, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(form);

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);

    return res.user;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Cannot login'
    });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>('userData/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  } catch (error: any) {
    return rejectWithValue({ message: error?.message ?? 'Cannot logout' });
  }
});

export const getUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: { message: string } }
>('userData/getUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Not authorized'
    });
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: { message: string } }
>('userData/updateUser', async (form, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(form);
    return res.user;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message ?? 'Cannot update user'
    });
  }
});
