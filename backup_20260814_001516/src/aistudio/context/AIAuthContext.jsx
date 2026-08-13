import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AIAuthContext = createContext(null);

export function AIAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setError(error.message);
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setError(null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (email) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    session,
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!session
  };

  return (
    <AIAuthContext.Provider value={value}>
      {children}
    </AIAuthContext.Provider>
  );
}

export function useAIAuth() {
  const context = useContext(AIAuthContext);
  if (!context) {
    throw new Error('useAIAuth deve ser usado dentro de AIAuthProvider');
  }
  return context;
}
