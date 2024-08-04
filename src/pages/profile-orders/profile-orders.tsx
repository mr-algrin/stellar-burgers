import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { getOrdersThunk } from '@slices';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, []);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
