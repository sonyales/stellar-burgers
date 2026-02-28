import type { UnknownAction } from '@reduxjs/toolkit';
import { rootReducer, type RootState } from './store';

import { ingredientsSlice } from './burgerIngredients/slice';
import { burgerConstructorSlice } from './burgerConstructor/slice';
import { createOrderSlice } from './createOrder/slice';
import { publicOrdersSlice } from './publicOrders/slice';
import { userDataSlice } from './userData/slice';
import { passwordRecoverySlice } from './passwordRecovery/slice';
import { userOrdersSlice } from './userOrders/slice';
import { orderByNumberSlice } from './orderInfo/slice';

describe('rootReducer', () => {
  it('инициализирует initialState всех слайсов', () => {
    const state: RootState = rootReducer(undefined, {
      type: '@@INIT'
    } as UnknownAction);

    const expected = {
      [ingredientsSlice.reducerPath]: ingredientsSlice.getInitialState(),
      [burgerConstructorSlice.reducerPath]:
        burgerConstructorSlice.getInitialState(),
      [createOrderSlice.reducerPath]: createOrderSlice.getInitialState(),
      [publicOrdersSlice.reducerPath]: publicOrdersSlice.getInitialState(),
      [userDataSlice.reducerPath]: userDataSlice.getInitialState(),
      [passwordRecoverySlice.reducerPath]:
        passwordRecoverySlice.getInitialState(),
      [userOrdersSlice.reducerPath]: userOrdersSlice.getInitialState(),
      [orderByNumberSlice.reducerPath]: orderByNumberSlice.getInitialState()
    } satisfies RootState;

    expect(state).toEqual(expected);
  });
});
