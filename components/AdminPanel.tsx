import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockProducts } from '../data/mockProducts';
import { PoliceButton } from './PoliceButton';
import { Package, ShoppingBag, Eye, Edit2, Trash2, Plus, FileText, CheckCircle, Clock, CheckCheck } from 'lucide-react';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Mock orders data
const mockOrders = [
  {
    id: 'SH-1699234567890',
    customerName: 'Juan Pérez',
    tableNumber: 5,
    total: 2500,
    paymentMethod: 'efectivo' as const,
    status: 'pendiente' as const,
    items: [
      { product: mockProducts[0], quantity: 2 },
      { product: mockProducts[5], quantity: 1 },
    ],
    createdAt: new Date('2024-11-14T10:30:00'),
  },
  {
    id: 'SH-1699234567891',
    customerName: 'María García',
    tableNumber: 12,
    total: 3600,
    paymentMethod: 'transferencia' as const,
    status: 'preparando' as const,
    items: [
      { product: mockProducts[20], quantity: 1 },
    ],
    createdAt: new Date('2024-11-14T11:15:00'),
  },
  {
    id: 'SH-1699234567892',
    customerName: 'Carlos Rodríguez',
    tableNumber: 8,
    total: 1850,
    paymentMethod: 'efectivo' as const,
    status: 'listo' as const,
    items: [
      { product: mockProducts[10], quantity: 2 },
      { product: mockProducts[2], quantity: 2 },
    ],
    createdAt: new Date('2024-11-14T11:45:00'),
  },
];

type TabType = 'products' | 'orders';

export function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (!user) {
    navigate('/vendor/login');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'preparando':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'listo':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'entregado':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return Clock;
      case 'preparando':
        return FileText;
      case 'listo':
        return CheckCircle;
      case 'entregado':
        return CheckCheck;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-8 py-3 mb-6 rounded-2xl shadow-xl shadow-[#ef4444]/30">
            <p className="uppercase tracking-widest font-semibold">PANEL DE CONTROL</p>
          </div>
          <h1 className="text-white mb-3">Administración de Evidencias</h1>
          <p className="text-gray-400 text-lg">Gestión de productos y ventas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-12 border-b-2 border-[#fbbf24]/30">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-4 flex items-center gap-3 transition-all duration-300 rounded-t-2xl font-medium ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Ventas
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-8 py-4 flex items-center gap-3 transition-all duration-300 rounded-t-2xl font-medium ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
            }`}
          >
            <Package className="w-5 h-5" />
            Productos
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-white">Lista de Productos</h2>
              <PoliceButton variant="primary" icon={Plus}>
                Nuevo Producto
              </PoliceButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 rounded-2xl overflow-hidden evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#fbbf24]/20"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden group">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white text-sm mb-2">{product.name}</h3>
                    <p className="text-[#fbbf24] mb-3 font-semibold">${product.price}</p>
                    <p className="text-xs text-gray-400 mb-4 bg-black/30 px-3 py-1 rounded-lg inline-block">#{product.id}</p>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#2a2a2a] to-[#1f1f1f] text-white rounded-xl hover:from-[#3a3a3a] hover:to-[#2a2a2a] transition-all duration-300 shadow-md text-sm flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-xl hover:from-[#f87171] hover:to-[#ef4444] transition-all duration-300 shadow-md text-sm flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-white mb-10">Lista de Ventas</h2>

            {selectedOrder ? (
              // Order Detail View
              <div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#fbbf24] hover:text-[#fcd34d] mb-8 flex items-center gap-2 px-4 py-2 hover:bg-[#1f1f1f] rounded-xl transition-all"
                >
                  ← Volver a la lista
                </button>

                <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24]/50 rounded-3xl p-10 shadow-2xl shadow-[#fbbf24]/20">
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <h3 className="text-white mb-3">Detalle de Compra</h3>
                      <p className="text-[#fbbf24] font-semibold">{selectedOrder.id}</p>
                    </div>
                    <Badge className={`${getStatusColor(selectedOrder.status)} text-white px-4 py-2 rounded-xl shadow-lg`}>
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-6 shadow-inner">
                      <h4 className="text-white mb-5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div>
                        Información del Cliente
                      </h4>
                      <div className="space-y-3 text-sm">
                        <p className="text-gray-400">Nombre: <span className="text-white font-medium">{selectedOrder.customerName}</span></p>
                        <p className="text-gray-400">Mesa: <span className="text-white font-medium">#{selectedOrder.tableNumber}</span></p>
                        <p className="text-gray-400">Pago: <span className="text-white font-medium capitalize">{selectedOrder.paymentMethod}</span></p>
                        <p className="text-gray-400">Fecha: <span className="text-white font-medium">{selectedOrder.createdAt.toLocaleString()}</span></p>
                      </div>
                    </div>

                    <div className="bg-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-6 shadow-inner">
                      <h4 className="text-white mb-5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div>
                        Resumen
                      </h4>
                      <div className="space-y-3 text-sm">
                        <p className="text-gray-400">Items: <span className="text-white font-medium">{selectedOrder.items.length} productos</span></p>
                        <p className="text-gray-400">Estado: <span className="text-white font-medium capitalize">{selectedOrder.status}</span></p>
                        <div className="h-px bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent my-3"></div>
                        <p className="text-gray-400">Total: <span className="text-[#fbbf24] text-2xl font-semibold">${selectedOrder.total}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-6 mb-8 shadow-inner">
                    <h4 className="text-white mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div>
                      Productos
                    </h4>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-xl hover:bg-[#2a2a2a] transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                              <ImageWithFallback
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-white font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-400">Cantidad: <span className="text-[#fbbf24]">{item.quantity}</span></p>
                            </div>
                          </div>
                          <p className="text-[#fbbf24] font-semibold">${item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.paymentMethod === 'transferencia' && (
                    <div className="bg-[#0f0f0f] border border-[#fbbf24]/30 rounded-2xl p-6 mb-8 shadow-inner">
                      <h4 className="text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div>
                        Comprobante de Transferencia
                      </h4>
                      <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                        <p className="text-gray-500">Imagen del comprobante</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <PoliceButton variant="primary" className="flex-1">
                      Marcar como Preparando
                    </PoliceButton>
                    <PoliceButton variant="secondary" className="flex-1">
                      Marcar como Listo
                    </PoliceButton>
                  </div>
                </div>
              </div>
            ) : (
              // Orders List View
              <div className="space-y-5">
                {mockOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 rounded-2xl p-8 evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#fbbf24]/20 group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl group-hover:scale-110 transition-transform">
                              <StatusIcon className="w-5 h-5 text-black" />
                            </div>
                            <h3 className="text-white group-hover:text-[#fbbf24] transition-colors">{order.id}</h3>
                            <Badge className={`${getStatusColor(order.status)} text-white text-xs px-3 py-1 rounded-lg shadow-md`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                            <div>
                              <p className="text-gray-400 mb-1">Cliente</p>
                              <p className="text-white font-medium">{order.customerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Mesa</p>
                              <p className="text-white font-medium">#{order.tableNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Pago</p>
                              <p className="text-white font-medium capitalize">{order.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Total</p>
                              <p className="text-[#fbbf24] font-semibold">${order.total}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <PoliceButton variant="secondary" icon={Eye}>
                            Ver Detalle
                          </PoliceButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}