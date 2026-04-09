import { userDataSlice, initialState } from './slice';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser
} from './action';

import type { TUser } from '@utils-types';

const reducer = userDataSlice.reducer;
type State = typeof initialState;

const user: TUser = { email: 'test@mail.com', name: 'Test' };

describe('userDataSlice', () => {
  describe('pending matcher (isAnyOf)', () => {
    it('registerUser.pending: isLoading true и error null', () => {
      const prev: State = { ...initialState, error: 'old error' };

      const action = registerUser.pending('req-1', {
        email: 'a@b.com',
        name: 'A',
        password: '123'
      });

      const next = reducer(prev, action);

      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
    });

    it('getUser.pending: isLoading true и error null', () => {
      const prev: State = { ...initialState, error: 'old error' };

      const action = getUser.pending('req-2', undefined);
      const next = reducer(prev, action);

      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
    });
  });

  describe('rejected matcher (isAnyOf)', () => {
    it('loginUser.rejected: isLoading false, isAuthChecked true, error из payload.message', () => {
      const prev: State = { ...initialState, isLoading: true };

      const action = loginUser.rejected(
        new Error('network'),
        'req-3',
        { email: 'a@b.com', password: '123' },
        { message: 'Cannot login' }
      );

      const next = reducer(prev, action);

      expect(next.isLoading).toBe(false);
      expect(next.isAuthChecked).toBe(true);
      expect(next.error).toBe('Cannot login');
    });

    it('updateUser.rejected: если payload нет, error из action.error.message', () => {
      const prev: State = { ...initialState, isLoading: true };

      const action = updateUser.rejected(new Error('Boom'), 'req-4', {
        name: 'New'
      });
      const next = reducer(prev, action);

      expect(next.isLoading).toBe(false);
      expect(next.isAuthChecked).toBe(true);
      expect(next.error).toBe('Boom');
    });
  });

  describe('fulfilled matcher (isAnyOf) для thunk-ов, возвращающих TUser', () => {
    it('registerUser.fulfilled: записывает user, isAuthChecked true, isLoading false', () => {
      const prev: State = { ...initialState, isLoading: true };

      const action = registerUser.fulfilled(user, 'req-5', {
        email: 'a@b.com',
        name: 'A',
        password: '123'
      });

      const next = reducer(prev, action);

      expect(next.isLoading).toBe(false);
      expect(next.isAuthChecked).toBe(true);
      expect(next.user).toEqual(user);
      expect(next.error).toBeNull();
    });

    it('getUser.fulfilled: записывает user, isAuthChecked true, isLoading false', () => {
      const prev: State = { ...initialState, isLoading: true };

      const action = getUser.fulfilled(user, 'req-6', undefined);
      const next = reducer(prev, action);

      expect(next.isLoading).toBe(false);
      expect(next.isAuthChecked).toBe(true);
      expect(next.user).toEqual(user);
      expect(next.error).toBeNull();
    });
  });

  describe('logoutUser.fulfilled (отдельный addCase)', () => {
    it('сбрасывает user в null, isLoading false, error null', () => {
      const prev: State = {
        user,
        isAuthChecked: true,
        isLoading: true,
        error: 'old error'
      };

      const action = logoutUser.fulfilled(undefined, 'req-7', undefined);
      const next = reducer(prev, action);

      expect(next.user).toBeNull();
      expect(next.isLoading).toBe(false);
      expect(next.error).toBeNull();

      expect(next.isAuthChecked).toBe(true);
    });
  });
});
