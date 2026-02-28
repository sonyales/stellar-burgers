import reducer, { initialState } from './slice';
import { getIngredients } from './actions';
import type { TIngredient } from '@utils-types';

const ingredientList: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 50,
    image: 'img',
    image_large: 'img_l',
    image_mobile: 'img_m'
  }
];

describe('ingredientsSlice extraReducers', () => {
  it('pending: isLoading становится true и error сбрасывается', () => {
    const prev = { ...initialState, error: 'old error' };

    const action = getIngredients.pending('req-1', undefined);
    const next = reducer(prev, action);

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('fulfilled: данные записываются в ingredients и isLoading становится false', () => {
    const prev = { ...initialState, isLoading: true };

    const action = getIngredients.fulfilled(ingredientList, 'req-2', undefined);
    const next = reducer(prev, action);

    expect(next.isLoading).toBe(false);
    expect(next.ingredients).toEqual(ingredientList);
  });

  it('rejected: error записывается и isLoading становится false', () => {
    const prev = { ...initialState, isLoading: true };

    const action = getIngredients.rejected(
      new Error('network'),
      'req-3',
      undefined,
      { message: 'Request failed' }
    );

    const next = reducer(prev, action);

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe('Request failed');
  });
});
