import React from 'react';
import { Navigate } from 'react-router-dom';
import { canAccess } from './roles';

export default function RoleGuard({ role, children }) {
  if (!canAccess(role)) {
    return <Navigate to='/' replace />;
  }
  return children;
}
