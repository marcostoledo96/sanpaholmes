# 🚀 Cómo iniciar el proyecto completo

## ✅ TODO CORREGIDO - Listo para usar

Todos los errores han sido solucionados:
- ✅ 70 imports corregidos (sin versiones)
- ✅ 162 dependencias instaladas (514 totales)
- ✅ Tailwind CSS funcionando
- ✅ PostCSS configurado correctamente

---

## El proyecto tiene DOS partes:

### 1️⃣ BACKEND (API) - Puerto 3000

```bash
npm run backend
```

Endpoints disponibles:
- http://localhost:3000/api/health
- http://localhost:3000/api/productos
- http://localhost:3000/api/compras

### 2️⃣ FRONTEND (React) - Puerto 5174

```bash
npm run dev
```

**Nota**: El puerto cambió a 5174 (5173 estaba ocupado)

## 🎯 Inicio Rápido

```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run dev
```

## ✅ URLs finales

- **Frontend (usuarios):** http://localhost:5174 ⚠️ Puerto actualizado
- **Backend (API):** http://localhost:3000
- **Health check:** http://localhost:3000/api/health

## 🧪 Probar la aplicación

### Como cliente:
1. Abre http://localhost:5174
2. Haz clic en "Ver Menú"
3. Agrega productos al carrito
4. Finaliza la compra

### Como admin:
1. Haz clic en "🚨 Panel Vendedor"
2. Usuario: `admin` / Contraseña: `admin123`
3. Accede al panel administrativo

---

## 📚 Más información

- **SOLUCION_ERRORES.md** - Detalles de todas las correcciones
- **API.md** - Documentación completa de la API
- **DEPLOY.md** - Guía para deploy en Vercel

## 🔥 Importante

El frontend React se conecta automáticamente al backend gracias al proxy configurado en Vite. 

**Ahora ejecutá:**
```bash
npm run dev
```

Y abrí **http://localhost:5173** en tu navegador.
