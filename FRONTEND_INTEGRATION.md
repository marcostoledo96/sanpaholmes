# 💡 Ejemplos de Integración con el Frontend

Acá tenés ejemplos de cómo consumir la API desde el frontend React.

---

## 1. Configuración inicial

Creá un archivo `utils/api.js`:

```javascript
// utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Helper para obtener el token guardado
export const getToken = () => {
  return localStorage.getItem('token');
};

// Helper para guardar el token
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper para eliminar el token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Configuración base para fetch
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  return response.json();
};

export default API_BASE_URL;
```

---

## 2. Listar productos

```javascript
// components/ProductList.jsx
import { useState, useEffect } from 'react';
import API_BASE_URL from '../utils/api';

export function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      const data = await response.json();
      
      if (data.success) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {productos.map(producto => (
        <div key={producto.id} className="card">
          <h3>{producto.nombre}</h3>
          <p>${producto.precio}</p>
          <p>Stock: {producto.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 3. Agregar al carrito

```javascript
// context/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCart(prevCart => {
      const existente = prevCart.find(item => item.id === producto.id);
      
      if (existente) {
        // Si ya está, aumentamos la cantidad
        return prevCart.map(item =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no está, lo agregamos
        return [...prevCart, { ...producto, quantity: 1 }];
      }
    });
  };

  const aumentarCantidad = (productoId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productoId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (productoId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productoId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const calcularTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      agregarAlCarrito,
      aumentarCantidad,
      disminuirCantidad,
      calcularTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

---

## 4. Confirmar compra

```javascript
// components/Checkout.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../utils/api';

export function Checkout() {
  const { cart, calcularTotal } = useCart();
  const [nombre, setNombre] = useState('');
  const [mesa, setMesa] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [comprobante, setComprobante] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparamos los datos
      const formData = new FormData();
      formData.append('comprador_nombre', nombre);
      formData.append('comprador_mesa', mesa);
      formData.append('metodo_pago', metodoPago);
      
      if (metodoPago === 'transferencia' && comprobante) {
        formData.append('comprobante', comprobante);
      }

      // Convertimos el carrito al formato que espera la API
      const productosParaAPI = cart.map(item => ({
        producto_id: item.id,
        cantidad: item.quantity
      }));
      formData.append('productos', JSON.stringify(productosParaAPI));

      // Enviamos la compra
      const response = await fetch(`${API_BASE_URL}/compras`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Compra realizada exitosamente!');
        // Acá podrías redirigir a una página de confirmación
        window.location.href = `/confirmacion/${data.compra.id}`;
      } else {
        alert(`Error: ${data.mensaje}`);
      }

    } catch (error) {
      console.error('Error al realizar compra:', error);
      alert('Hubo un error al procesar tu compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>Confirmar Pedido</h2>

      <div>
        <label>Nombre y Apellido</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Número de Mesa (1-32)</label>
        <input
          type="number"
          min="1"
          max="32"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Método de Pago</label>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      {metodoPago === 'transferencia' && (
        <div>
          <label>Comprobante de Transferencia</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setComprobante(e.target.files[0])}
            required
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded">
        <h3>Resumen del Pedido</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.nombre} x{item.quantity}</span>
            <span>${item.precio * item.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-bold">
          <div className="flex justify-between">
            <span>TOTAL</span>
            <span>${calcularTotal()}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-500 text-black p-3 rounded font-bold hover:bg-yellow-600"
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </form>
  );
}
```

---

## 5. Login de vendedor

```javascript
// components/VendorLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL, { saveToken } from '../utils/api';

export function VendorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardamos el token
        saveToken(data.token);
        
        // Guardamos los datos del usuario
        localStorage.setItem('user', JSON.stringify(data.usuario));
        
        // Redirigimos al panel
        navigate('/admin');
      } else {
        setError(data.mensaje);
      }

    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2>Acceso Vendedores</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label>Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 text-black p-3 rounded font-bold"
      >
        Iniciar Sesión
      </button>
    </form>
  );
}
```

---

## 6. Panel de admin - Listar ventas

```javascript
// components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

export function AdminPanel() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      const data = await fetchWithAuth('/compras');
      
      if (data.success) {
        setCompras(data.compras);
      }
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando ventas...</div>;

  return (
    <div>
      <h2>Panel de Administración</h2>
      
      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Comprador</th>
            <th>Mesa</th>
            <th>Total</th>
            <th>Método</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {compras.map(compra => (
            <tr key={compra.id}>
              <td>{compra.id}</td>
              <td>{compra.comprador_nombre}</td>
              <td>{compra.comprador_mesa}</td>
              <td>${compra.total}</td>
              <td>{compra.metodo_pago}</td>
              <td>{new Date(compra.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 7. Middleware de protección de rutas

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/api';

export function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    // Si no hay token, redirigimos al login
    return <Navigate to="/vendor/login" replace />;
  }

  // Si hay token, mostramos el contenido protegido
  return children;
}

// Uso en App.jsx:
// <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
```

---

## 🎯 Variables de entorno para el frontend

Creá un archivo `.env` en la raíz del proyecto React:

```
REACT_APP_API_URL=http://localhost:3000/api
```

Para producción:

```
REACT_APP_API_URL=https://tu-proyecto.vercel.app/api
```

---

## 💡 Consejos

1. **Manejo de errores**: Siempre manejá los errores de las peticiones
2. **Loading states**: Mostrá un indicador de carga mientras se hace la petición
3. **Validación**: Validá los datos antes de enviarlos a la API
4. **Tokens**: Guardá el token en localStorage y envialo en cada petición protegida
5. **Logout**: Eliminá el token y redirigí al login cuando el usuario cierra sesión

---

Estos ejemplos te dan una base sólida para integrar el frontend con el backend. Ajustalos según tus necesidades!
