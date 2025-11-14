import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PoliceButton } from './PoliceButton';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Shield, UserCircle, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function VendorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(username, password);
    
    if (success) {
      toast.success('Acceso autorizado', {
        description: 'Bienvenido al panel de control',
      });
      navigate('/vendor/panel');
    } else {
      toast.error('Acceso denegado', {
        description: 'Credenciales incorrectas',
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-16"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1590978935631-65884b20570c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmltZSUyMHNjZW5lJTIwdGFwZSUyMHllbGxvd3xlbnwxfHx8fDE3NjMwOTA5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/85"></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-5 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-3xl mb-6 shadow-2xl shadow-[#ef4444]/50">
            <Shield className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-white mb-3">Panel de Vendedores</h1>
          <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-6 py-2 rounded-xl shadow-lg">
            <p className="uppercase tracking-wider font-semibold text-sm">ACCESO RESTRINGIDO</p>
          </div>
        </div>

        {/* Login form */}
        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24]/30 rounded-3xl p-10 paper-texture shadow-2xl shadow-[#fbbf24]/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Label htmlFor="username" className="text-gray-300 flex items-center gap-2 mb-3">
                <UserCircle className="w-5 h-5 text-[#fbbf24]" />
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0f0f0f] border-[#fbbf24]/30 text-white focus:border-[#fbbf24] rounded-xl h-12"
                placeholder="Ingresá tu usuario"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-[#fbbf24]" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0f0f0f] border-[#fbbf24]/30 text-white focus:border-[#fbbf24] rounded-xl h-12"
                placeholder="Ingresá tu contraseña"
                required
              />
            </div>

            <PoliceButton
              type="submit"
              variant="primary"
              className="w-full"
            >
              Ingresar al Panel
            </PoliceButton>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 p-5 bg-[#0f0f0f] border border-[#fbbf24]/20 rounded-2xl text-center">
            <p className="text-xs text-gray-400 mb-2">Credenciales de demo:</p>
            <p className="text-sm text-[#fbbf24] font-medium">Usuario: admin | Contraseña: sanpa2024</p>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-[#fbbf24] text-sm transition-colors px-4 py-2 hover:bg-[#1f1f1f] rounded-xl"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}