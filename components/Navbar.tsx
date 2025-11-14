import React from 'react';
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-2.5 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl shadow-lg group-hover:shadow-[#fbbf24]/50 transition-all duration-300 group-hover:scale-110">
              <Search className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-[#fbbf24] text-2xl tracking-wide group-hover:text-[#fcd34d] transition-colors">SANPAHOLMES</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Detective System</p>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex items-center gap-6">
            {!isVendorPanel && (
              <>
                <button
                  onClick={() => navigate('/menu')}
                  className="text-gray-300 hover:text-[#fbbf24] transition-colors font-medium"
                >
                  Menú
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="relative text-gray-300 hover:text-[#fbbf24] transition-colors group"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {/* Solo mostrar info de usuario en panel de vendedor */}
            {user && isVendorPanel && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#fbbf24] bg-[#1f1f1f] px-4 py-2 rounded-xl border border-[#fbbf24]/30">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-[#ef4444] transition-colors p-2 hover:bg-[#1f1f1f] rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
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