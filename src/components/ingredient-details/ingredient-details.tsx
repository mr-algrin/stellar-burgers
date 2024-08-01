import { FC, useMemo } from 'react';
import { IngredientDetailsUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

type TIngredientDetailsParams = {
  id: string;
};

export const IngredientDetails: FC = () => {
  const { id } = useParams<TIngredientDetailsParams>();
  const { isLoading, ingredients } = useSelector((state) => state.ingredient);

  const ingredientData = useMemo(
    () => ingredients.find((i) => i._id === id),
    [ingredients, id]
  );

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
