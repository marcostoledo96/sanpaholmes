import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VendorUser } from '../types';

interface AuthContextType {
  user: VendorUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Llamar al backend de autenticación
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        
        // Guardar la información del usuario
        setUser({
          username: data.usuario.username,
          role: data.usuario.roles.includes('admin') ? 'admin' : 'vendor',
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  const logout = () => {
    // Limpiar el token y el usuario
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
