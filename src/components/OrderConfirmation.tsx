import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoliceButton } from './PoliceButton';
import { CheckCircle2, FolderCheck, Home, ShoppingBag } from 'lucide-react';

export function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('lastOrder');
    if (data) {
      setOrderData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      {/* Contenedor principal centrado */}
      <div className="max-w-4xl w-full mx-auto px-6">
        {/* Success card */}
        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24]/50 rounded-3xl overflow-hidden shadow-2xl shadow-[#fbbf24]/30">
          {/* Header stamp */}
          <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black p-6 text-center">
            <div className="inline-block border-2 border-black px-8 py-3 rounded-xl bg-white shadow-lg">
              <p className="uppercase tracking-widest font-bold">CASE CLOSED</p>
            </div>
          </div>

          <div className="p-10 md:p-14 text-center">
            {/* Icon */}
            <div className="relative inline-block mb-10">
              <div className="p-6 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-3xl shadow-2xl shadow-[#fbbf24]/50">
                <FolderCheck className="w-24 h-24 text-black" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Main message */}
            <h1 className="text-white mb-4">Caso Registrado</h1>
            <h2 className="text-[#fbbf24] mb-10">¡Tu pedido está en camino! 🔎</h2>

            {/* Order details */}
            <div className="bg-[#0f0f0f] border-2 border-[#fbbf24]/30 rounded-2xl p-8 mb-10 text-left paper-texture shadow-inner max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Número de Caso</p>
                  <p className="text-[#fbbf24] font-semibold">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Mesa</p>
                  <p className="text-white font-semibold">Mesa {orderData.tableNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Cliente</p>
                  <p className="text-white font-semibold">{orderData.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Método de Pago</p>
                  <p className="text-white font-semibold capitalize">{orderData.paymentMethod}</p>
                </div>
              </div>

              {orderData.phone && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-1">Teléfono</p>
                  <p className="text-white font-semibold">{orderData.phone}</p>
                </div>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent my-6"></div>

              <div className="space-y-3 mb-6">
                <p className="text-gray-400 text-sm mb-4 font-medium">Evidencias Solicitadas:</p>
                {orderData.items.map((item: any) => (
                  <div key={item.product.id} className="flex justify-between text-sm pb-3 border-b border-[#fbbf24]/10">
                    <span className="text-white">
                      {item.product.name} <span className="text-[#fbbf24]">x{item.quantity}</span>
                    </span>
                    <span className="text-gray-400 font-medium">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent my-6"></div>

              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total:</span>
                <span className="text-[#fbbf24] text-3xl font-semibold">${orderData.total}</span>
              </div>
            </div>

            {/* Thank you message */}
            <div className="mb-10 max-w-2xl mx-auto">
              <p className="text-gray-300 mb-3 text-lg">
                Tu pedido ha sido registrado exitosamente.
              </p>
              <p className="text-gray-400">
                El equipo de investigadores lo preparará y lo entregará en tu mesa.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <PoliceButton
                variant="secondary"
                icon={ShoppingBag}
                onClick={() => navigate('/menu')}
                className="flex-1"
              >
                Hacer Otro Pedido
              </PoliceButton>
              <PoliceButton
                variant="primary"
                icon={Home}
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Volver al Inicio
              </PoliceButton>
            </div>

            {/* Case file decoration */}
            <div className="mt-10 pt-8 border-t border-[#fbbf24]/20">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Evento Scout SanpaHolmes 2024
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Status: ACTIVE | Priority: HIGH
              </p>
            </div>
          </div>

          {/* Bottom seal */}
          <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] p-4 text-center shadow-inner">
            <p className="text-white uppercase tracking-wider font-semibold">CONFIDENCIAL</p>
          </div>
        </div>
      </div>
    </div>
  );
}