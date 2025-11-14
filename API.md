# 📡 Documentación de la API

## Base URL

```
http://localhost:3000/api
```

---

## 🔓 Endpoints Públicos

### 1. Health Check

Verifica que la API esté funcionando.

```http
GET /api/health
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "✅ API funcionando correctamente",
  "timestamp": "2024-11-14T12:00:00.000Z"
}
```

---

### 2. Listar todos los productos

```http
GET /api/productos
```

**Query params opcionales:**
- `categoria` - Filtrar por categoría (merienda o cena)
- `subcategoria` - Filtrar por subcategoría

**Ejemplo:**
```http
GET /api/productos?categoria=merienda&subcategoria=bebidas
```

**Respuesta:**
```json
{
  "success": true,
  "productos": [
    {
      "id": 1,
      "nombre": "Café con leche",
      "categoria": "merienda",
      "subcategoria": "bebidas",
      "precio": "2000.00",
      "stock": 100,
      "descripcion": null,
      "imagen_url": null,
      "activo": true,
      "creado_en": "2024-11-14T12:00:00.000Z"
    }
  ]
}
```

---

### 3. Obtener un producto específico

```http
GET /api/productos/:id
```

**Ejemplo:**
```http
GET /api/productos/1
```

**Respuesta:**
```json
{
  "success": true,
  "producto": {
    "id": 1,
    "nombre": "Café con leche",
    "categoria": "merienda",
    "subcategoria": "bebidas",
    "precio": "2000.00",
    "stock": 100,
    "activo": true
  }
}
```

---

### 4. Crear una compra

```http
POST /api/compras
Content-Type: multipart/form-data
```

**Body (form-data):**
- `comprador_nombre` (string, requerido) - Nombre y apellido
- `comprador_mesa` (number, requerido) - Número de mesa (1-32)
- `metodo_pago` (string, requerido) - "efectivo" o "transferencia"
- `comprobante` (file, requerido si metodo_pago=transferencia) - Archivo de comprobante
- `productos` (JSON string, requerido) - Array de productos

**Formato de productos:**
```json
[
  {
    "producto_id": 1,
    "cantidad": 2
  },
  {
    "producto_id": 5,
    "cantidad": 1
  }
]
```

**Ejemplo en JavaScript:**
```javascript
const formData = new FormData();
formData.append('comprador_nombre', 'Juan Pérez');
formData.append('comprador_mesa', 15);
formData.append('metodo_pago', 'transferencia');
formData.append('comprobante', archivoFile);
formData.append('productos', JSON.stringify([
  { producto_id: 1, cantidad: 2 },
  { producto_id: 5, cantidad: 1 }
]));

fetch('http://localhost:3000/api/compras', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "mensaje": "Compra registrada exitosamente",
  "compra": {
    "id": 1,
    "comprador_nombre": "Juan Pérez",
    "comprador_mesa": 15,
    "metodo_pago": "transferencia",
    "comprobante_archivo": "/uploads/comprobante-1234567890.jpg",
    "total": "7500.00",
    "fecha": "2024-11-14T12:00:00.000Z",
    "estado": "pendiente"
  }
}
```

**Errores posibles:**
```json
// Stock insuficiente
{
  "success": false,
  "mensaje": "No hay suficiente stock de Café con leche. Stock disponible: 5"
}

// Falta comprobante
{
  "success": false,
  "mensaje": "Para transferencia es obligatorio subir el comprobante"
}
```

---

## 🔐 Endpoints Protegidos

Estos endpoints requieren autenticación. Debés incluir el token JWT en el header:

```http
Authorization: Bearer [tu-token-jwt]
```

### 5. Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "username": "admin",
    "nombre_completo": "Administrador",
    "email": "admin@sanpaholmes.com",
    "roles": ["admin"],
    "permisos": ["ver_productos", "gestionar_productos", "ver_compras", "crear_compra"]
  }
}
```

---

### 6. Obtener datos del usuario actual

```http
GET /api/auth/me
Authorization: Bearer [token]
```

**Respuesta:**
```json
{
  "success": true,
  "usuario": {
    "id": 1,
    "username": "admin",
    "nombre_completo": "Administrador",
    "email": "admin@sanpaholmes.com",
    "roles": ["admin"],
    "permisos": ["ver_productos", "gestionar_productos", "ver_compras", "crear_compra"]
  }
}
```

---

### 7. Cambiar contraseña

```http
POST /api/auth/cambiar-password
Authorization: Bearer [token]
Content-Type: application/json
```

**Body:**
```json
{
  "password_actual": "admin123",
  "password_nueva": "nuevaPassword456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Contraseña actualizada exitosamente"
}
```

---

### 8. Listar todas las compras

```http
GET /api/compras
Authorization: Bearer [token]
```

**Permiso requerido:** `ver_compras`

**Query params opcionales:**
- `fecha_desde` - Filtrar desde fecha (formato: YYYY-MM-DD)
- `fecha_hasta` - Filtrar hasta fecha (formato: YYYY-MM-DD)
- `mesa` - Filtrar por número de mesa

**Ejemplo:**
```http
GET /api/compras?fecha_desde=2024-11-01&mesa=15
```

**Respuesta:**
```json
{
  "success": true,
  "compras": [
    {
      "id": 1,
      "comprador_nombre": "Juan Pérez",
      "comprador_mesa": 15,
      "metodo_pago": "transferencia",
      "comprobante_archivo": "/uploads/comprobante-1234567890.jpg",
      "total": "7500.00",
      "fecha": "2024-11-14T12:00:00.000Z",
      "estado": "pendiente"
    }
  ]
}
```

---

### 9. Obtener detalle de una compra

```http
GET /api/compras/:id
Authorization: Bearer [token]
```

**Permiso requerido:** `ver_compras`

**Ejemplo:**
```http
GET /api/compras/1
```

**Respuesta:**
```json
{
  "success": true,
  "compra": {
    "id": 1,
    "comprador_nombre": "Juan Pérez",
    "comprador_mesa": 15,
    "metodo_pago": "transferencia",
    "total": "7500.00",
    "fecha": "2024-11-14T12:00:00.000Z"
  },
  "detalle": [
    {
      "id": 1,
      "compra_id": 1,
      "producto_id": 1,
      "producto_nombre": "Café con leche",
      "cantidad": 2,
      "precio_unitario": "2000.00",
      "subtotal": "4000.00"
    },
    {
      "id": 2,
      "compra_id": 1,
      "producto_id": 5,
      "producto_nombre": "Brownie",
      "cantidad": 1,
      "precio_unitario": "3500.00",
      "subtotal": "3500.00"
    }
  ]
}
```

---

### 10. Estadísticas de ventas

```http
GET /api/compras/estadisticas/ventas
Authorization: Bearer [token]
```

**Permiso requerido:** `ver_compras`

**Respuesta:**
```json
{
  "success": true,
  "estadisticas": {
    "total_ventas": {
      "total": "50",
      "monto_total": "250000.00"
    },
    "ventas_por_metodo": [
      {
        "metodo_pago": "efectivo",
        "cantidad": "30",
        "monto": "150000.00"
      },
      {
        "metodo_pago": "transferencia",
        "cantidad": "20",
        "monto": "100000.00"
      }
    ],
    "productos_mas_vendidos": [
      {
        "nombre": "Café con leche",
        "cantidad_vendida": "120",
        "monto_total": "240000.00"
      }
    ]
  }
}
```

---

### 11. Crear producto

```http
POST /api/productos
Authorization: Bearer [token]
Content-Type: application/json
```

**Permiso requerido:** `gestionar_productos`

**Body:**
```json
{
  "nombre": "Café con leche",
  "categoria": "merienda",
  "subcategoria": "bebidas",
  "precio": 2000,
  "stock": 100,
  "descripcion": "Café con leche caliente",
  "imagen_url": "https://ejemplo.com/cafe.jpg"
}
```

**Campos obligatorios:** nombre, categoria, precio

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Producto creado exitosamente",
  "producto": {
    "id": 1,
    "nombre": "Café con leche",
    "categoria": "merienda",
    "subcategoria": "bebidas",
    "precio": "2000.00",
    "stock": 100,
    "activo": true
  }
}
```

---

### 12. Actualizar producto

```http
PUT /api/productos/:id
Authorization: Bearer [token]
Content-Type: application/json
```

**Permiso requerido:** `gestionar_productos`

**Body (todos los campos son opcionales):**
```json
{
  "nombre": "Café con leche grande",
  "precio": 2500,
  "stock": 80
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Producto actualizado exitosamente",
  "producto": {
    "id": 1,
    "nombre": "Café con leche grande",
    "precio": "2500.00",
    "stock": 80
  }
}
```

---

### 13. Eliminar producto

```http
DELETE /api/productos/:id
Authorization: Bearer [token]
```

**Permiso requerido:** `gestionar_productos`

**Nota:** No elimina el producto de la base de datos, solo lo marca como inactivo.

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Producto eliminado exitosamente"
}
```

---

## 🚨 Códigos de estado HTTP

- `200` - OK
- `201` - Creado exitosamente
- `400` - Error en los datos enviados
- `401` - No autenticado (falta token o token inválido)
- `403` - Sin permisos
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

---

## 🔐 Permisos disponibles

- `ver_productos` - Ver listado de productos
- `gestionar_productos` - Crear, editar y eliminar productos
- `ver_compras` - Ver listado y detalle de compras
- `crear_compra` - Registrar nuevas compras

---

## 📝 Notas importantes

1. El token JWT expira en **24 horas**
2. Los compradores **NO necesitan autenticación** para hacer compras
3. Solo vendedores y admin necesitan login
4. El stock se descuenta automáticamente al confirmar una compra
5. Las compras se registran en transacciones para evitar inconsistencias
