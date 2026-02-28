import { getUserOrders } from './action';
import { userOrdersSlice, initialState } from './slice';

import type { TOrder } from '@utils-types';

const reducer = userOrdersSlice.reducer;
type State = typeof initialState;

const makeOrder = (overrides: Partial<TOrder> = {}): TOrder => ({
  _id: 'order-1',
  status: 'done',
  name: 'Test order',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 1,
  ingredients: ['ing-1', 'ing-2'],
  ...overrides
});

describe('userOrdersSlice', () => {
  it('resetUserOrders: сбрасывает состояние к initialState', () => {
    const { resetUserOrders } = userOrdersSlice.actions;

    const prevState: State = {
      orders: [makeOrder()],
      isLoading: true,
      error: 'Some error'
    };

    const nextState = reducer(prevState, resetUserOrders());

    expect(nextState).toEqual(initialState);
  });

  it('getUserOrders.pending: isLoading true и error null', () => {
    const prevState: State = { ...initialState, error: 'old error' };

    const action = getUserOrders.pending('req-1', undefined);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('getUserOrders.fulfilled: isLoading false и orders записывается', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const payload: TOrder[] = [
      makeOrder({ number: 10 }),
      makeOrder({ _id: 'order-2', number: 11 })
    ];

    const action = getUserOrders.fulfilled(payload, 'req-2', undefined);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.orders).toEqual(payload);
    expect(nextState.error).toBeNull();
  });

  it('getUserOrders.rejected: isLoading false и error из payload.message (если есть)', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const action = getUserOrders.rejected(
      new Error('network'),
      'req-3',
      undefined,
      { message: 'Request failed' }
    );

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Request failed');
  });

  it('getUserOrders.rejected: если payload нет, error из action.error.message', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const action = getUserOrders.rejected(
      new Error('Boom'),
      'req-4',
      undefined
    );
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Boom');
  });
});
