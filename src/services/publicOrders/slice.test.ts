import { getPublicOrders } from './action';
import { publicOrdersSlice, initialState } from './slice';

import type { TOrder } from '@utils-types';
import type { TFeedsResponse } from '@api';

const reducer = publicOrdersSlice.reducer;
type State = typeof initialState;

const makeOrder = (overrides: Partial<TOrder> = {}): TOrder => ({
  _id: 'order-1',
  status: 'done',
  name: 'Test order',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 1,
  ingredients: ['ing-1'],
  ...overrides
});

describe('publicOrdersSlice', () => {
  it('getPublicOrders.pending: isLoading true и error null', () => {
    const prevState: State = { ...initialState, error: 'old error' };

    const action = getPublicOrders.pending('req-1', undefined);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('getPublicOrders.fulfilled: записывает orders и feed, isLoading false', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const payload: TFeedsResponse = {
      orders: [
        makeOrder({ number: 10 }),
        makeOrder({ _id: 'order-2', number: 11 })
      ],
      total: 1234,
      totalToday: 56
    } as TFeedsResponse;

    const action = getPublicOrders.fulfilled(payload, 'req-2', undefined);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.orders).toEqual(payload.orders);
    expect(nextState.feed).toEqual({
      total: payload.total,
      totalToday: payload.totalToday
    });
    expect(nextState.error).toBeNull();
  });

  it('getPublicOrders.rejected: isLoading false и error из payload.message (если есть)', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const action = getPublicOrders.rejected(
      new Error('network'),
      'req-3',
      undefined,
      { message: 'Cannot find public orders' }
    );

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Cannot find public orders');
  });

  it('getPublicOrders.rejected: если payload нет, error из action.error.message', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const action = getPublicOrders.rejected(
      new Error('Boom'),
      'req-4',
      undefined
    );
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Boom');
  });
});
