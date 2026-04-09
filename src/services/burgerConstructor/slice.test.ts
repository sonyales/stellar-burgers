import reducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  type BurgerConstructorState
} from './slice';

import type { TIngredient, TConstructorIngredient } from '@utils-types';

const makeIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
  _id: 'ing-1',
  name: 'Test ingredient',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: 'img',
  image_large: 'img_l',
  image_mobile: 'img_m',
  ...overrides
});

const makeConstructorIngredient = (
  ingredientOverrides: Partial<TIngredient>,
  id: string
): TConstructorIngredient => ({
  ...makeIngredient(ingredientOverrides),
  id
});

describe('burgerConstructorSlice reducer', () => {
  it('addIngredient: добавляет ингредиент в начинку и генерирует id', () => {
    const ingredient = makeIngredient({ _id: 'ing-10', name: 'Cutlet' });

    const nextState = reducer(initialState, addIngredient(ingredient));

    expect(nextState.ingredients).toHaveLength(1);

    expect(nextState.ingredients[0]).toEqual(
      expect.objectContaining({
        ...ingredient,
        id: expect.any(String)
      })
    );
  });

  it('removeIngredient: удаляет ингредиент по id', () => {
    const prevState: BurgerConstructorState = {
      bun: null,
      ingredients: [
        makeConstructorIngredient({ _id: 'a', name: 'A' }, 'id-a'),
        makeConstructorIngredient({ _id: 'b', name: 'B' }, 'id-b')
      ]
    };

    const nextState = reducer(prevState, removeIngredient('id-a'));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('id-b');
  });

  it('moveIngredient: меняет порядок ингредиентов в начинке', () => {
    const prevState: BurgerConstructorState = {
      bun: null,
      ingredients: [
        makeConstructorIngredient({ _id: 'a', name: 'A' }, 'id-a'),
        makeConstructorIngredient({ _id: 'b', name: 'B' }, 'id-b'),
        makeConstructorIngredient({ _id: 'c', name: 'C' }, 'id-c')
      ]
    };

    const nextState = reducer(prevState, moveIngredient({ from: 0, to: 2 }));

    expect(nextState.ingredients.map((i) => i.id)).toEqual([
      'id-b',
      'id-c',
      'id-a'
    ]);
  });
});
