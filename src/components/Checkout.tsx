import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PoliceButton } from './PoliceButton';
import { FileText, Upload, CreditCard, Banknote } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { getApiUrl } from '../config/api';

export function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    tableNumber: '',
    paymentMethod: '' as 'efectivo' | 'transferencia' | '',
    details: '',
  });

  const [transferProof, setTransferProof] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.paymentMethod) {
      toast.error('Por favor completá todos los campos obligatorios', {
        description: 'Nombre completo y método de pago son requeridos',
      });
      return;
    }

    if (formData.paymentMethod === 'transferencia' && !transferProof) {
      toast.error('Por favor subí el comprobante de transferencia', {
        description: 'Evidencia de pago requerida',
      });
      return;
    }

    try {
      // Preparar datos para enviar al backend como FormData
      const formDataToSend = new FormData();
      formDataToSend.append('comprador_nombre', formData.fullName);
      if (formData.phone) {
        formDataToSend.append('comprador_telefono', formData.phone);
      }
      formDataToSend.append('comprador_mesa', formData.tableNumber);
      formDataToSend.append('metodo_pago', formData.paymentMethod);
      
      // Agregar detalles del pedido si existen
      if (formData.details) {
        formDataToSend.append('detalles_pedido', formData.details);
      }
      
      // Convertir carrito al formato esperado por el backend
      const productos = cart.map(item => ({
        producto_id: parseInt(item.product.id),
        cantidad: item.quantity
      }));
      formDataToSend.append('productos', JSON.stringify(productos));
      
      // Agregar comprobante si existe
      if (transferProof) {
        formDataToSend.append('comprobante', transferProof);
      }

      // Enviar al backend
      const response = await fetch(getApiUrl('/api/compras'), {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.mensaje || 'Error al procesar la compra');
      }

      // Guardar orden en localStorage para mostrar en confirmación
      const orderId = `SH-${data.compra.id}`;
      localStorage.setItem('lastOrder', JSON.stringify({
        id: orderId,
        fullName: formData.fullName,
        phone: formData.phone,
        tableNumber: formData.tableNumber,
        paymentMethod: formData.paymentMethod,
        items: cart,
        total: getTotal(),
      }));

      toast.success('¡Compra registrada exitosamente!');
      clearCart();
      navigate('/order-confirmation');

    } catch (error: any) {
      console.error('Error al crear compra:', error);
      toast.error(error.message || 'Error al procesar la compra', {
        description: 'Por favor intentá nuevamente',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamaño (máximo 3MB - más seguro para Base64)
      if (file.size > 3 * 1024 * 1024) {
        toast.error('El archivo es muy grande', {
          description: 'Máximo 3MB permitido. Usá una foto de menor calidad.',
        });
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes', {
          description: 'Formatos válidos: JPG, PNG, WEBP',
        });
        return;
      }
      
      setTransferProof(file);
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      toast.success(`Comprobante cargado correctamente (${sizeMB}MB)`);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

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
                    <Label htmlFor="fullName" className="text-gray-300 mb-2 block">
                      Nombre Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-black/50 border-[#fbbf24]/30 text-white"
                      placeholder="Ej: Sherlock Holmes"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300 mb-2 block">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-black/50 border-[#fbbf24]/30 text-white"
                      placeholder="Ej: +54 9 11 1234-5678"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tableNumber" className="text-gray-300 mb-2 block">
                      Número de Mesa <span className="text-gray-500">Que aparece en su cartel. Si no tiene mesa, deje vacío</span>
                    </Label>
                    <Input
                      id="tableNumber"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.tableNumber}
                      onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                      className="bg-black/50 border-[#fbbf24]/30 text-white"
                      placeholder="Ej: 1, 2, 3..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="details" className="text-gray-300 mb-2 block">
                      Observaciones
                    </Label>
                    <textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full min-h-[100px] bg-black/50 border border-[#fbbf24]/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] resize-y"
                      placeholder="Ej: Soy vegetariano, Sin cebolla, Celíaco, etc."
                      maxLength={500}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Indicá si tenés alguna restricción alimentaria o preferencia especial
                    </p>
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
                    <div className="mt-6 p-4 sm:p-6 bg-[#0f0f0f] rounded-2xl border border-[#fbbf24]/30 shadow-inner space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-[#fbbf24]" />
                        <p className="text-[#fbbf24] font-medium text-sm sm:text-base">Datos para transferencia:</p>
                      </div>
                      
                      <div className="bg-black/40 rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-gray-400 text-xs sm:text-sm">Alias:</span>
                          <span className="text-[#fbbf24] font-semibold text-sm sm:text-base break-all">sanpaholmes</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-gray-400 text-xs sm:text-sm">CBU:</span>
                          <span className="text-white font-mono text-xs sm:text-sm break-all">0110015030001511247783</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-gray-400 text-xs sm:text-sm">Titular:</span>
                          <span className="text-white text-xs sm:text-sm">Julieta Agustina Mallol</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-gray-400 text-xs sm:text-sm">CUIL:</span>
                          <span className="text-white font-mono text-xs sm:text-sm">27-45747374-0</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-xs sm:text-sm mt-4">Por favor subí el comprobante (máx. 3MB - foto de baja calidad)</p>
                      
                      <Label htmlFor="proof" className="cursor-pointer block mt-4">
                        <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#1f1f1f] border-2 border-dashed border-[#fbbf24]/50 rounded-xl hover:bg-[#2a2a2a] hover:border-[#fbbf24] transition-all duration-300 group">
                          <div className="p-2 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                          </div>
                          <span className="text-white font-medium text-sm sm:text-base truncate">
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