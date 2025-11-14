# SanpaHolmes - Sistema de Carrito de Compras

Sistema completo de pedidos online para el evento Scout SanpaHolmes 2024, desarrollado con Node.js, Express, PostgreSQL y React.

---

## Descripción del Proyecto

Aplicación web full-stack que permite a los participantes del evento realizar pedidos de comida de forma digital, y a los organizadores gestionar productos y visualizar ventas en tiempo real.

### Funcionalidades Principales

**Para Clientes (sin registro necesario):**
- Visualizar menú de productos con categorías (merienda/cena)
- Agregar productos al carrito con control de cantidades
- Realizar checkout indicando mesa y método de pago
- Subir comprobante de pago (efectivo/transferencia)
- Recibir confirmación con número de orden único

**Para Administradores (requiere login):**
- Panel de control con dashboard completo
- **CRUD de productos**: Crear, editar, actualizar stock, eliminar
- **Visualización de ventas**: Historial completo con detalles
- Ver comprobantes de pago subidos
- Gestión en tiempo real del inventario

---

## Stack Tecnológico

### Backend
- **Node.js v18+** con Express 4.18
- **PostgreSQL** en Neon (cloud database)
- **JWT** (JsonWebToken) para autenticación
- **Bcrypt** para encriptación de contraseñas
- **Multer** para upload de archivos
- **CORS** habilitado para desarrollo local

### Frontend
- **React 18** con TypeScript
- **Vite 5** como build tool
- **Tailwind CSS** para estilos
- **React Router 6** para navegación
- **Radix UI** para componentes
- **Lucide Icons** + **Material Icons** de Google

### Base de Datos
- **PostgreSQL** (8 tablas relacionales)
- **Connection pooling** para optimización
- **Transacciones** para integridad de datos
- **Soft deletes** para mantener historial

---

## Acceso al Panel de Administración

### Cómo Ingresar como Admin

1. **Iniciar la aplicación** (ambos servidores deben estar corriendo):
   ```bash
   # Terminal 1 - Backend
   npm run backend

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Abrir el navegador** en: `http://localhost:5174`

3. **Hacer clic** en el botón "Panel Vendedor" en la barra de navegación superior

4. **Credenciales de acceso**:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`

### Funciones Disponibles en el Panel

Una vez dentro, podrás:

**Pestaña "Ventas":**
- Ver listado completo de todas las compras realizadas
- Detalles de cada orden (productos, cantidades, total)
- Método de pago y número de mesa
- Descargar comprobantes de pago
- Total recaudado

**Pestaña "Productos":**
- **Crear nuevo producto**: Click en botón "Nuevo Producto"
  - Nombre, descripción, precio, stock
  - Categoría (merienda/cena)
  - URL de imagen (opcional)
  - Disponibilidad on/off
- **Editar producto existente**: Botón "Editar" en cada tarjeta
  - Actualizar cualquier campo
  - Modificar stock disponible
- **Eliminar producto**: Botón "Eliminar"
  - Soft delete (no se borra físicamente)
  - Se marca como "no disponible"
- **Ver stock en tiempo real**

---

## Instalación y Configuración

### Requisitos Previos
- Node.js v18 o superior
- npm (incluido con Node.js)
- Git (opcional, para clonar)

### Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias (514 paquetes):
- Backend: express, pg, bcrypt, jsonwebtoken, cors, multer, dotenv
- Frontend: react, react-dom, react-router-dom, lucide-react, radix-ui, tailwindcss

### Paso 2: Variables de Entorno

El proyecto ya viene con un archivo `.env` configurado con la conexión a PostgreSQL en Neon (cloud).

Si necesitas verificarlo:

```env
DATABASE_URL=postgresql://neondb_owner:npg_UI1cJxXKOG2u@ep-young-thunder-a4t6hx3f-pooler.us-east-1.aws.neon.tech/neondb
JWT_SECRET=sanpaholmes-secret-key-2025
PORT=3000
```

### Paso 3: Inicializar Base de Datos

**IMPORTANTE**: Este paso solo se hace una vez.

```bash
npm run init-db
```

Este comando:
- Crea las 8 tablas necesarias (users, roles, permisos, productos, compras, etc.)
- Crea el usuario admin con password encriptado
- Carga 30 productos de ejemplo con imágenes
- Configura roles y permisos

Deberías ver en consola:
```
✅ Tablas creadas exitosamente
✅ Usuario admin creado
✅ Roles y permisos configurados
✅ 30 productos insertados
```

### Paso 4: Iniciar Servidores

**Necesitas DOS terminales abiertas:**

**Terminal 1 - Backend API (puerto 3000):**
```bash
npm run backend
```

Verás:
```
🚀 Servidor corriendo en http://localhost:3000
📋 API Health: http://localhost:3000/api/health
```

**Terminal 2 - Frontend React (puerto 5174):**
```bash
npm run dev
```

Verás:
```
VITE v5.4.21  ready in 293 ms
➜  Local:   http://localhost:5174/
```

### Paso 5: Abrir en el Navegador

Ir a: **http://localhost:5174**

---

## Estructura del Proyecto

```
sanpaholmes_carrito-final/
│
├── api/                          # Backend - Endpoints REST
│   ├── auth.js                   # Login y autenticación JWT
│   ├── productos.js              # CRUD de productos
│   └── compras.js                # Registro de ventas
│
├── middleware/                   # Middlewares de Express
│   └── auth.js                   # Verificación de token y permisos
│
├── db/                          # Base de datos
│   ├── connection.js            # Configuración PostgreSQL
│   ├── init.js                  # Script de inicialización
│   ├── test-connection.js       # Test de conexión
│   └── reset.js                 # Reset completo de DB
│
├── src/                         # Frontend React
│   ├── components/              # Componentes UI
│   │   ├── AdminPanelNew.tsx    # Panel admin con CRUD
│   │   ├── Menu.tsx             # Catálogo de productos
│   │   ├── Cart.tsx             # Carrito de compras
│   │   ├── Checkout.tsx         # Proceso de pago
│   │   └── VendorLogin.tsx      # Login de admin
│   ├── context/                 # Estado global
│   │   ├── CartContext.tsx      # Estado del carrito
│   │   └── AuthContext.tsx      # Estado de autenticación
│   ├── styles/                  # CSS
│   │   └── globals.css          # Estilos Tailwind
│   └── main.tsx                 # Entry point React
│
├── public/
│   └── uploads/                 # Comprobantes subidos
│
├── server.js                    # Servidor Express principal
├── package.json                 # Dependencias
├── vite.config.ts              # Configuración Vite
├── tailwind.config.js          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
│
└── Documentación/
    ├── README.md                # Este archivo
    ├── API.md                   # Documentación de endpoints
    ├── GUIA_DEFENSA_ORAL.md    # Guía para defender el proyecto
    ├── SOLUCION_ERRORES.md     # Log de correcciones
    ├── DEPLOY.md                # Guía de deployment
    └── COMO_INICIAR.md          # Inicio rápido
```

---

## Comandos Disponibles

### Desarrollo
```bash
npm run backend        # Iniciar API Express (puerto 3000)
npm run dev           # Iniciar frontend Vite (puerto 5174)
npm start             # Iniciar backend en modo producción
```

### Base de Datos
```bash
npm run init-db       # Crear tablas y datos iniciales
npm run test-db       # Probar conexión a PostgreSQL
npm run reset-db      # ⚠️ Eliminar TODO y reiniciar
```

### Build
```bash
npm run build         # Build de producción
npm run preview       # Preview del build
```

---

## API Endpoints

### Públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Ver detalle de un producto |
| POST | `/api/auth/login` | Iniciar sesión |

### Protegidos (requieren token JWT)

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/api/productos` | Crear producto | `gestionar_productos` |
| PUT | `/api/productos/:id` | Actualizar producto | `gestionar_productos` |
| DELETE | `/api/productos/:id` | Eliminar producto | `gestionar_productos` |
| GET | `/api/compras` | Ver ventas | `ver_ventas` |
| POST | `/api/compras` | Crear compra | - |
| GET | `/api/auth/me` | Datos del usuario actual | - |
| POST | `/api/auth/cambiar-password` | Cambiar contraseña | - |

**Documentación completa**: Ver `API.md`

---

## Base de Datos - Schema

### Tablas Principales

**users**: Usuarios del sistema (vendedores/admin)
```sql
- id (PK)
- username (único)
- password_hash (bcrypt)
- nombre_completo
- email
- activo (boolean)
```

**productos**: Catálogo de productos
```sql
- id (PK)
- nombre
- descripcion
- precio (numeric)
- stock (integer)
- categoria (merienda/cena)
- imagen_url
- disponible (boolean)
```

**compras**: Órdenes de compra
```sql
- id (PK)
- numero_orden (único, formato: SH-timestamp)
- numero_mesa
- total
- metodo_pago (efectivo/transferencia)
- comprobante_url
- fecha_creacion
```

**detalle_compra**: Items de cada compra
```sql
- id (PK)
- compra_id (FK -> compras)
- producto_id (FK -> productos)
- cantidad
- precio_unitario
- subtotal
```

### Sistema de Roles y Permisos

**roles**: Admin, Vendedor
```sql
- id (PK)
- nombre
- descripcion
```

**permisos**: Acciones permitidas
```sql
- id (PK)
- nombre (ver_ventas, gestionar_productos, etc.)
- descripcion
```

**Tablas de relación** (muchos a muchos):
- `user_roles`: Relaciona usuarios con roles
- `role_permisos`: Relaciona roles con permisos

---

## Seguridad Implementada

### Autenticación
- **JWT (JSON Web Tokens)**: Token firmado digitalmente con expiración de 24h
- **Bcrypt**: Hashing de contraseñas con salt rounds = 10
- **Middleware de autorización**: Verifica token en cada petición protegida

### Prevención de Ataques
- **SQL Injection**: Queries parametrizados ($1, $2, etc.)
- **XSS**: React escapa automáticamente el contenido
- **CORS**: Configurado para permitir solo origins específicos
- **Validación de datos**: En backend y frontend

### Manejo de Errores
- Try-catch en todos los endpoints
- Códigos HTTP apropiados (200, 400, 401, 403, 404, 500)
- Logs de errores en consola
- Mensajes de error descriptivos

---

## Guía para Defender el Proyecto

Si vas a presentar este proyecto, lee **GUIA_DEFENSA_ORAL.md** que incluye:

- Cómo explicar el backend paso a paso
- Explicación de JWT y bcrypt
- Cómo funcionan las transacciones en PostgreSQL
- Respuestas a preguntas frecuentes
- Consejos para la presentación oral
- Estructura recomendada de la defensa

**Es la guía más importante para entender TODO el proyecto.**

---

## Troubleshooting

### Error: Puerto en uso

```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5174).OwningProcess | Stop-Process
```

### Error: No conecta a la base de datos

```bash
npm run test-db
```

Si falla, verifica:
1. Que DATABASE_URL esté correcto en `.env`
2. Que tengas conexión a internet (Neon está en la nube)

### Error: "Usuario no encontrado" al hacer login

```bash
npm run init-db
```

Esto recreará el usuario admin.

### Error: Productos no aparecen

```bash
npm run init-db
```

Esto cargará los 30 productos de ejemplo.

### Para empezar desde cero

```bash
npm run reset-db
npm run init-db
```

⚠️ **CUIDADO**: Esto borra TODO y lo reinicia.

---

## Deploy a Producción

Ver guía completa en **DEPLOY.md**

Resumen:
1. Push a GitHub
2. Conectar con Vercel
3. Configurar variables de entorno
4. Deploy automático

La base de datos ya está en Neon (cloud), solo falta deployar el código.

---

## Tecnologías y Aprendizajes

Este proyecto me permitió aprender y aplicar:

### Backend
- Arquitectura de APIs REST con Express
- Autenticación y autorización con JWT
- Manejo de base de datos relacionales (PostgreSQL)
- Transacciones para integridad de datos
- Upload de archivos con Multer
- Middleware personalizado
- Manejo de errores profesional

### Frontend
- React Hooks (useState, useEffect, useContext)
- TypeScript para type safety
- Context API para estado global
- React Router para SPA
- Consumo de APIs REST con fetch
- Componentes reutilizables
- Tailwind CSS para diseño responsive

### DevOps
- Variables de entorno
- Scripts de NPM
- Deployment serverless en Vercel
- Git para control de versiones

---

## Créditos

**Desarrollado por**: Marcos
**Para**: Grupo Scout San Patricio - Evento SanpaHolmes 2024
**Fecha**: Noviembre 2025

---

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

## Soporte y Contacto

Si tenés dudas o problemas:

1. Revisá la documentación en la carpeta raíz:
   - `GUIA_DEFENSA_ORAL.md` - Explicación detallada de TODO
   - `API.md` - Endpoints y ejemplos
   - `SOLUCION_ERRORES.md` - Errores comunes

2. Verificá que ambos servidores estén corriendo

3. Revisá la consola del navegador (F12) para errores del frontend

4. Revisá la terminal del backend para errores de la API

---

**¡Proyecto completo y funcionando! 🚀**

Para cualquier pregunta sobre cómo explicar el código, lee **GUIA_DEFENSA_ORAL.md** donde está TODO explicado paso a paso.
