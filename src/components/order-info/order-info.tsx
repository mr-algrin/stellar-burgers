import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';

import { useSelector } from '../../services/store';

type TOrderInfoParams = {
  number: string;
};

export const OrderInfo: FC = () => {
  const { number } = useParams<TOrderInfoParams>();
  const { ingredients } = useSelector((state) => state.ingredient);
  // const { feeds } = useSelector((state) => state.feed);
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  useEffect(() => {
    if (number)
      getOrderByNumberApi(parseInt(number))
        .then((res) => res.orders.length > 0 && setOrderData(res.orders[0]))
        .catch();
  }, [number]);

  // const orderData = useMemo(() => {
  //   if (!number) return null;
  //
  //   return feeds.find((f) => f.number === parseInt(number));
  // }, [number, feeds]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
