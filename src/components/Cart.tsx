
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PoliceButton } from './PoliceButton';
import { Trash2, Plus, Minus, ShoppingBag, FolderOpen } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="text-center max-w-md mx-auto">
          <div className="p-6 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-3xl inline-block shadow-2xl shadow-[#fbbf24]/50 mb-8">
            <FolderOpen className="w-24 h-24 text-black mx-auto" />
          </div>
          <h2 className="text-white mb-5">Carpeta de Evidencias Vacía</h2>
          <p className="text-gray-400 mb-10 text-lg">No hay productos en tu carrito</p>
          <PoliceButton variant="primary" onClick={() => navigate('/menu')}>
            Ir al Menú
          </PoliceButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-20 overflow-x-hidden">
      {/* Contenedor principal centrado */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* Header - mejor centrado */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-6 py-2 sm:px-8 sm:py-3 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl shadow-xl shadow-[#ef4444]/30">
            <p className="uppercase tracking-widest font-semibold text-xs sm:text-sm">CARPETA DE EVIDENCIAS</p>
          </div>
          <h1 className="text-white mb-3 sm:mb-5 text-2xl sm:text-4xl">Tu Carrito</h1>
          <p className="text-gray-400 text-base sm:text-lg px-2">Revisá tus evidencias antes de confirmar</p>
        </div>

        {/* Cart items - mejor espaciado */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#ef4444]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 evidence-card hover:border-[#ef4444]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#ef4444]/20"
            >
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                {/* Image */}
                <div className="w-full md:w-32 sm:md:w-40 h-32 sm:h-40 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 group">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white mb-1 text-base sm:text-xl truncate">{item.product.name}</h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#ef4444] hover:text-[#f87171] transition-colors p-2 hover:bg-[#ef4444]/10 rounded-xl flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-10 h-10 bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white rounded-xl flex items-center justify-center hover:from-[#f87171] hover:to-[#ef4444] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#ef4444]/30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white w-12 sm:w-16 text-center text-lg sm:text-xl font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-10 h-10 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black rounded-xl flex items-center justify-center hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#fbbf24]/30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-left md:text-right">
                      <p className="text-gray-400 text-sm mb-1">
                        ${item.product.price} x {item.quantity}
                      </p>
                      <p className="text-[#fbbf24] text-xl sm:text-2xl font-semibold break-all">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total - mejor centrado y responsive */}
        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24]/50 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl shadow-[#fbbf24]/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-5">
            <h3 className="text-white text-lg sm:text-xl text-center sm:text-left">Total de Evidencias:</h3>
            <p className="text-[#fbbf24] text-3xl sm:text-4xl font-semibold break-all text-center sm:text-right">${getTotal()}</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mb-5"></div>
          <p className="text-gray-400 text-sm text-center">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} productos en total
          </p>
        </div>

        {/* Actions - mejor espaciado */}
        <div className="flex flex-col md:flex-row gap-5 max-w-2xl mx-auto">
          <PoliceButton
            variant="secondary"
            onClick={() => navigate('/menu')}
            className="flex-1"
          >
            Seguir Investigando
          </PoliceButton>
          <PoliceButton
            variant="primary"
            icon={ShoppingBag}
            onClick={() => navigate('/checkout')}
            className="flex-1"
          >
            Confirmar Pedido
          </PoliceButton>
        </div>
      </div>
    </div>
  );
}