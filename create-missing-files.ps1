# Encoding: UTF-8
# Script para criar os ficheiros em falta

Write-Host "Criando ficheiros em falta..." -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. Criar src/lib/supabaseClient.ts
# ============================================
$supabaseClientPath = "src/lib/supabaseClient.ts"
$supabaseClientContent = @'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL e ANON KEY nao estao configuradas em .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
'@

if (!(Test-Path "src/lib")) {
    New-Item -ItemType Directory -Path "src/lib" -Force | Out-Null
    Write-Host "Pasta src/lib criada" -ForegroundColor Green
}

$supabaseClientContent | Out-File -FilePath $supabaseClientPath -Encoding UTF8
Write-Host "OK $supabaseClientPath criado" -ForegroundColor Green

# ============================================
# 2. Criar src/auth/ProtectedRoute.tsx
# ============================================
$protectedRoutePath = "src/auth/ProtectedRoute.tsx"
$protectedRouteContent = @'
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
'@

if (!(Test-Path "src/auth")) {
    New-Item -ItemType Directory -Path "src/auth" -Force | Out-Null
    Write-Host "Pasta src/auth criada" -ForegroundColor Green
}

$protectedRouteContent | Out-File -FilePath $protectedRoutePath -Encoding UTF8
Write-Host "OK $protectedRoutePath criado" -ForegroundColor Green

# ============================================
# 3. Criar src/aistudio/context/AIAuthContext.jsx
# ============================================
$authContextPath = "src/aistudio/context/AIAuthContext.jsx"
$authContextContent = @'
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
'@

if (!(Test-Path "src/aistudio/context")) {
    New-Item -ItemType Directory -Path "src/aistudio/context" -Force | Out-Null
    Write-Host "Pasta src/aistudio/context criada" -ForegroundColor Green
}

$authContextContent | Out-File -FilePath $authContextPath -Encoding UTF8
Write-Host "OK $authContextPath criado" -ForegroundColor Green

# ============================================
# RESUMO
# ============================================
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "OK Todos os ficheiros foram criados!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ficheiros criados:" -ForegroundColor Yellow
Write-Host "  1. src/lib/supabaseClient.ts"
Write-Host "  2. src/auth/ProtectedRoute.tsx"
Write-Host "  3. src/aistudio/context/AIAuthContext.jsx"
Write-Host ""
Write-Host "Execute agora: .\deploy-complete.ps1" -ForegroundColor Cyan
Write-Host ""