# 🎯 GUÍA PARA DEFENDER EL PROYECTO SANPAHOLMES

Esta guía te ayudará a explicar tu proyecto de forma profesional y segura, especialmente la parte del backend que es la más compleja.

---

## 📋 ÍNDICE
1. [Introducción del Proyecto](#introducción-30-segundos)
2. [Explicación del Backend](#backend-la-parte-más-importante)
3. [Explicación del Frontend](#frontend)
4. [Base de Datos](#base-de-datos)
5. [Preguntas Frecuentes](#preguntas-que-te-pueden-hacer)
6. [Consejos para la Defensa](#consejos-finales)

---

## INTRODUCCIÓN (30 segundos)

**¿Qué hiciste?**
> "Desarrollé un sistema completo de carrito de compras para el evento Scout SanpaHolmes. Es una aplicación web full-stack que permite a los participantes ver el menú, agregar productos al carrito, realizar compras y subir comprobantes de pago. Además, incluye un panel de administración para que los vendedores gestionen productos y visualicen las ventas en tiempo real."

**Stack tecnológico:**
- **Frontend:** React con TypeScript y Vite
- **Backend:** Node.js con Express
- **Base de Datos:** PostgreSQL en Neon (cloud)
- **Autenticación:** JWT (JSON Web Tokens)
- **Deploy:** Vercel

---

## BACKEND (LA PARTE MÁS IMPORTANTE)

### 1. Arquitectura del Backend

**Pregunta:** "¿Cómo está estructurado tu backend?"

**Respuesta:**
> "El backend está construido con Node.js y Express. La estructura es modular y sigue el patrón MVC adaptado para APIs REST. Tengo:
> 
> - **server.js**: El archivo principal que configura el servidor Express
> - **api/**: Carpeta con los endpoints organizados por funcionalidad:
>   - `auth.js`: Maneja login y autenticación
>   - `productos.js`: CRUD de productos
>   - `compras.js`: Registro de ventas
> - **middleware/**: Funciones que se ejecutan entre la petición y la respuesta
>   - `auth.js`: Verifica que el usuario esté autenticado
> - **db/**: Todo lo relacionado con la base de datos
>   - `connection.js`: Configuración de PostgreSQL
>   - `init.js`: Script para crear tablas y datos iniciales"

### 2. ¿Cómo funciona una petición HTTP?

**Pregunta:** "Explícame cómo funciona una petición al backend"

**Respuesta detallada:**
> "Te lo explico con un ejemplo real. Cuando un usuario hace login:
> 
> **Paso 1 - El Frontend hace una petición:**
> ```javascript
> fetch('http://localhost:3000/api/auth/login', {
>   method: 'POST',
>   headers: { 'Content-Type': 'application/json' },
>   body: JSON.stringify({ username: 'admin', password: 'admin123' })
> })
> ```
> 
> **Paso 2 - Express recibe la petición:**
> El servidor Express escucha en el puerto 3000 y recibe la petición POST en la ruta `/api/auth/login`
> 
> **Paso 3 - El router dirige al endpoint correcto:**
> En `server.js` tengo definido:
> ```javascript
> app.use('/api/auth', authRouter);
> ```
> Esto significa que cualquier petición a `/api/auth/*` se maneja en `api/auth.js`
> 
> **Paso 4 - Se ejecuta el código del endpoint:**
> ```javascript
> router.post('/login', async (req, res) => {
>   // 1. Extraigo username y password del body
>   const { username, password } = req.body;
>   
>   // 2. Busco el usuario en PostgreSQL
>   const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
>   
>   // 3. Verifico la contraseña con bcrypt
>   const valid = await bcrypt.compare(password, user.password_hash);
>   
>   // 4. Genero un token JWT
>   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
>   
>   // 5. Devuelvo la respuesta
>   res.json({ success: true, token, usuario: {...} });
> });
> ```
> 
> **Paso 5 - El frontend recibe la respuesta:**
> El frontend guarda el token en localStorage y lo usa en futuras peticiones."

### 3. Seguridad - JWT y bcrypt

**Pregunta:** "¿Cómo manejas la seguridad?"

**Respuesta:**
> "Implementé dos capas principales de seguridad:
> 
> **1. Encriptación de contraseñas con bcrypt:**
> - Nunca guardo contraseñas en texto plano
> - Uso bcrypt que es un algoritmo de hashing de un solo sentido
> - Cuando el usuario se registra: `bcrypt.hash('password123', 10)` genera algo como `$2b$10$abc...xyz`
> - Es imposible revertirlo para obtener la contraseña original
> - Al verificar: `bcrypt.compare('password123', hash)` devuelve true/false
> 
> **2. Autenticación con JWT (JSON Web Tokens):**
> - Después del login, genero un token firmado digitalmente
> - El token contiene información del usuario (id, username, roles, permisos)
> - Está firmado con una clave secreta que solo el servidor conoce
> - El token expira en 24 horas
> - En cada petición protegida, verifico el token:
>   ```javascript
>   const token = req.headers.authorization.split(' ')[1];
>   const decoded = jwt.verify(token, JWT_SECRET);
>   // Si el token es válido, decoded contiene los datos del usuario
>   ```
> - Esto me permite saber quién es el usuario sin hacer login cada vez
> 
> **3. Middleware de autenticación:**
> - Creé un middleware que verifica el token antes de ejecutar endpoints protegidos
> - Si el token no es válido o no existe, devuelvo 401 Unauthorized
> - Esto protege endpoints como crear/editar/eliminar productos"

### 4. Base de Datos PostgreSQL

**Pregunta:** "¿Cómo manejas la base de datos?"

**Respuesta:**
> "Uso PostgreSQL, que es una base de datos relacional muy robusta.
> 
> **Conexión:**
> - Uso el paquete `pg` (node-postgres) para conectarme
> - La conexión está en `db/connection.js`
> - Uso connection pooling para manejar múltiples peticiones simultáneas
> - El connection string lo leo de las variables de entorno por seguridad
> 
> **Schema de la base de datos:**
> Tengo 8 tablas principales:
> 
> 1. **users**: Usuarios del sistema (vendedores/admin)
> 2. **roles**: Roles como 'admin', 'vendedor'
> 3. **permisos**: Permisos como 'ver_ventas', 'gestionar_productos'
> 4. **user_roles**: Relaciona usuarios con roles (muchos a muchos)
> 5. **role_permisos**: Relaciona roles con permisos (muchos a muchos)
> 6. **productos**: Catálogo de productos
> 7. **compras**: Registro de ventas/órdenes
> 8. **detalle_compra**: Productos incluidos en cada compra
> 
> **Ejemplo de consulta con JOIN:**
> ```sql
> SELECT p.nombre, dc.cantidad, dc.subtotal
> FROM compras c
> JOIN detalle_compra dc ON c.id = dc.compra_id
> JOIN productos p ON dc.producto_id = p.id
> WHERE c.id = $1
> ```
> 
> **Prevención de SQL Injection:**
> - Siempre uso queries parametrizados ($1, $2, etc.)
> - Nunca concateno strings directamente en las queries
> - PostgreSQL escapa automáticamente los valores
> - Ejemplo CORRECTO: `pool.query('SELECT * FROM users WHERE id = $1', [userId])`
> - Ejemplo INCORRECTO: `pool.query('SELECT * FROM users WHERE id = ' + userId)` ❌"

### 5. CRUD de Productos

**Pregunta:** "Explícame cómo funciona el CRUD de productos"

**Respuesta:**
> "CRUD significa Create, Read, Update, Delete. Son las 4 operaciones básicas en una base de datos.
> 
> **CREATE (POST /api/productos):**
> ```javascript
> router.post('/', verificarAuth, async (req, res) => {
>   // 1. Verifico que el usuario tenga permiso 'gestionar_productos'
>   if (!req.permisos.includes('gestionar_productos')) {
>     return res.status(403).json({ mensaje: 'No autorizado' });
>   }
>   
>   // 2. Extraigo los datos del producto
>   const { nombre, precio, stock, categoria } = req.body;
>   
>   // 3. Inserto en la base de datos
>   const result = await pool.query(
>     'INSERT INTO productos (nombre, precio, stock, categoria) VALUES ($1, $2, $3, $4) RETURNING *',
>     [nombre, precio, stock, categoria]
>   );
>   
>   // 4. Devuelvo el producto creado
>   res.json({ success: true, producto: result.rows[0] });
> });
> ```
> 
> **READ (GET /api/productos):**
> - Sin autenticación (endpoint público)
> - Devuelve todos los productos disponibles
> - Usado por el menú del frontend
> 
> **UPDATE (PUT /api/productos/:id):**
> - Requiere autenticación y permiso
> - Actualiza un producto existente
> - Uso RETURNING * para devolver el producto actualizado
> 
> **DELETE (DELETE /api/productos/:id):**
> - Requiere autenticación y permiso
> - Es un 'soft delete': marco el producto como no disponible
> - No lo elimino físicamente para mantener el historial
> - `UPDATE productos SET disponible = false WHERE id = $1`"

### 6. Manejo de Archivos (Upload de Comprobantes)

**Pregunta:** "¿Cómo manejas la subida de archivos?"

**Respuesta:**
> "Uso multer, un middleware de Node.js especializado en multipart/form-data.
> 
> **Configuración:**
> ```javascript
> const multer = require('multer');
> const storage = multer.diskStorage({
>   destination: function (req, file, cb) {
>     cb(null, 'public/uploads/') // Carpeta donde se guardan
>   },
>   filename: function (req, file, cb) {
>     // Genero un nombre único: timestamp + nombre original
>     cb(null, Date.now() + '-' + file.originalname);
>   }
> });
> 
> const upload = multer({
>   storage: storage,
>   limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
>   fileFilter: (req, file, cb) => {
>     // Solo acepto imágenes y PDFs
>     if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
>       cb(null, true);
>     } else {
>       cb(new Error('Solo se permiten imágenes y PDFs'));
>     }
>   }
> });
> ```
> 
> **Uso en el endpoint:**
> ```javascript
> router.post('/compras', upload.single('comprobante'), async (req, res) => {
>   const comprobante_url = req.file ? `/uploads/${req.file.filename}` : null;
>   // Guardo la URL en la base de datos
> });
> ```"

### 7. Transacciones en PostgreSQL

**Pregunta:** "¿Qué pasa si se cae el servidor mientras procesas una compra?"

**Respuesta:**
> "Para evitar inconsistencias, uso transacciones de PostgreSQL. Una transacción es como un todo o nada: o se ejecutan TODAS las queries o NINGUNA.
> 
> **Ejemplo al crear una compra:**
> ```javascript
> // Inicio la transacción
> await pool.query('BEGIN');
> 
> try {
>   // 1. Creo la compra
>   const compra = await pool.query('INSERT INTO compras (...) VALUES (...) RETURNING *');
>   
>   // 2. Inserto cada producto del carrito
>   for (let item of carrito) {
>     await pool.query('INSERT INTO detalle_compra (...) VALUES (...)');
>     
>     // 3. Actualizo el stock
>     await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [cantidad, id]);
>   }
>   
>   // Si todo salió bien, confirmo la transacción
>   await pool.query('COMMIT');
>   
> } catch (error) {
>   // Si algo falló, revierto TODOS los cambios
>   await pool.query('ROLLBACK');
>   throw error;
> }
> ```
> 
> Esto garantiza que si falla al actualizar el stock, no se crea la compra. Todo o nada."

---

## FRONTEND

### 1. React con TypeScript

**Pregunta:** "¿Por qué usaste React y TypeScript?"

**Respuesta:**
> "React porque es el framework más usado actualmente y facilita crear interfaces dinámicas con componentes reutilizables. TypeScript porque agrega tipos a JavaScript, lo que me ayuda a detectar errores antes de ejecutar el código.
> 
> **Ventajas que usé:**
> - **Componentes**: Cada parte de la UI es un componente reutilizable
> - **Hooks**: useState para manejar estado, useEffect para efectos secundarios
> - **Context API**: Para compartir estado global (carrito y autenticación)
> - **React Router**: Para la navegación entre páginas sin recargar"

### 2. Gestión de Estado

**Pregunta:** "¿Cómo manejas el estado de la aplicación?"

**Respuesta:**
> "Uso dos enfoques:
> 
> **1. Estado local con useState:**
> Para datos que solo usa un componente
> ```javascript
> const [products, setProducts] = useState([]);
> ```
> 
> **2. Estado global con Context API:**
> Para datos que necesitan múltiples componentes:
> - CartContext: Estado del carrito (productos, cantidad, total)
> - AuthContext: Usuario autenticado y sus permisos
> 
> Ejemplo del CartContext:
> ```javascript
> const CartContext = createContext();
> 
> function CartProvider({ children }) {
>   const [cart, setCart] = useState([]);
>   
>   const addToCart = (product) => {
>     // Lógica para agregar al carrito
>   };
>   
>   return (
>     <CartContext.Provider value={{ cart, addToCart }}>
>       {children}
>     </CartContext.Provider>
>   );
> }
> ```"

---

## BASE DE DATOS

### Schema Completo

```
users (usuarios del sistema)
├── id (PK)
├── username
├── password_hash
├── email
├── nombre_completo
└── activo

roles
├── id (PK)
├── nombre (admin, vendedor)
└── descripcion

permisos
├── id (PK)
├── nombre (ver_ventas, gestionar_productos, etc.)
└── descripcion

user_roles (muchos a muchos)
├── user_id (FK -> users)
└── role_id (FK -> roles)

role_permisos (muchos a muchos)
├── role_id (FK -> roles)
└── permiso_id (FK -> permisos)

productos
├── id (PK)
├── nombre
├── descripcion
├── precio
├── stock
├── categoria (merienda/cena)
├── imagen_url
└── disponible

compras
├── id (PK)
├── numero_orden (SH-timestamp)
├── numero_mesa
├── total
├── metodo_pago
├── comprobante_url
└── fecha_creacion

detalle_compra
├── id (PK)
├── compra_id (FK -> compras)
├── producto_id (FK -> productos)
├── cantidad
├── precio_unitario
└── subtotal
```

---

## PREGUNTAS QUE TE PUEDEN HACER

### 1. "¿Qué es REST y por qué lo usaste?"

> "REST (Representational State Transfer) es un estilo de arquitectura para APIs. Define cómo deben ser los endpoints:
> 
> - **GET**: Para obtener datos (ej: GET /api/productos)
> - **POST**: Para crear datos (ej: POST /api/productos)
> - **PUT**: Para actualizar datos (ej: PUT /api/productos/5)
> - **DELETE**: Para eliminar datos (ej: DELETE /api/productos/5)
> 
> Lo usé porque es el estándar de la industria, es stateless (cada petición es independiente) y es fácil de entender y mantener."

### 2. "¿Qué harías diferente si tuvieras más tiempo?"

> "Varias cosas:
> 1. Agregar tests unitarios y de integración (con Jest)
> 2. Implementar caché con Redis para mejorar performance
> 3. Agregar WebSockets para actualizar ventas en tiempo real
> 4. Mejorar el manejo de errores con un logger profesional (Winston)
> 5. Agregar paginación en el listado de productos y ventas
> 6. Implementar rate limiting para prevenir ataques de fuerza bruta"

### 3. "¿Cómo escalarías este proyecto?"

> "Para escalar la aplicación:
> 1. **Backend**: Usar un load balancer (nginx) con múltiples instancias de Node.js
> 2. **Base de datos**: Replicación master-slave de PostgreSQL, índices optimizados
> 3. **Frontend**: CDN para servir archivos estáticos (Cloudflare)
> 4. **Cache**: Redis para cachear queries frecuentes
> 5. **Monitoreo**: Implementar logs centralizados y métricas (DataDog, New Relic)
> 6. **Containerización**: Docker + Kubernetes para deployment automatizado"

### 4. "¿Qué pasa si dos usuarios compran el último producto al mismo tiempo?"

> "Esto se llama 'race condition'. Mi solución:
> 
> 1. **Transacciones con lock**: Uso `SELECT ... FOR UPDATE` en PostgreSQL
>    ```sql
>    BEGIN;
>    SELECT stock FROM productos WHERE id = $1 FOR UPDATE;
>    -- Esto bloquea la fila hasta que termine la transacción
>    UPDATE productos SET stock = stock - 1 WHERE id = $1 AND stock > 0;
>    COMMIT;
>    ```
> 
> 2. **Validación antes de confirmar**: Verifico el stock dentro de la transacción
>    ```javascript
>    if (producto.stock < cantidad) {
>      await pool.query('ROLLBACK');
>      return res.status(400).json({ mensaje: 'Stock insuficiente' });
>    }
>    ```"

### 5. "¿Cómo manejas los errores?"

> "Tengo varias capas:
> 
> 1. **Try-catch en cada endpoint**: Capturo errores y respondo apropiadamente
> 2. **Middleware de errores global**: En server.js, un middleware que atrapa todos los errores no manejados
> 3. **Códigos HTTP correctos**:
>    - 200: Éxito
>    - 400: Error del cliente (datos inválidos)
>    - 401: No autenticado
>    - 403: No autorizado (sin permisos)
>    - 404: No encontrado
>    - 500: Error del servidor
> 4. **Logs**: Uso console.error para registrar errores (en producción usaría Winston)
> 5. **Mensajes claros**: Devuelvo mensajes descriptivos al frontend"

---

## CONSEJOS FINALES

### Durante la Defensa:

1. **Sé honesto**: Si no sabes algo, di "No lo implementé, pero si tuviera que hacerlo, investigaría X o Y"

2. **Demuestra que entiendes**: No memorices, explica con tus palabras. Usa analogías.

3. **Muestra el código**: Abre los archivos y señala las partes importantes mientras explicas.

4. **Habla de desafíos**: "Lo más difícil fue entender JWT, pero después de leer la documentación y hacer pruebas..."

5. **Conecta con el mundo real**: "Esto es similar a cómo funciona el login de Netflix/Instagram/etc."

### Frases útiles:

- "Te lo explico con un ejemplo..."
- "La razón por la que elegí X es porque..."
- "Si miramos este código, podemos ver que..."
- "Esto sigue el patrón estándar de..."
- "Una alternativa que consideré fue X, pero elegí Y porque..."

### Si te bloqueas:

- "Dame un segundo para organizar mis ideas..."
- "Déjame mostrarte en el código, es más fácil..."
- "¿Puedo explicarte primero cómo funciona en general y después vemos los detalles?"

---

## ESTRUCTURA DE LA DEFENSA RECOMENDADA

**1. Introducción (1-2 min)**
- Qué es el proyecto
- Stack tecnológico
- Funcionalidades principales

**2. Demo en vivo (3-4 min)**
- Mostrar el sitio funcionando
- Hacer una compra completa
- Mostrar el panel de admin

**3. Explicación del código (8-10 min)**
- **Backend primero** (lo más importante):
  - Arquitectura general
  - Flujo de una petición
  - Autenticación y seguridad
  - Base de datos
- Frontend:
  - Componentes principales
  - Estado global
- Database:
  - Schema
  - Relaciones

**4. Preguntas y respuestas (5-10 min)**
- Responde con confianza
- Si no sabes, di cómo lo resolverías

---

## 🎯 ÚLTIMO CONSEJO

**Practica explicarlo en voz alta** varias veces antes de la defensa. Grábate en video o explícale a alguien. Esto te ayudará a:
- Identificar partes que no entiendes bien
- Mejorar tu claridad
- Reducir nervios
- Manejar mejor los tiempos

**¡Mucha suerte! 🚀 Hiciste un gran proyecto.**
