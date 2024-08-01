import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../services/store';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useSelector((state) => state.user);

  if (!user) return <Navigate to={'/login'} />;

  return children;
};

export default ProtectedRoute;
