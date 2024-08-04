import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createBurger, initBurger } from '@slices';

import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { burgerConstructor, orderRequest, orderData } = useSelector(
    (state) => state.burger
  );
  const { user } = useSelector((state) => state.user);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!burgerConstructor.bun || orderRequest) return;

    const data = [
      burgerConstructor.bun._id,
      ...burgerConstructor.ingredients.map((i) => i._id)
    ];
    dispatch(createBurger(data));
  };

  const closeOrderModal = () => {
    if (orderRequest) return;

    dispatch(initBurger());
  };

  const price = useMemo(
    () =>
      (burgerConstructor.bun ? burgerConstructor.bun.price * 2 : 0) +
      burgerConstructor.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [burgerConstructor]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={burgerConstructor}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
