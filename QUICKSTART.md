# ⚡ Inicio Rápido - SanpaHolmes Backend

## 🚀 3 pasos para empezar

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar entorno
```bash
copy .env.example .env
```

### 3️⃣ Inicializar base de datos
```bash
npm run init-db
```

## ✅ Verificar instalación

```bash
# Probar conexión a la base de datos
npm run test-db

# Iniciar servidor
npm run dev
```

Abrí: `http://localhost:3000`

## 🔐 Credenciales por defecto

**Usuario admin:**
- Usuario: `admin`
- Contraseña: `admin123`

## 📡 Endpoints principales

### Públicos:
- `GET /api/productos` - Listar productos
- `POST /api/compras` - Crear compra

### Protegidos (requieren token):
- `POST /api/auth/login` - Login
- `GET /api/compras` - Listar ventas
- `POST /api/productos` - Crear producto

## 📚 Documentación completa

- **README.md** - Documentación completa
- **API.md** - Documentación de endpoints
- **DEPLOY.md** - Guía para deploy en Vercel
- **FRONTEND_INTEGRATION.md** - Ejemplos de integración

## 🎯 Estructura del proyecto

```
api/          → Endpoints (productos, compras, auth)
db/           → Conexión y scripts de BD
middleware/   → Autenticación y permisos
server.js     → Servidor Express principal
vercel.json   → Configuración para Vercel
```

## 🛠️ Comandos útiles

```bash
npm start           # Iniciar en producción
npm run dev         # Iniciar en desarrollo (con auto-reload)
npm run init-db     # Crear tablas y datos iniciales
npm run test-db     # Verificar conexión a BD
npm run reset-db    # Resetear BD (ELIMINA TODO)
```

## 🌐 Deploy en Vercel

```bash
vercel login
vercel
```

Ver guía completa en **DEPLOY.md**

## 💡 Importante

- ✅ Los compradores **NO** necesitan usuario
- ✅ El carrito **NO** permite eliminar productos manualmente
- ✅ El stock se descuenta automáticamente al confirmar compra
- ✅ Las contraseñas están encriptadas con bcrypt
- ✅ Los tokens JWT expiran en 24 horas

## 🆘 Ayuda

**Error al conectar a BD?**
```bash
npm run test-db
```

**¿Olvidaste la contraseña admin?**
```bash
npm run reset-db
npm run init-db
```

**¿No ves los productos?**
Verificá que ejecutaste `npm run init-db`

---

**¿Más dudas?** Leé el **README.md** completo 📖
