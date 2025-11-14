import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Clock, Shield, Users, ImageIcon } from 'lucide-react';
import { PoliceButton } from './PoliceButton';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Mejorado con mejor centrado */}
      <div 
        className="relative min-h-[700px] flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1626148749358-5b3b3f45b41a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXRlY3RpdmUlMjBtYWduaWZ5aW5nJTIwZ2xhc3N8ZW58MXx8fHwxNzYzMDkwOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Logo mejorado con placeholder para escudo del grupo */}
          <div className="flex items-center justify-center gap-5 mb-8 animate-in fade-in duration-700">
            {/* Placeholder para Escudo del Grupo San Patricio */}
            <div className="logo-placeholder-large animate-pulse">
              <ImageIcon className="w-10 h-10 text-[#fbbf24] opacity-50" />
            </div>
            
            <div className="p-4 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl shadow-2xl shadow-[#fbbf24]/50 hover:scale-110 transition-transform duration-300">
              <Search className="w-16 h-16 text-black" />
            </div>
            
            <h1 className="text-[#fbbf24] tracking-wide drop-shadow-lg">
              SANPAHOLMES
            </h1>
          </div>

          {/* Evidence tag */}
          <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-8 py-3 mb-10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <p className="uppercase tracking-widest font-semibold">CASE FILE #SH-2024</p>
          </div>

          {/* Main tagline */}
          <h2 className="text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 drop-shadow-lg">
            Resolvé el caso... y pedí tu comida 🕵️‍♂️🔎
          </h2>

          <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            Bienvenido al sistema de pedidos del evento Scout SanpaHolmes. 
            Navegá por nuestro menú de evidencias y realizá tu pedido de forma rápida y sencilla.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <PoliceButton
              variant="primary"
              icon={ShoppingBag}
              onClick={() => navigate('/menu')}
            >
              Ver Menú y Hacer Pedido
            </PoliceButton>
          </div>
        </div>

        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] police-tape"></div>
      </div>

      {/* Banner institucional con placeholders de imágenes */}
      <div className="bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] border-y-2 border-[#fbbf24]/30 py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Información principal */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl shadow-lg mb-6">
              <Users className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-white mb-4">Evento Scout Oficial 2024</h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              Organizado por el <span className="text-[#fbbf24] font-semibold">Grupo Scout San Patricio</span>
              {' '}con la{' '}
              <span className="text-[#fbbf24] font-semibold">Comunidad Raider</span> y la{' '}
              <span className="text-[#fbbf24] font-semibold">Tropa Raider</span>
            </p>
          </div>

          {/* Placeholders para imágenes institucionales */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {/* Escudo Grupo Scout San Patricio */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg">
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-xl flex items-center justify-center mb-3 border border-[#fbbf24]/20">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xs text-center text-gray-400 leading-tight">Escudo<br/>San Patricio</p>
            </div>

            {/* Símbolo Comunidad Raider */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg">
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-xl flex items-center justify-center mb-3 border border-[#fbbf24]/20">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xs text-center text-gray-400 leading-tight">Comunidad<br/>Raider</p>
            </div>

            {/* Símbolo Tropa Raider */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg">
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-xl flex items-center justify-center mb-3 border border-[#fbbf24]/20">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xs text-center text-gray-400 leading-tight">Tropa<br/>Raider</p>
            </div>

            {/* Emblema Raiders */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg">
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-xl flex items-center justify-center mb-3 border border-[#fbbf24]/20">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xs text-center text-gray-400 leading-tight">Emblema<br/>Raiders</p>
            </div>

            {/* Tréboles San Patricio */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg">
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-xl flex items-center justify-center mb-3 border border-[#fbbf24]/20">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xs text-center text-gray-400 leading-tight">Tréboles<br/>San Patricio</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section - mejor centrado y espaciado */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-[#fbbf24] mb-4">Sobre el Evento</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 p-8 text-center rounded-2xl evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <ShoppingBag className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-white mb-4 group-hover:text-[#fbbf24] transition-colors">Pedidos Rápidos</h3>
            <p className="text-gray-400 leading-relaxed">
              Sistema optimizado para realizar pedidos de forma rápida y eficiente durante el evento.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 p-8 text-center rounded-2xl evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <Clock className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-white mb-4 group-hover:text-[#fbbf24] transition-colors">Entrega por Mesa</h3>
            <p className="text-gray-400 leading-relaxed">
              Indicá tu número de mesa y recibí tu pedido directamente en tu ubicación.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 p-8 text-center rounded-2xl evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-white mb-4 group-hover:text-[#fbbf24] transition-colors">Pago Seguro</h3>
            <p className="text-gray-400 leading-relaxed">
              Pagá en efectivo o por transferencia con comprobante verificado.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action - mejor centrado */}
      <div className="bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] border-t-2 border-b-2 border-[#fbbf24]/30 py-20 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-white mb-6">¿Listo para resolver tu caso del hambre?</h2>
          <p className="text-gray-300 mb-10 text-lg leading-relaxed">
            Explorá nuestro menú completo de merienda y cena
          </p>
          <PoliceButton
            variant="primary"
            onClick={() => navigate('/menu')}
          >
            Abrir Menú de Evidencias
          </PoliceButton>
        </div>
      </div>
    </div>
  );
}