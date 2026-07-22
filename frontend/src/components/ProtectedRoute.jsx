
import React from 'react';
import { Navigate } from 'react-router-dom';
import useRole from '../hooks/useRole';

export default function ProtectedRoute({ children, allow }) {
  const role = useRole();

  if (!allow.includes(role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
}
