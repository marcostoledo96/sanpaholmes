
import { Fingerprint, Users, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] border-t-2 border-[#fbbf24]/30 mt-20">
      {/* Información institucional destacada - Mejorado */}
      <div className="border-b border-[#fbbf24]/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logos institucionales */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Trébol izquierdo */}
              <img 
                src="/images/trebol.png" 
                alt="Trébol San Patricio"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain animate-pulse"
              />
              
              {/* Icono principal */}
              <div className="inline-block p-3 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-black" />
              </div>
              
              {/* Trébol derecho */}
              <img 
                src="/images/trebol.png" 
                alt="Trébol San Patricio"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain animate-pulse"
              />
            </div>
            
            <h3 className="text-white mb-4 drop-shadow-lg">Evento Scout Oficial 2025</h3>
            <p className="text-gray-300 text-base leading-relaxed mb-2">
              Organizado por el <span className="text-[#fbbf24] font-semibold">Grupo Scout San Patricio</span>
            </p>
            <p className="text-gray-400 text-sm">
              En colaboración con la{' '}
              <span className="text-[#fbbf24] font-semibold">Comunidad Raider</span> y la{' '}
              <span className="text-[#fbbf24] font-semibold">Tropa Raider</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer principal - Mejor estructura y centrado */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Columna 1: Branding mejorado */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Fingerprint className="w-7 h-7 text-black" />
              </div>
              <div>
                <p className="text-[#fbbf24] tracking-wide font-semibold text-lg">SANPAHOLMES</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Detective System</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sistema de pedidos oficial del evento Scout SanpaHolmes 2025
            </p>
          </div>

          {/* Columna 2: Información de contacto */}
          <div className="text-center">
            <h4 className="text-white mb-4 font-semibold">Información</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-[#fbbf24]" />
                <span>Sede Grupo Scout San Patricio</span>
              </div>
              <a 
                href="/vendor/login" 
                className="flex items-center justify-center gap-2 hover:text-[#fbbf24] transition-colors cursor-pointer"
              >
                <span className="material-icons text-base">admin_panel_settings</span>
                <span>Panel de Administración</span>
              </a>
            </div>
          </div>

          {/* Columna 3: Case Status */}
          <div className="text-center md:text-right">
            <div className="inline-block bg-[#1f1f1f] px-6 py-4 rounded-2xl border-2 border-[#fbbf24]/30 shadow-lg">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Case File</p>
              <p className="text-[#fbbf24] font-semibold mb-1">#SH-2025</p>
              <div className="flex items-center justify-center md:justify-end gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-400 uppercase font-semibold">Status: Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#fbbf24]/30 to-transparent my-8"></div>

        {/* Bottom row - créditos */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="text-center md:text-left">
            © 2025 SanpaHolmes - Todos los derechos reservados
          </p>
          <div className="flex items-center gap-2">
            <span className="material-icons text-sm">assignment_turned_in</span>
            <p>Casos registrados:</p>
            <span className="text-[#fbbf24] font-semibold">100% Resueltos</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24]"></div>
    </footer>
  );
}