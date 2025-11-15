
import { Search, ShoppingCart, UserCircle, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/vendor/login');
  };

  const isVendorPanel = location.pathname.startsWith('/vendor');

  return (
    <nav className="bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] border-b-2 border-[#fbbf24]/30 sticky top-0 z-50 backdrop-blur-lg shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-4 cursor-pointer group min-w-0 flex-shrink"
            onClick={() => navigate('/')}
          >
            <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <Search className="w-5 h-5 sm:w-7 sm:h-7 text-black" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[#fbbf24] text-base sm:text-2xl tracking-wide group-hover:text-[#fcd34d] transition-colors truncate">SANPAHOLMES</h1>
              <p className="text-[0.5rem] sm:text-xs text-gray-400 uppercase tracking-widest hidden xs:block">Detective System</p>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {!isVendorPanel && (
              <>
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all shadow-lg hover:shadow-[#fbbf24]/50 hover:scale-105"
                >
                  Menú
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="relative bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:from-[#f87171] hover:to-[#ef4444] transition-all shadow-lg hover:shadow-[#ef4444]/50 hover:scale-105 group"
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white text-[#ef4444] text-[0.625rem] sm:text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg font-bold border-2 border-[#ef4444] group-hover:scale-110 transition-transform">
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {/* Solo mostrar info de usuario en panel de vendedor */}
            {user && isVendorPanel && (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#fbbf24] bg-[#1f1f1f] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-[#fbbf24]/30">
                  <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden xs:inline">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-[#ef4444] transition-colors p-1.5 sm:p-2 hover:bg-[#1f1f1f] rounded-lg sm:rounded-xl"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Police tape decoration - más sutil */}
      <div className="h-1.5 bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] police-tape"></div>
    </nav>
  );
}