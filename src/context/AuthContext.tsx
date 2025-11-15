import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VendorUser } from '../types';
import { getApiUrl } from '../config/api';

interface AuthContextType {
  user: VendorUser | null;
  loading: boolean;
  login: (username: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al cargar
  useEffect(() => {
    console.log('AuthContext: Iniciando restauración de sesión...');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('AuthContext: Token encontrado:', !!token);
    console.log('AuthContext: User encontrado:', !!savedUser);
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('AuthContext: Usuario restaurado:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('AuthContext: No hay sesión guardada');
    }
    
    setLoading(false);
    console.log('AuthContext: Restauración completada');
  }, []);

  const login = async (username: string, password: string, remember: boolean = true): Promise<boolean> => {
    console.log('AuthContext: Intentando login, remember:', remember);
    try {
      // Llamar al backend de autenticación
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Guardar la información del usuario
        const userData = {
          username: data.usuario.username,
          role: (data.usuario.roles.includes('admin') ? 'admin' : 'vendor') as 'vendor',
        };
        
        setUser(userData);
        
        // Solo guardar en localStorage si el usuario quiere recordar
        if (remember) {
          console.log('AuthContext: Guardando sesión en localStorage');
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.log('AuthContext: No guardando sesión (remember=false)');
          // Limpiar cualquier sesión previa
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        
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
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
