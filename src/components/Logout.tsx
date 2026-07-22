import React from 'react';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  );
}
