
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Clock, Shield, Users } from 'lucide-react';
import { PoliceButton } from './PoliceButton';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Mejorado con mejor centrado */}
      <div 
        className="relative min-h-[500px] sm:min-h-[700px] flex items-center justify-center px-3"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1626148749358-5b3b3f45b41a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXRlY3RpdmUlMjBtYWduaWZ5aW5nJTIwZ2xhc3N8ZW58MXx8fHwxNzYzMDkwOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85"></div>
        
        <div className="relative z-10 text-center px-3 sm:px-6 max-w-5xl mx-auto w-full">
          {/* Logo con imágenes de trébol */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6 sm:mb-8 mt-8 max-[425px]:mt-16 animate-in fade-in duration-700">
            {/* Trébol izquierdo */}
            <img 
              src="/images/trebol.png" 
              alt="Trébol San Patricio"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse hidden sm:block"
            />
            
            <div className="p-3 sm:p-4 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl sm:rounded-2xl shadow-2xl shadow-[#fbbf24]/50 hover:scale-110 transition-transform duration-300 mb-6 max-[425px]:mb-8">
              <Search className="w-10 h-10 sm:w-16 sm:h-16 text-black" />
            </div>
            
            <h1 className="text-[#fbbf24] tracking-wide drop-shadow-lg text-3xl sm:text-5xl md:text-6xl font-bold">
              SANPAHOLMES
            </h1>
            
            {/* Trébol derecho */}
            <img 
              src="/images/trebol.png" 
              alt="Trébol San Patricio"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse hidden sm:block"
            />
          </div>

          {/* Evidence tag */}
          <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-4 py-2 sm:px-8 sm:py-3 mb-6 sm:mb-10 rounded-xl sm:rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <p className="uppercase tracking-widest font-semibold text-xs sm:text-base">CASE FILE #SH-2025</p>
          </div>

          {/* Main tagline */}
          <h2 className="text-white mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 drop-shadow-lg flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xl sm:text-3xl md:text-4xl">
            <span className="material-icons text-2xl sm:text-4xl">search</span>
            <span className="text-center">Resolvé el caso... y pedí tu comida</span>
            <span className="material-icons text-2xl sm:text-4xl">restaurant_menu</span>
          </h2>

          <p className="text-gray-300 mb-6 sm:mb-10 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 px-2">
            Bienvenido al sistema de pedidos del evento Scout SanpaHolmes. 
            Navegá por nuestro menú de evidencias y realizá tu pedido de forma rápida y sencilla.
          </p>

          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 mt-6 mb-8 max-[425px]:mb-16">
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
      <div className="bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] border-y-2 border-[#fbbf24]/30 py-12 sm:py-16 shadow-xl overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* Información principal */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
            </div>
            <h3 className="text-white mb-3 sm:mb-4 text-xl sm:text-3xl">Evento Scout Oficial 2025</h3>
            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto px-2">
              Organizado por el <span className="text-[#fbbf24] font-semibold">Grupo Scout San Patricio</span>
              {' '}con la{' '}
              <span className="text-[#fbbf24] font-semibold">Comunidad Raider</span> y la{' '}
              <span className="text-[#fbbf24] font-semibold">Tropa Raider</span>
            </p>
          </div>

          {/* Escudos institucionales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {/* Escudo Comunidad Raider */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg hover:scale-105 duration-300">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center mb-3 sm:mb-4">
                <img 
                  src="/images/escudo-comunidad-raider.png" 
                  alt="Comunidad Raider"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-center text-gray-300 font-medium">Comunidad<br/>Raider</p>
            </div>

            {/* Escudo San Patricio (centro) */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/50 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center hover:border-[#fbbf24] transition-all shadow-xl hover:scale-105 duration-300">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center mb-3 sm:mb-4">
                <img 
                  src="/images/escudo-san-patricio.png" 
                  alt="Grupo Scout San Patricio"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className="text-xs sm:text-sm text-center text-[#fbbf24] font-semibold">Grupo Scout<br/>"San Patricio"</p>
            </div>

            {/* Escudo Tropa Raider */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#fbbf24]/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center hover:border-[#fbbf24]/60 transition-all shadow-lg hover:scale-105 duration-300">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center mb-3 sm:mb-4">
                <img 
                  src="/images/escudo-tropa-raider.png" 
                  alt="Tropa Raider"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-center text-gray-300 font-medium">Tropa<br/>Raider</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section - mejor centrado y espaciado */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-16 sm:py-24 overflow-x-hidden">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-[#fbbf24] mb-3 sm:mb-4 text-2xl sm:text-4xl">Sobre el Evento</h2>
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 p-6 sm:p-8 text-center rounded-xl sm:rounded-2xl evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-2 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            </div>
            <h3 className="text-white mb-3 sm:mb-4 group-hover:text-[#fbbf24] transition-colors text-lg sm:text-xl">Pedidos Rápidos</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Sistema optimizado para realizar pedidos de forma rápida y eficiente durante el evento.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 p-6 sm:p-8 text-center rounded-xl sm:rounded-2xl evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-2 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            </div>
            <h3 className="text-white mb-3 sm:mb-4 group-hover:text-[#fbbf24] transition-colors text-lg sm:text-xl">Entrega por Mesa</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Indicá tu número de mesa y te avisaremos cuando tu pedido esté listo.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 p-6 sm:p-8 text-center rounded-xl sm:rounded-2xl evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-2 group sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            </div>
            <h3 className="text-white mb-3 sm:mb-4 group-hover:text-[#fbbf24] transition-colors text-lg sm:text-xl">Pago Seguro</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Pagá en efectivo o por transferencia con comprobante verificado.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action - mejor centrado */}
      <div className="bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] border-t-2 border-b-2 border-[#fbbf24]/30 py-12 sm:py-20 shadow-2xl overflow-x-hidden">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-6">
          <h2 className="text-white mb-4 sm:mb-6 text-2xl sm:text-4xl">¿Listo para resolver tu caso del hambre?</h2>
          <p className="text-gray-300 mb-6 sm:mb-10 text-base sm:text-lg leading-relaxed px-2">
            Explorá nuestro menú completo de merienda y cena
          </p>
          <div className="flex justify-center">
            <PoliceButton
              variant="primary"
              onClick={() => navigate('/menu')}
            >
              Abrir Menú de Evidencias
            </PoliceButton>
          </div>
        </div>
      </div>
    </div>
  );
}