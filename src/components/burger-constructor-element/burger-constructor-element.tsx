import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import {
  ingredientMoveDown,
  ingredientMoveUp,
  removeIngredient
} from '@slices';

import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => dispatch(ingredientMoveDown(index));

    const handleMoveUp = () => dispatch(ingredientMoveUp(index));

    const handleClose = () => dispatch(removeIngredient(index));

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
