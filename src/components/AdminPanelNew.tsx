// Panel de administración completo con CRUD de productos y visualización de ventas
// Este componente solo es accesible para usuarios autenticados (vendedores/admin)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PoliceButton } from './PoliceButton';
import { 
  Package, ShoppingBag, Edit2, Trash2, Plus, 
  FileText, CheckCircle, CheckCheck, X, Save 
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { getApiUrl } from '../config/api';

// Definimos los tipos de datos que vamos a manejar
type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: 'merienda' | 'cena';
  imagen_url: string | null;
  disponible: boolean;
};

type PurchaseDetail = {
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

type Purchase = {
  id: number;
  comprador_nombre: string;
  comprador_telefono: string | null;
  comprador_mesa: number;
  metodo_pago: string;
  total: number;
  comprobante_archivo: string | null;
  fecha: string;
  abonado: boolean;
  listo: boolean;
  entregado: boolean;
  detalles_pedido: string | null;
  detalles: PurchaseDetail[];
};

// Tipos para las pestañas del panel
type TabType = 'products' | 'sales';

export function AdminPanelNew() {
  // Hook para verificar autenticación y obtener datos del usuario
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Estados para manejar los datos
  const [activeTab, setActiveTab] = useState<TabType>('sales');
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInactiveProducts, setShowInactiveProducts] = useState(false); // Filtro para mostrar/ocultar inactivos
  
  // Redirigir al login si no hay usuario (pero solo después de cargar)
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('AdminPanelNew: Usuario no autenticado, redirigiendo...');
      navigate('/vendor/login');
    } else if (user) {
      console.log('AdminPanelNew: Usuario autenticado:', user);
    }
  }, [authLoading, user, navigate]);
  
  // Estados para búsqueda de compras
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para edición de compras
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseFormData, setPurchaseFormData] = useState({
    comprador_nombre: '',
    comprador_telefono: '',
    comprador_mesa: '',
  });
  
  // Estados para edición de productos de una compra
  const [editingPurchaseProducts, setEditingPurchaseProducts] = useState<Purchase | null>(null);
  const [showEditProductsModal, setShowEditProductsModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState<PurchaseDetail[]>([]);
  
  // Estados para modal de comprobante
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);
  const [currentComprobante, setCurrentComprobante] = useState<string | null>(null);
  
  // Estado para Google Sheets URL (preconfigurada)
  const [googleSheetsUrl] = useState<string>('https://script.google.com/macros/s/AKfycbwzUiED1XET22wFwD8gGeTmLxOSZVB2qJXJfAmkEDMuM9brfsnd20HplAFp-ODaMQc/exec');
  
  // Estados para el formulario de producto (crear/editar)
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'merienda',
    subcategoria: '',
    imagen_url: '',
    activo: true,
  });

  // Mostrar loading mientras se verifica la sesión
  if (authLoading) {
    console.log('AdminPanelNew: Esperando verificación de sesión...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#fbbf24] border-solid mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar loading (el useEffect redirigirá)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#fbbf24] border-solid mx-auto mb-4"></div>
          <p className="text-gray-400">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // useEffect se ejecuta cuando el componente se monta o cambia la pestaña activa
  // Sirve para cargar los datos del backend según la pestaña seleccionada
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchPurchases();
    }
  }, [activeTab]);

  // Inicializar filteredPurchases cuando purchases cambie
  useEffect(() => {
    setFilteredPurchases(purchases);
  }, [purchases]);

  // Función para obtener la lista de productos del backend
  // Esta función hace una petición GET a la API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Obtenemos el token de autenticación
      const token = localStorage.getItem('token');
      
      // Hacemos la petición al endpoint de admin que devuelve TODOS los productos
      const response = await fetch(getApiUrl('/api/productos/admin/all'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Verificamos si la respuesta fue exitosa (código 200-299)
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      // Convertimos la respuesta JSON a un objeto JavaScript
      const data = await response.json();
      
      // El API retorna { success: true, productos: [...] }
      // Actualizamos el estado con los productos obtenidos
      if (data.success && Array.isArray(data.productos)) {
        // Mapear productos para mantener categoria y subcategoria separados
        const productosConFormato = data.productos.map((p: any) => ({
          ...p,
          // Mantener categoria y subcategoria como campos separados
          categoria: p.categoria,
          subcategoria: p.subcategoria
        }));
        setProducts(productosConFormato);
      } else {
        // Si no viene en el formato esperado, intentar usar data directamente
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar productos');
      // En caso de error, establecer array vacío
      setProducts([]);
    } finally {
      // Independientemente del resultado, dejamos de mostrar el loading
      setLoading(false);
    }
  };

  // Función para obtener el historial de ventas del backend
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      // Obtenemos el token de autenticación del localStorage
      // Este token lo obtuvo el usuario al hacer login
      const token = localStorage.getItem('token');
      
      // Hacemos la petición con el token en el header Authorization
      // Esto es necesario porque el endpoint de compras está protegido
      const response = await fetch(getApiUrl('/api/compras'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar ventas');
      }
      
      const data = await response.json();
      console.log('Respuesta de compras:', data);
      // El backend devuelve {success: true, compras: [...]}
      if (data.success && Array.isArray(data.compras)) {
        setPurchases(data.compras);
      } else {
        setPurchases([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar ventas');
      // En caso de error, establecer array vacío
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo producto
  const handleCreateProduct = async () => {
    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        toast.error('El nombre del producto es obligatorio');
        return;
      }
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        toast.error('El precio debe ser mayor a 0');
        return;
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error('El stock no puede ser negativo');
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('No hay sesión activa. Inicia sesión nuevamente.');
        navigate('/vendor/login');
        return;
      }

      // Preparamos los datos del producto (JSON simple)
      const productoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || '',
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoria: formData.categoria,
        subcategoria: formData.subcategoria.trim() || '',
        imagen_url: formData.imagen_url.trim() || null,
        activo: formData.activo
      };

      console.log('Creando producto:', productoData);
      
      // Hacemos una petición POST para crear el producto
      const response = await fetch(getApiUrl('/api/productos'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoData),
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al crear producto');
      }
      
      toast.success('Producto creado exitosamente');
      setShowProductForm(false);
      resetForm();
      fetchProducts(); // Recargamos la lista
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      toast.error(error.message || 'Error al crear producto');
    }
  };

  // Función para actualizar un producto existente
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        toast.error('El nombre del producto es obligatorio');
        return;
      }
      if (!formData.subcategoria) {
        toast.error('Debes seleccionar el tipo de producto (bebidas, dulces, etc.)');
        return;
      }
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        toast.error('El precio debe ser mayor a 0');
        return;
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error('El stock no puede ser negativo');
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('No hay sesión activa. Inicia sesión nuevamente.');
        navigate('/vendor/login');
        return;
      }

      // Preparamos los datos del producto (JSON simple)
      const productoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || '',
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoria: formData.categoria,
        subcategoria: formData.subcategoria.trim() || '',
        imagen_url: formData.imagen_url.trim() || null,
        activo: formData.activo
      };

      console.log('Actualizando producto:', editingProduct.id, productoData);
      
      // Usamos PUT para actualizar un recurso existente
      const response = await fetch(getApiUrl(`/api/productos/${editingProduct.id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoData),
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al actualizar producto');
      }
      
      toast.success('Producto actualizado exitosamente');
      setShowProductForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      toast.error(error.message || 'Error al actualizar producto');
    }
  };

  // Función para eliminar (o desactivar) un producto
  const handleDeleteProduct = async (id: number) => {
    // Confirmamos con el usuario antes de eliminar
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // DELETE se usa para eliminar recursos
      const response = await fetch(getApiUrl(`/api/productos/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }
      
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  // Función auxiliar para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: 'merienda',
      subcategoria: '',
      imagen_url: '',
      activo: true,
    });
  };

  // Función para abrir el formulario en modo edición
  const handleEditProduct = (product: Product) => {
    const prod = product as any;
    setEditingProduct(product);
    
    // Los productos ahora vienen con categoria y subcategoria ya separados de la API
    // Pero si vienen en formato antiguo "merienda-bebidas", los separamos
    let categoria = 'merienda';
    let subcategoria = '';
    
    if (prod.categoria) {
      // Si ya viene separado (formato nuevo de la API)
      if (!prod.categoria.includes('-')) {
        categoria = prod.categoria;
        subcategoria = prod.subcategoria || '';
      } else {
        // Formato antiguo "merienda-bebidas" (compatibilidad)
        const parts = prod.categoria.split('-');
        if (parts.length === 2) {
          categoria = parts[0];
          subcategoria = parts[1];
        }
      }
    }
    
    setFormData({
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      precio: prod.precio?.toString() || '0',
      stock: prod.stock?.toString() || '0',
      categoria: categoria,
      subcategoria: subcategoria,
      imagen_url: prod.imagen_url || '',
      activo: prod.activo ?? true,
    });
    
    setShowProductForm(true);
  };

  // Función para abrir el formulario en modo creación
  const handleNewProduct = () => {
    setEditingProduct(null);
    resetForm();
    setShowProductForm(true);
  };

  // Función auxiliar para formatear fechas
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString('es-AR', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  // ========== FUNCIONES PARA MANEJO DE COMPRAS ==========

  // Filtrar compras según búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPurchases(purchases);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = purchases.filter(p => 
        p.comprador_nombre.toLowerCase().includes(query) ||
        p.comprador_mesa.toString().includes(query) ||
        (p.comprador_telefono && p.comprador_telefono.includes(query))
      );
      setFilteredPurchases(filtered);
    }
  }, [searchQuery, purchases]);

  // Actualizar estado de compra (abonado/listo/entregado)
  const handleToggleStatus = async (purchaseId: number, field: 'abonado' | 'listo' | 'entregado', currentValue: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/compras/${purchaseId}/estado`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      toast.success(`Estado actualizado: ${field}`);
      fetchPurchases(); // Recargar compras
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar estado');
    }
  };

  // Enviar notificación por WhatsApp cuando el pedido está listo
  const openWhatsApp = (purchase: Purchase) => {
    console.log('🟢 openWhatsApp ejecutado');
    console.log('📱 Purchase:', purchase);
    
    if (!purchase.comprador_telefono) {
      toast.error('Este pedido no tiene número de teléfono registrado');
      return;
    }

    // Limpiar el número de teléfono
    let telefono = purchase.comprador_telefono.replace(/\D/g, '');
    
    // Si no tiene código de país, agregar el de Argentina (54)
    if (!telefono.startsWith('54')) {
      if (telefono.startsWith('0')) telefono = telefono.substring(1);
      if (telefono.startsWith('15')) telefono = telefono.substring(2);
      telefono = '54' + telefono;
    }

    // Crear mensaje personalizado
    const mensaje = `Hola *${purchase.comprador_nombre}*!\n\nTu pedido del evento *SanpaHolmes* ya está listo para ser retirado.\n\n*Pedido #${purchase.id}*\n${purchase.comprador_mesa ? `*Mesa:* ${purchase.comprador_mesa}\n` : ''}*Total:* $${purchase.total}\n\nPodés pasar a retirarlo cuando quieras. Gracias por tu compra!`;

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    console.log('🔗 URL:', whatsappUrl);

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    toast.success(`Abriendo WhatsApp para ${purchase.comprador_nombre}`);
  };

  // Generar URL de WhatsApp para un pedido
  const getWhatsAppUrl = (purchase: Purchase): string => {
    if (!purchase.comprador_telefono) return '#';

    let telefono = purchase.comprador_telefono.replace(/\D/g, '');
    
    if (!telefono.startsWith('54')) {
      if (telefono.startsWith('0')) telefono = telefono.substring(1);
      if (telefono.startsWith('15')) telefono = telefono.substring(2);
      telefono = '54' + telefono;
    }

    const mensaje = `Hola *${purchase.comprador_nombre}*!\n\nTu pedido del evento *SanpaHolmes* ya está listo para ser retirado.\n\n*Pedido #${purchase.id}*\n${purchase.comprador_mesa ? `*Mesa:* ${purchase.comprador_mesa}\n` : ''}*Total:* $${purchase.total}\n\nPodés pasar a retirarlo cuando quieras. Gracias por tu compra!`;

    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  };

  // Eliminar compra
  const handleDeletePurchase = async (purchaseId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta compra? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/compras/${purchaseId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar compra');
      }

      toast.success('Compra eliminada correctamente');
      fetchPurchases();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar compra');
    }
  };

  // Abrir formulario de edición de compra
  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setPurchaseFormData({
      comprador_nombre: purchase.comprador_nombre,
      comprador_telefono: purchase.comprador_telefono || '',
      comprador_mesa: purchase.comprador_mesa.toString(),
    });
    setShowPurchaseForm(true);
  };

  // Actualizar datos de compra
  const handleUpdatePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPurchase) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/compras/${editingPurchase.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          comprador_nombre: purchaseFormData.comprador_nombre,
          comprador_telefono: purchaseFormData.comprador_telefono || null,
          comprador_mesa: parseInt(purchaseFormData.comprador_mesa),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar compra');
      }

      toast.success('Compra actualizada correctamente');
      setShowPurchaseForm(false);
      fetchPurchases();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar compra');
    }
  };

  // Abrir modal de edición de productos
  const handleEditPurchaseProducts = (purchase: Purchase) => {
    setEditingPurchaseProducts(purchase);
    setEditedDetails([...purchase.detalles]);
    setShowEditProductsModal(true);
  };

  // Actualizar cantidad de un producto
  const handleUpdateProductQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedDetails = [...editedDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      cantidad: newQuantity,
      subtotal: updatedDetails[index].precio_unitario * newQuantity
    };
    setEditedDetails(updatedDetails);
  };

  // Eliminar un producto de la compra
  const handleRemoveProductFromPurchase = (index: number) => {
    const updatedDetails = editedDetails.filter((_, i) => i !== index);
    setEditedDetails(updatedDetails);
  };

  // Guardar cambios en productos (Esta función necesitaría un endpoint en el backend)
  const handleSaveProductChanges = async () => {
    if (!editingPurchaseProducts) return;

    try {
      const token = localStorage.getItem('token');
      
      // Preparar los productos en el formato que espera el backend
      const productosActualizados = editedDetails.map(detalle => ({
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal
      }));

      const response = await fetch(getApiUrl(`/api/compras/${editingPurchaseProducts}/productos`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productos: productosActualizados
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Productos actualizados', {
          description: `El total de la orden es ahora: $${data.nuevoTotal.toFixed(2)}`
        });
        
        // Recargar las compras para ver los cambios
        await fetchPurchases();
        
        setShowEditProductsModal(false);
        setEditingPurchaseProducts(null);
        setEditedDetails([]);
      } else {
        toast.error('Error al actualizar', {
          description: data.mensaje || 'No se pudieron actualizar los productos'
        });
      }
    } catch (error) {
      console.error('Error al actualizar productos:', error);
      toast.error('Error de conexión', {
        description: 'No se pudo conectar con el servidor'
      });
    }
  };

  // Exportar ventas a Google Sheets
  const handleExportToGoogleSheets = async () => {
    await exportToSheets(googleSheetsUrl);
  };

  const exportToSheets = async (url: string): Promise<void> => {
    try {
      toast.info('Exportando ventas...', {
        description: 'Limpiando datos anteriores y enviando nuevos'
      });

      // Preparar datos para exportar
      const dataToExport = filteredPurchases.map(purchase => ({
        orden_id: purchase.id,
        fecha: new Date(purchase.fecha).toLocaleString('es-AR'),
        cliente: purchase.comprador_nombre,
        telefono: purchase.comprador_telefono || 'N/A',
        mesa: purchase.comprador_mesa,
        metodo_pago: purchase.metodo_pago,
        total: purchase.total,
        abonado: purchase.abonado ? 'Sí' : 'No',
        listo: purchase.listo ? 'Sí' : 'No',
        entregado: purchase.entregado ? 'Sí' : 'No',
        detalles: purchase.detalles_pedido || '',
        productos: purchase.detalles.map(d => `${d.cantidad}x ${d.producto_nombre}`).join(', ')
      }));

      // Enviar señal para limpiar y reemplazar datos
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          clearBefore: true, // Señal para limpiar datos anteriores
          ventas: dataToExport 
        }),
      });

      toast.success('Ventas exportadas correctamente', {
        description: `${dataToExport.length} ventas enviadas a Google Sheets (datos anteriores eliminados)`
      });

    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar', {
        description: 'Verifica la URL del Google Apps Script'
      });
    }
  };

  // Función auxiliar para formatear precios
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Encabezado del panel */}
        <div className="mb-12">
          <div className="inline-block bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-8 py-3 mb-6 rounded-2xl shadow-xl shadow-[#ef4444]/30">
            <p className="uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="material-icons text-xl">admin_panel_settings</span>
              PANEL DE CONTROL
            </p>
          </div>
          <h1 className="text-white mb-3">Administración del Sistema</h1>
          <p className="text-gray-400 text-lg">Gestión de productos y visualización de ventas</p>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex gap-4 mb-12 border-b-2 border-[#fbbf24]/30">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-8 py-4 flex items-center gap-3 transition-all duration-300 rounded-t-2xl font-medium ${
              activeTab === 'sales'
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

        {/* Pestaña de Productos */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h2 className="text-white mb-2">Lista de Productos ({Array.isArray(products) ? products.filter(p => showInactiveProducts || (p as any).activo).length : 0})</h2>
                <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInactiveProducts}
                    onChange={(e) => setShowInactiveProducts(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-[#fbbf24] focus:ring-[#fbbf24] focus:ring-offset-0 bg-black"
                  />
                  Mostrar productos eliminados
                </label>
              </div>
              <PoliceButton variant="primary" icon={Plus} onClick={handleNewProduct}>
                Nuevo Producto
              </PoliceButton>
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-20">
                <span className="material-icons text-6xl animate-spin">refresh</span>
                <p className="mt-4">Cargando productos...</p>
              </div>
            ) : !Array.isArray(products) || products.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <span className="material-icons text-6xl">inventory_2</span>
                <p className="mt-4">No hay productos disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => showInactiveProducts || (product as any).activo)
                  .map((product) => (
                  <div
                    key={product.id}
                    className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 rounded-2xl overflow-hidden hover:border-[#fbbf24]/50 transition-all duration-300 shadow-lg"
                  >
                    {/* Imagen del producto */}
                    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                      {product.imagen_url ? (
                        <img 
                          src={product.imagen_url} 
                          alt={product.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-icons text-6xl text-gray-600">image</span>
                        </div>
                      )}
                      
                      {/* Badge de disponibilidad */}
                      <div className="absolute top-3 right-3">
                        <Badge className={(product as any).activo ? 'bg-green-500' : 'bg-red-500'}>
                          {(product as any).activo ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </div>
                      
                      {/* Badge de categoría */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#fbbf24] text-black">
                          {product.categoria === 'merienda' ? 'Merienda' : 'Cena'}
                        </Badge>
                      </div>
                    </div>

                    {/* Información del producto */}
                    <div className="p-6">
                      <h3 className="text-white font-semibold text-lg mb-2">{product.nombre}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.descripcion}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[#fbbf24] text-2xl font-bold">
                          {formatPrice(product.precio)}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <span className="material-icons text-sm">inventory_2</span>
                          Stock: {product.stock}
                        </span>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>
            )}
          </div>
        )}

        {/* Pestaña de Ventas */}
        {activeTab === 'sales' && (
          <div>
            {/* Barra de búsqueda y exportar */}
            <div className="flex justify-between items-center gap-4 mb-8">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Buscar por nombre, mesa o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/50 border-[#fbbf24]/30 text-white"
                />
              </div>
              <button
                onClick={handleExportToGoogleSheets}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="Exportar ventas a Google Sheets"
              >
                <FileText className="w-4 h-4" />
                Exportar a Sheets
              </button>
              <div className="text-gray-400 flex items-center gap-2">
                <span className="material-icons">receipt_long</span>
                <span className="font-semibold">{filteredPurchases.length} ventas</span>
                <span className="mx-2">•</span>
                Total: {formatPrice(filteredPurchases.reduce((sum, p) => sum + (parseFloat(p.total as any) || 0), 0))}
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-20">
                <span className="material-icons text-6xl animate-spin">refresh</span>
                <p className="mt-4">Cargando ventas...</p>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <span className="material-icons text-6xl">receipt</span>
                <p className="mt-4">
                  {searchQuery ? 'No se encontraron ventas con ese criterio' : 'No hay ventas registradas aún'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 rounded-2xl p-6 hover:border-[#fbbf24]/50 transition-all duration-300"
                  >
                    {/* Encabezado de la venta */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-2">
                          <span className="material-icons">shopping_cart</span>
                          Orden #{purchase.id}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-300 flex items-center gap-2">
                            <span className="material-icons text-sm">person</span>
                            {purchase.comprador_nombre}
                          </p>
                          {purchase.comprador_telefono && (
                            <p className="text-gray-400 flex items-center gap-2">
                              <span className="material-icons text-sm">phone</span>
                              {purchase.comprador_telefono}
                            </p>
                          )}
                          {purchase.detalles_pedido && (
                            <p className="text-amber-400 flex items-center gap-2 mt-2 bg-amber-900/20 px-2 py-1 rounded">
                              <span className="material-icons text-sm">info</span>
                              <span className="italic">{purchase.detalles_pedido}</span>
                            </p>
                          )}
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(purchase.fecha).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#fbbf24] text-2xl font-bold mb-2">
                          {formatPrice(purchase.total)}
                        </p>
                        <Badge className="bg-blue-600 mb-2">
                          Mesa {purchase.comprador_mesa}
                        </Badge>
                        <div className="flex flex-col gap-1 mt-2">
                          <Badge className={purchase.abonado ? 'bg-green-600' : 'bg-gray-600'}>
                            {purchase.abonado ? '✓ Abonado' : 'Pendiente de pago'}
                          </Badge>
                          <Badge className={purchase.listo ? 'bg-blue-600' : 'bg-gray-600'}>
                            {purchase.listo ? '✓ Listo' : 'En preparación'}
                          </Badge>
                          <Badge className={purchase.entregado ? 'bg-green-600' : 'bg-orange-600'}>
                            {purchase.entregado ? '✓✓ Entregado' : 'Por entregar'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Detalles de productos */}
                    <div className="border-t border-gray-700 pt-4 mb-4">
                      <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                        <span className="material-icons text-sm">list_alt</span>
                        Productos:
                      </p>
                      <div className="space-y-2">
                        {purchase.detalles.map((detalle, idx) => (
                          <div 
                            key={idx}
                            className="flex justify-between items-center bg-black/30 p-3 rounded-lg group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-[#fbbf24] font-semibold">
                                x{detalle.cantidad}
                              </span>
                              <span className="text-white">
                                {detalle.producto_nombre}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">
                                {formatPrice(detalle.subtotal)}
                              </span>
                              <button
                                onClick={() => handleEditPurchaseProducts(purchase)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30"
                                title="Editar cantidad"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Información de pago y comprobante */}
                    <div className="flex items-center justify-between border-t border-gray-700 pt-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="material-icons">payment</span>
                        <span className="capitalize">{purchase.metodo_pago}</span>
                      </div>
                      {purchase.comprobante_archivo && (
                        <button
                          onClick={() => {
                            const comprobante = purchase.comprobante_archivo!;
                            setCurrentComprobante(
                              comprobante.startsWith('data:') 
                                ? comprobante 
                                : getApiUrl(comprobante)
                            );
                            setShowComprobanteModal(true);
                          }}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span className="material-icons">receipt</span>
                          Ver Comprobante
                        </button>
                      )}
                    </div>

                    {/* Controles de estado y acciones */}
                    <div className="border-t border-gray-700 pt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(purchase.id, 'abonado', purchase.abonado)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          purchase.abonado 
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {purchase.abonado ? 'Marcar como no abonado' : 'Marcar como abonado'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(purchase.id, 'listo', purchase.listo)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          purchase.listo 
                            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {purchase.listo ? 'Marcar como no listo' : 'Marcar como listo'}
                      </button>
                      
                      {/* Botón de notificar por WhatsApp - ENLACE DIRECTO */}
                      {purchase.comprador_telefono && purchase.listo && !purchase.entregado && (
                        <a
                          href={getWhatsAppUrl(purchase)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            console.log('🔴 CLICK EN ENLACE WHATSAPP');
                            toast.success(`Abriendo WhatsApp para ${purchase.comprador_nombre}`);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'rgba(22, 163, 74, 0.2)',
                            color: 'rgb(74, 222, 128)',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.3)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.2)'}
                          title="Notificar que el pedido está listo"
                        >
                          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>📱</span>
                          <span>Notificar WhatsApp</span>
                        </a>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(purchase.id, 'entregado', purchase.entregado)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          purchase.entregado 
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                            : 'bg-orange-700/20 text-orange-400 hover:bg-orange-700/30'
                        }`}
                      >
                        <CheckCheck className="w-4 h-4" />
                        {purchase.entregado ? 'Marcar como no entregado' : 'Marcar como entregado'}
                      </button>
                      <button
                        onClick={() => handleEditPurchase(purchase)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar datos
                      </button>
                      <button
                        onClick={() => handleDeletePurchase(purchase.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de edición de compra */}
        {showPurchaseForm && editingPurchase && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24] rounded-3xl p-8 max-w-lg w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-semibold">Editar Compra #{editingPurchase.id}</h2>
                <button
                  onClick={() => setShowPurchaseForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdatePurchase} className="space-y-4">
                <div>
                  <Label htmlFor="comprador_nombre" className="text-gray-300">Nombre del cliente</Label>
                  <Input
                    id="comprador_nombre"
                    value={purchaseFormData.comprador_nombre}
                    onChange={(e) => setPurchaseFormData({ ...purchaseFormData, comprador_nombre: e.target.value })}
                    className="bg-black/50 border-[#fbbf24]/30 text-white mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="comprador_telefono" className="text-gray-300">Teléfono (opcional)</Label>
                  <Input
                    id="comprador_telefono"
                    value={purchaseFormData.comprador_telefono}
                    onChange={(e) => setPurchaseFormData({ ...purchaseFormData, comprador_telefono: e.target.value })}
                    className="bg-black/50 border-[#fbbf24]/30 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="comprador_mesa" className="text-gray-300">Número de Mesa</Label>
                  <Input
                    id="comprador_mesa"
                    type="number"
                    min="1"
                    max="32"
                    value={purchaseFormData.comprador_mesa}
                    onChange={(e) => setPurchaseFormData({ ...purchaseFormData, comprador_mesa: e.target.value })}
                    className="bg-black/50 border-[#fbbf24]/30 text-white mt-2"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPurchaseForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#fbbf24] hover:bg-[#fcd34d] text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edición de productos de compra */}
        {showEditProductsModal && editingPurchaseProducts && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-semibold">Editar Productos - Orden #{editingPurchaseProducts.id}</h2>
                <button
                  onClick={() => setShowEditProductsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {editedDetails.map((detalle, index) => (
                  <div key={index} className="bg-black/30 p-4 rounded-lg flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{detalle.producto_nombre}</p>
                      <p className="text-gray-400 text-sm">{formatPrice(detalle.precio_unitario)} c/u</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateProductQuantity(index, detalle.cantidad - 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center justify-center"
                        disabled={detalle.cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="text-white font-semibold w-12 text-center">{detalle.cantidad}</span>
                      <button
                        onClick={() => handleUpdateProductQuantity(index, detalle.cantidad + 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[#fbbf24] font-semibold">{formatPrice(detalle.subtotal)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveProductFromPurchase(index)}
                      className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {editedDetails.length === 0 && (
                  <div className="text-center text-gray-400 py-10">
                    <p>No hay productos en esta orden</p>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-[#fbbf24] font-bold">
                      {formatPrice(editedDetails.reduce((sum, d) => sum + d.subtotal, 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProductsModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProductChanges}
                  className="flex-1 bg-[#fbbf24] hover:bg-[#fcd34d] text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para ver comprobante */}
        {showComprobanteModal && currentComprobante && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowComprobanteModal(false)}>
            <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              {/* Encabezado del modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Comprobante de Transferencia</h3>
                <button
                  onClick={() => setShowComprobanteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              {/* Imagen del comprobante */}
              <div className="p-6">
                <img 
                  src={currentComprobante} 
                  alt="Comprobante de transferencia" 
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Error+al+cargar+imagen';
                  }}
                />
              </div>

              {/* Botón de cerrar */}
              <div className="p-6 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowComprobanteModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de formulario para crear/editar producto */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-2 border-[#fbbf24] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Encabezado del modal */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white text-2xl font-semibold flex items-center gap-2">
                  <span className="material-icons">
                    {editingProduct ? 'edit' : 'add_circle'}
                  </span>
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <Label htmlFor="nombre" className="text-gray-300 mb-2 flex items-center gap-2">
                    <span className="material-icons text-sm">label</span>
                    Nombre del producto
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-black/50 border-[#fbbf24]/30 text-white"
                    placeholder="Ej: Café con leche"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <Label htmlFor="descripcion" className="text-gray-300 mb-2 flex items-center gap-2">
                    <span className="material-icons text-sm">description</span>
                    Descripción
                  </Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="bg-black/50 border-[#fbbf24]/30 text-white"
                    placeholder="Ej: Café con leche y medialunas"
                    required
                  />
                </div>

                {/* Precio y Stock en la misma fila */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precio" className="text-gray-300 mb-2 flex items-center gap-2">
                      <span className="material-icons text-sm">attach_money</span>
                      Precio (ARS)
                    </Label>
                    <Input
                      id="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      className="bg-black/50 border-[#fbbf24]/30 text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock" className="text-gray-300 mb-2 flex items-center gap-2">
                      <span className="material-icons text-sm">inventory_2</span>
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="bg-black/50 border-[#fbbf24]/30 text-white"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <Label htmlFor="categoria" className="text-gray-300 mb-2 flex items-center gap-2">
                    <span className="material-icons text-sm">category</span>
                    Categoría Principal
                  </Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value: 'merienda' | 'cena') => 
                      setFormData({ ...formData, categoria: value, subcategoria: '' })
                    }
                  >
                    <SelectTrigger className="bg-[#2a2a2a] border-[#fbbf24]/30 text-white hover:bg-[#333333]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merienda">Merienda</SelectItem>
                      <SelectItem value="cena">Cena</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategoría */}
                <div>
                  <Label htmlFor="subcategoria" className="text-gray-300 mb-2 flex items-center gap-2">
                    <span className="material-icons text-sm">restaurant_menu</span>
                    Subcategoría (Tipo de producto)
                  </Label>
                  <Select
                    value={formData.subcategoria}
                    onValueChange={(value) => setFormData({ ...formData, subcategoria: value })}
                  >
                    <SelectTrigger className="bg-[#2a2a2a] border-[#fbbf24]/30 text-white hover:bg-[#333333]">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.categoria === 'merienda' ? (
                        <>
                          <SelectItem value="bebidas">Bebidas</SelectItem>
                          <SelectItem value="dulces">Dulces</SelectItem>
                          <SelectItem value="salados">Salados</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="bebidas">Bebidas</SelectItem>
                          <SelectItem value="comidas">Comidas</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Imagen del producto */}
                <div className="space-y-3">
                  <Label className="text-gray-300 mb-2 flex items-center gap-2">
                    <span className="material-icons text-sm">image</span>
                    Imagen del producto (URL)
                  </Label>
                  
                  {/* Input para URL de imagen */}
                  <div className="flex flex-col gap-3">
                    <Input
                      type="url"
                      placeholder="https://i.imgur.com/ejemplo.jpg"
                      value={formData.imagen_url}
                      onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                      className="bg-black/50 border-[#fbbf24]/30 text-white placeholder:text-gray-500"
                    />
                    
                    <p className="text-xs text-gray-400">
                      💡 <strong>Cómo subir imágenes:</strong><br/>
                      1. Ve a <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-[#fbbf24] hover:underline">imgur.com/upload</a><br/>
                      2. Sube tu imagen (sin necesidad de cuenta)<br/>
                      3. Clic derecho en la imagen → "Copiar dirección de imagen"<br/>
                      4. Pega la URL aquí
                    </p>
                    
                    {/* Preview de la imagen */}
                    {formData.imagen_url && (
                      <div className="relative w-40 h-40 border-2 border-[#fbbf24]/30 rounded-lg overflow-hidden">
                        <img
                          src={formData.imagen_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160?text=URL+Inválida';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Disponible */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="w-5 h-5 rounded border-[#fbbf24]/30"
                  />
                  <Label htmlFor="activo" className="text-gray-300 flex items-center gap-2">
                    <span className="material-icons text-sm">check_circle</span>
                    Producto disponible para la venta
                  </Label>
                </div>                {/* Botones del formulario */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                    className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
