import React, { createContext, useContext, useState, useEffect } from "react";
import { login, logout, getCurrentUser, getToken } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [token, setToken] = useState(getToken());

  const signIn = async (email, password) => {
    const logged = await login(email, password);
    setUser(logged);
    setToken(getToken());
  };

  const signOut = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}








