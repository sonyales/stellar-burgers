import { createOrder } from './action';
import { createOrderSlice, clearOrderModal, initialState } from './slice';

import type { TOrder } from '@utils-types';
import type { TNewOrderResponse } from '@api';

const reducer = createOrderSlice.reducer;
type State = typeof initialState;

describe('createOrderSlice', () => {
  it('clearOrderModal: сбрасывает orderRequest, orderModalData и error', () => {
    const order = {} as unknown as TOrder;

    const prevState: State = {
      orderRequest: true,
      orderModalData: order,
      error: 'Some error'
    };

    const nextState = reducer(prevState, clearOrderModal());

    expect(nextState).toEqual(initialState);
  });

  it('createOrder.pending: orderRequest становится true и error сбрасывается', () => {
    const prevState: State = { ...initialState, error: 'old error' };

    const action = createOrder.pending('req-1', ['id1', 'id2']);
    const nextState = reducer(prevState, action);

    expect(nextState.orderRequest).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('createOrder.fulfilled: orderRequest становится false, orderModalData = payload.order', () => {
    const order = {} as unknown as TOrder;

    const payload = {
      order,
      name: 'Test order'
    } as unknown as TNewOrderResponse;

    const prevState: State = { ...initialState, orderRequest: true };

    const action = createOrder.fulfilled(payload, 'req-2', ['id1']);
    const nextState = reducer(prevState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toBe(order);
  });

  it('createOrder.rejected: orderRequest становится false и error берётся из payload.message (если есть)', () => {
    const prevState: State = { ...initialState, orderRequest: true };

    const action = createOrder.rejected(
      new Error('network error'),
      'req-3',
      ['id1'],
      { message: 'Order failed' }
    );
    const nextState = reducer(prevState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.error).toBe('Order failed');
  });

  it('createOrder.rejected: если payload нет, error берётся из action.error.message', () => {
    const prevState: State = { ...initialState, orderRequest: true };

    const action = createOrder.rejected(new Error('Boom'), 'req-4', ['id1']);
    const nextState = reducer(prevState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.error).toBe('Boom');
  });
});
