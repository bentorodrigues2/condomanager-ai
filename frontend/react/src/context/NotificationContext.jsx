
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function push(message) {
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
  }

  function remove(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <NotificationContext.Provider value={{ notifications, push, remove }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
