import { forgotPassword, resetPassword } from './action';
import {
  passwordRecoverySlice,
  initialState,
  resetRecoveryState
} from './slice';

import type { TServerResponse } from '@api';

const reducer = passwordRecoverySlice.reducer;
type State = typeof initialState;

describe('passwordRecoverySlice', () => {
  it('resetRecoveryState: сбрасывает состояние к initialState', () => {
    const prevState: State = {
      isLoading: true,
      success: true,
      step: 'resetSuccess',
      error: 'Some error',
      resetAllowed: true
    };

    const nextState = reducer(prevState, resetRecoveryState());

    expect(nextState).toEqual(initialState);
  });

  describe('pending (matcher isAnyOf)', () => {
    it('forgotPassword.pending: isLoading true и error null', () => {
      const prevState: State = { ...initialState, error: 'old error' };

      const action = forgotPassword.pending('req-1', { email: 'a@b.com' });
      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('resetPassword.pending: isLoading true и error null', () => {
      const prevState: State = { ...initialState, error: 'old error' };

      const action = resetPassword.pending('req-2', {
        password: '123',
        token: 'token'
      });
      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('fulfilled: success true, resetAllowed true, step forgotSuccess, isLoading false', () => {
      const prevState: State = { ...initialState, isLoading: true };

      const payload: TServerResponse<{}> = {
        success: true
      } as TServerResponse<{}>;

      const action = forgotPassword.fulfilled(payload, 'req-3', {
        email: 'a@b.com'
      });
      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(false);
      expect(nextState.success).toBe(true);
      expect(nextState.resetAllowed).toBe(true);
      expect(nextState.step).toBe('forgotSuccess');
      expect(nextState.error).toBeNull();
    });

    it('rejected: success false, resetAllowed false, isLoading false, error из payload.message', () => {
      const prevState: State = { ...initialState, isLoading: true };

      const action = forgotPassword.rejected(
        new Error('network'),
        'req-4',
        { email: 'a@b.com' },
        { message: 'Request failed' }
      );

      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(false);
      expect(nextState.success).toBe(false);
      expect(nextState.resetAllowed).toBe(false);
      expect(nextState.error).toBe('Request failed');
      expect(nextState.step).toBe('idle');
    });

    it('rejected: если payload нет, error из action.error.message', () => {
      const prevState: State = { ...initialState, isLoading: true };

      const action = forgotPassword.rejected(new Error('Boom'), 'req-5', {
        email: 'a@b.com'
      });
      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(false);
      expect(nextState.success).toBe(false);
      expect(nextState.resetAllowed).toBe(false);
      expect(nextState.error).toBe('Boom');
    });
  });

  describe('resetPassword', () => {
    it('fulfilled: success true, step resetSuccess, resetAllowed false, isLoading false', () => {
      const prevState: State = {
        ...initialState,
        isLoading: true,
        resetAllowed: true,
        step: 'forgotSuccess'
      };

      const payload: TServerResponse<{}> = {
        success: true
      } as TServerResponse<{}>;

      const action = resetPassword.fulfilled(payload, 'req-6', {
        password: '123',
        token: 'token'
      });

      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(false);
      expect(nextState.success).toBe(true);
      expect(nextState.step).toBe('resetSuccess');
      expect(nextState.resetAllowed).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('rejected: success false, isLoading false, error из payload.message', () => {
      const prevState: State = {
        ...initialState,
        isLoading: true,
        resetAllowed: true
      };

      const action = resetPassword.rejected(
        new Error('network'),
        'req-7',
        { password: '123', token: 'token' },
        { message: 'Cannot reset password' }
      );

      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(false);
      expect(nextState.success).toBe(false);
      expect(nextState.error).toBe('Cannot reset password');

      expect(nextState.resetAllowed).toBe(true);

      expect(nextState.step).toBe('idle');
    });

    it('rejected: если payload нет, error из action.error.message', () => {
      const prevState: State = { ...initialState, isLoading: true };

      const action = resetPassword.rejected(new Error('Boom'), 'req-8', {
        password: '123',
        token: 'token'
      });

      const nextState = reducer(prevState, action);

      expect(nextState.isLoading).toBe(false);
      expect(nextState.success).toBe(false);
      expect(nextState.error).toBe('Boom');
    });
  });
});
