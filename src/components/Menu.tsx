import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { Coffee, UtensilsCrossed, Cookie, Sandwich, Beer, Pizza, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { getApiUrl } from '../config/api';

type CategoryFilter = 'all' | 'merienda' | 'cena';

export function Menu() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(getApiUrl('/api/productos'));
        const data = await response.json();
        
        if (data.success && Array.isArray(data.productos)) {
          // Convertir los productos del backend al formato del frontend
          const mappedProducts = data.productos.map((p: any) => {
            // Concatenar categoria y subcategoria para el formato esperado: "merienda-bebidas"
            const categoryFormatted = p.subcategoria 
              ? `${p.categoria}-${p.subcategoria}` 
              : p.categoria;
            
            return {
              id: p.id.toString(),
              name: p.nombre,
              price: parseFloat(p.precio),
              category: categoryFormatted,
              image: p.imagen_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
              description: p.descripcion || '',
              stock: p.stock,
              activo: p.activo
            };
          });
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        toast.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`, {
      description: 'Evidencia registrada correctamente',
      duration: 5000,
      action: {
        label: 'Ir al carrito',
        onClick: () => navigate('/cart'),
      },
    });
  };

  const filteredProducts = products.filter(product => {
    if (categoryFilter === 'all') return true;
    return product.category.startsWith(categoryFilter);
  });

  const categories = [
    { id: 'all', label: 'Todas las Evidencias', icon: UtensilsCrossed },
    { id: 'merienda', label: 'Merienda', icon: Coffee },
    { id: 'cena', label: 'Cena', icon: Pizza },
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#fbbf24] border-solid mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      {/* Contenedor principal centrado con mejor espaciado */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - mejor centrado */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-8 py-3 mb-8 rounded-2xl shadow-xl">
            <p className="uppercase tracking-widest font-semibold">EVIDENCIAS DISPONIBLES</p>
          </div>
          <h1 className="text-white mb-5">Menú de Productos</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Seleccioná las evidencias que necesités para resolver tu caso
          </p>
        </div>

        {/* Category filters - mejor espaciado */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
                className={`px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium ${
                  categoryFilter === cat.id
                    ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black shadow-lg shadow-[#fbbf24]/30 scale-105'
                    : 'bg-gradient-to-r from-[#2a2a2a] to-[#1f1f1f] text-white border-2 border-[#2a2a2a] hover:border-[#fbbf24]/50 shadow-md hover:shadow-lg hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products by subcategory - mejor espaciado y alineación */}
        <div className="space-y-24">
          {/* MERIENDA Section */}
          {(categoryFilter === 'all' || categoryFilter === 'merienda') && (
            <div>
              <div className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl shadow-lg">
                    <Coffee className="w-7 h-7 text-black" />
                  </div>
                  <h2 className="text-white">MERIENDA</h2>
                </div>
                <div className="h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent rounded-full max-w-md mx-auto"></div>
              </div>

              {/* Bebidas */}
              <div className="mb-20">
                <h3 className="text-[#fbbf24] mb-8 flex items-center justify-center gap-3">
                  <Coffee className="w-6 h-6" />
                  Bebidas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {products
                    .filter(p => p.category === 'merienda-bebidas')
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </div>

              {/* Dulces */}
              <div className="mb-20">
                <h3 className="text-[#fbbf24] mb-8 flex items-center justify-center gap-3">
                  <Cookie className="w-6 h-6" />
                  Dulces
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {products
                    .filter(p => p.category === 'merienda-dulces')
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </div>

              {/* Salados */}
              <div className="mb-20">
                <h3 className="text-[#fbbf24] mb-8 flex items-center justify-center gap-3">
                  <Sandwich className="w-6 h-6" />
                  Salados
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {products
                    .filter(p => p.category === 'merienda-salados')
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* CENA Section */}
          {(categoryFilter === 'all' || categoryFilter === 'cena') && (
            <div>
              <div className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl shadow-lg">
                    <Pizza className="w-7 h-7 text-black" />
                  </div>
                  <h2 className="text-white">CENA</h2>
                </div>
                <div className="h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent rounded-full max-w-md mx-auto"></div>
              </div>

              {/* Bebidas */}
              <div className="mb-20">
                <h3 className="text-[#fbbf24] mb-8 flex items-center justify-center gap-3">
                  <Beer className="w-6 h-6" />
                  Bebidas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {products
                    .filter(p => p.category === 'cena-bebidas')
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </div>

              {/* Comidas */}
              <div className="mb-20">
                <h3 className="text-[#fbbf24] mb-8 flex items-center justify-center gap-3">
                  <UtensilsCrossed className="w-6 h-6" />
                  Comidas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {products
                    .filter(p => p.category === 'cena-comidas')
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se encontraron evidencias en esta categoría</p>
          </div>
        )}

        {/* Botón de Carrito al final */}
        <div className="flex justify-center py-16 sm:py-20">
          <button
            onClick={() => navigate('/cart')}
            className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-[#fbbf24]/50 transition-all duration-300 hover:scale-110 hover:from-[#fcd34d] hover:to-[#fbbf24] border-2 border-[#fbbf24] hover:border-[#fcd34d] animate-pulse hover:animate-none"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              <span>IR AL CARRITO</span>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-bold shadow-lg border-2 border-white group-hover:scale-125 transition-transform">
                {cart.length}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}