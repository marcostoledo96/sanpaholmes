import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PoliceButton } from './PoliceButton';
import { FileText, Upload, CreditCard, Banknote } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tableNumber: '',
    paymentMethod: '' as 'efectivo' | 'transferencia' | '',
  });

  const [transferProof, setTransferProof] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.tableNumber || !formData.paymentMethod) {
      toast.error('Por favor completá todos los campos', {
        description: 'Evidencias incompletas',
      });
      return;
    }

    if (formData.paymentMethod === 'transferencia' && !transferProof) {
      toast.error('Por favor subí el comprobante de transferencia', {
        description: 'Evidencia de pago requerida',
      });
      return;
    }

    // Mock order creation
    const orderId = `SH-${Date.now()}`;
    
    // Store order data
    localStorage.setItem('lastOrder', JSON.stringify({
      id: orderId,
      ...formData,
      items: cart,
      total: getTotal(),
    }));

    clearCart();
    navigate('/order-confirmation');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransferProof(e.target.files[0]);
      toast.success('Comprobante cargado correctamente');
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const tables = Array.from({ length: 32 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen py-20">
      {/* Contenedor principal centrado con mejor espaciado */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Header - centrado */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-8 py-3 mb-8 rounded-2xl shadow-xl">
            <p className="uppercase tracking-widest font-semibold">DECLARACIÓN DE PEDIDO</p>
          </div>
          <h1 className="text-white mb-5">Checkout</h1>
          <p className="text-gray-400 text-lg">Completá tus datos para confirmar el caso</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-8 paper-texture shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-white">Datos Personales</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300 mb-2 block">Nombre</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-[#0f0f0f] border-[#fbbf24]/30 text-white focus:border-[#fbbf24] rounded-xl h-12"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-gray-300 mb-2 block">Apellido</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-[#0f0f0f] border-[#fbbf24]/30 text-white focus:border-[#fbbf24] rounded-xl h-12"
                      placeholder="Tu apellido"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tableNumber" className="text-gray-300 mb-2 block">Número de Mesa</Label>
                    <Select
                      value={formData.tableNumber}
                      onValueChange={(value) => setFormData({ ...formData, tableNumber: value })}
                    >
                      <SelectTrigger className="bg-[#0f0f0f] border-[#fbbf24]/30 text-white rounded-xl h-12">
                        <SelectValue placeholder="Seleccioná tu mesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Mesa {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-8 paper-texture shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl">
                    <CreditCard className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-white">Método de Pago</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'efectivo' })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.paymentMethod === 'efectivo'
                          ? 'border-[#fbbf24] bg-[#fbbf24]/10 shadow-lg shadow-[#fbbf24]/30'
                          : 'border-[#2a2a2a] hover:border-[#fbbf24]/50'
                      }`}
                    >
                      <Banknote className={`w-10 h-10 mx-auto mb-3 ${
                        formData.paymentMethod === 'efectivo' ? 'text-[#fbbf24]' : 'text-gray-400'
                      }`} />
                      <p className={`font-medium ${
                        formData.paymentMethod === 'efectivo' ? 'text-[#fbbf24]' : 'text-gray-400'
                      }`}>Efectivo</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'transferencia' })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.paymentMethod === 'transferencia'
                          ? 'border-[#fbbf24] bg-[#fbbf24]/10 shadow-lg shadow-[#fbbf24]/30'
                          : 'border-[#2a2a2a] hover:border-[#fbbf24]/50'
                      }`}
                    >
                      <CreditCard className={`w-10 h-10 mx-auto mb-3 ${
                        formData.paymentMethod === 'transferencia' ? 'text-[#fbbf24]' : 'text-gray-400'
                      }`} />
                      <p className={`font-medium ${
                        formData.paymentMethod === 'transferencia' ? 'text-[#fbbf24]' : 'text-gray-400'
                      }`}>Transferencia</p>
                    </button>
                  </div>

                  {formData.paymentMethod === 'transferencia' && (
                    <div className="mt-6 p-6 bg-[#0f0f0f] rounded-2xl border border-[#fbbf24]/30 shadow-inner">
                      <p className="text-[#fbbf24] mb-3 font-medium">Datos para transferencia:</p>
                      <p className="text-white mb-1">Alias: <span className="text-[#fbbf24] font-semibold">SANPAHOLMES.EVENTO</span></p>
                      <p className="text-gray-400 text-sm mb-6">Por favor subí el comprobante</p>
                      
                      <Label htmlFor="proof" className="cursor-pointer">
                        <div className="flex items-center gap-3 p-4 bg-[#1f1f1f] border-2 border-dashed border-[#fbbf24]/50 rounded-xl hover:bg-[#2a2a2a] hover:border-[#fbbf24] transition-all duration-300 group">
                          <div className="p-2 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-lg group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-black" />
                          </div>
                          <span className="text-white font-medium">
                            {transferProof ? transferProof.name : 'Subir comprobante'}
                          </span>
                        </div>
                        <Input
                          id="proof"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <PoliceButton
                type="submit"
                variant="primary"
                className="w-full"
              >
                Enviar Pedido
              </PoliceButton>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-8 sticky top-24 shadow-xl">
              <h3 className="text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div>
                Resumen del Caso
              </h3>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm pb-3 border-b border-[#fbbf24]/10">
                    <span className="text-gray-400">
                      {item.product.name} <span className="text-[#fbbf24]">x{item.quantity}</span>
                    </span>
                    <span className="text-white font-medium">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent my-6"></div>
              <div className="flex justify-between items-center">
                <h4 className="text-white">Total:</h4>
                <p className="text-[#fbbf24] text-3xl font-semibold">${getTotal()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}