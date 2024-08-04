import React from 'react';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

import { useSelector } from '../services/store';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user, isInit, isLoading } = useSelector((state) => state.user);

  if (!isInit || isLoading) return <Preloader />;

  if (!user) return <Navigate to={'/login'} />;

  return children;
};

export default ProtectedRoute;
