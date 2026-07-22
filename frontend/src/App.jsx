
import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/NotificationCenter';
import useRealtimeNotifications from './hooks/useRealtimeNotifications';
import registerSW from './registerServiceWorker';

export default function App() {
  useRealtimeNotifications();

  useEffect(() => {
    registerSW();
  }, []);

  return (
    <NotificationProvider>
      <NotificationCenter />
      <AppRouter />
    </NotificationProvider>
  );
}
