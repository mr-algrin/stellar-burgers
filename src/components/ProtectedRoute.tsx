import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

import { useSelector } from '../services/store';

const ProtectedRoute = ({
  children,
  anonymous = false
}: React.PropsWithChildren<{ anonymous?: boolean }>) => {
  const { user, isInit, isLoading } = useSelector((state) => state.user);

  const location = useLocation();
  const from = location.state?.from || '/';

  if (!isInit || isLoading) return <Preloader />;

  if (anonymous && user) return <Navigate to={from} />;

  if (!anonymous && !user)
    return <Navigate to='/login' state={{ from: location }} />;

  return children;
};

export default ProtectedRoute;
