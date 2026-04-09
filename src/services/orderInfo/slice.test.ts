import { getOrderByNumber } from './action';
import { orderByNumberSlice, clearOrder, initialState } from './slice';

import type { TOrder } from '@utils-types';

const reducer = orderByNumberSlice.reducer;
type State = typeof initialState;

const makeOrder = (overrides: Partial<TOrder> = {}): TOrder => ({
  _id: 'order-1',
  status: 'done',
  name: 'Test order',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 123,
  ingredients: ['ing-1', 'ing-2'],
  ...overrides
});

describe('orderByNumberSlice', () => {
  it('clearOrder: сбрасывает состояние к initialState', () => {
    const prevState: State = {
      order: makeOrder(),
      isLoading: true,
      error: 'Some error'
    };

    const nextState = reducer(prevState, clearOrder());

    expect(nextState).toEqual(initialState);
  });

  it('getOrderByNumber.pending: isLoading true и error сбрасывается', () => {
    const prevState: State = { ...initialState, error: 'old error' };

    const action = getOrderByNumber.pending('req-1', 777);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('getOrderByNumber.fulfilled: isLoading false и order записывается', () => {
    const prevState: State = { ...initialState, isLoading: true };
    const order = makeOrder({ number: 777 });

    const action = getOrderByNumber.fulfilled(order, 'req-2', 777);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.order).toEqual(order);
  });

  it('getOrderByNumber.rejected: isLoading false и error берётся из payload.message (если есть)', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const action = getOrderByNumber.rejected(
      new Error('network error'),
      'req-3',
      777,
      { message: 'Cannot find order' }
    );

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Cannot find order');
  });

  it('getOrderByNumber.rejected: если payload нет, error берётся из action.error.message', () => {
    const prevState: State = { ...initialState, isLoading: true };

    const action = getOrderByNumber.rejected(new Error('Boom'), 'req-4', 777);
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Boom');
  });
});
