import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

export default function PageGuard({ role = 'leitura', children }) {
  return (
    <ProtectedRoute>
      <RoleGuard role={role}>
        {children}
      </RoleGuard>
    </ProtectedRoute>
  );
}
