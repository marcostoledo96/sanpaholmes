# 🚀 Guía de Deploy en Vercel - SanpaHolmes

## ⚠️ IMPORTANTE: Este es un proyecto Full-Stack

Este proyecto combina:
- **Frontend:** React + Vite (carpeta `src/`)
- **Backend:** Node.js + Express (`server.js`)
- **Base de datos:** PostgreSQL en Neon (ya configurada)

---

## 📋 Pre-requisitos

Antes de hacer el deploy, asegurate de que:

✅ Tu proyecto esté en GitHub  
✅ Tengas cuenta en [Vercel](https://vercel.com)  
✅ La base de datos Neon esté funcionando (ya la tenés configurada)  
✅ Hayas probado el proyecto localmente

---

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Verificar archivos críticos

Asegurate de que estos archivos estén correctos:

**1. `vercel.json` (ya está corregido):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/uploads/(.*)", "dest": "/server.js" },
    { "src": "/assets/(.*)", "dest": "/dist/assets/$1" },
    { "src": "/images/(.*)", "dest": "/dist/images/$1" },
    { "src": "/(.*)", "dest": "/dist/index.html" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**2. `package.json` debe tener estos scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "tsc && vite build",
    "dev": "vite"
  }
}
```

### Paso 2: Subir a GitHub (si aún no lo hiciste)

```powershell
git init
git add .
git commit -m "Deploy: SanpaHolmes Full-Stack"
git branch -M main
git remote add origin https://github.com/tu-usuario/sanpaholmes.git
git push -u origin main
```

### Paso 3: Conectar con Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona tu repositorio `sanpaholmes`
4. **Framework Preset:** Déjalo en "Other" o "Vite"
5. **Root Directory:** Déjalo en `.` (raíz)

### Paso 4: Configurar Variables de Entorno

**MUY IMPORTANTE:** En Vercel, ve a **Settings** → **Environment Variables** y agrega:

| Variable | Valor | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_UI1cJxXKOG2u@ep-young-thunder-a4t6hx3f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Production, Preview, Development |
| `JWT_SECRET` | `sanpaholmes-secret-key-2025-production` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

**Pasos:**
1. Hacé clic en **"Add New"**
2. Pegá el nombre de la variable (por ejemplo: `DATABASE_URL`)
3. Pegá el valor
4. Seleccioná **Production, Preview, Development** (todos)
5. Click en **"Save"**
6. Repetí para cada variable

### Paso 5: Build Settings (Configuración de Construcción)

Vercel debería detectar automáticamente, pero verifica que tenga:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Paso 6: Deploy

1. Click en **"Deploy"**
2. Esperá 2-5 minutos mientras Vercel:
   - Instala dependencias
   - Construye el frontend (React + Vite)
   - Configura el backend (Node.js)
3. Si todo está bien, verás: **"🎉 Deployment Ready"**

### Paso 7: Verificar que funciona

Una vez deployado, probá estas URLs:

**Frontend:**
```
https://tu-proyecto.vercel.app
```

**Backend API:**
```
https://tu-proyecto.vercel.app/api/health
https://tu-proyecto.vercel.app/api/productos
```

Si `/api/health` devuelve `{ "status": "ok" }`, ¡todo funciona! ✅

---

## Opción 2: Deploy desde la terminal (Vercel CLI)

### Paso 1: Instalar Vercel CLI

```powershell
npm install -g vercel
```

### Paso 2: Login

```powershell
vercel login
```

### Paso 3: Deploy

```powershell
vercel
```

Cuando te pregunte:

- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `sanpaholmes-carrito`
- **In which directory is your code located?** → `./` (presiona Enter)

### Paso 4: Configurar Variables de Entorno

```powershell
vercel env add DATABASE_URL production
```
*Pega la URL de Neon cuando te lo pida*

```powershell
vercel env add JWT_SECRET production
```
*Ingresa: `sanpaholmes-secret-key-2025-production`*

```powershell
vercel env add NODE_ENV production
```
*Ingresa: `production`*

### Paso 5: Deploy a Producción

```powershell
vercel --prod
```

---

## 🔧 Solución de Problemas Comunes

### ❌ Error: "Invalid vercel.json file provided"

**Causa:** El archivo `vercel.json` tenía comentarios (JSON no permite comentarios)

**Solución:** Ya está corregido. El archivo ahora es JSON puro sin comentarios.

### ❌ Error: "Cannot find module"

**Causa:** Falta instalar dependencias en Vercel

**Solución:** 
1. Vercel → Settings → General
2. Verifica que "Install Command" sea `npm install`
3. Haz un nuevo deploy

### ❌ Error: "Build failed"

**Causa:** Error en el build de Vite o TypeScript

**Solución:**
1. Probá localmente: `npm run build`
2. Corregí los errores que aparezcan
3. Commitea y pusheá los cambios
4. Vercel redesplegará automáticamente

### ❌ Error: "Cannot connect to database"

**Causa:** Variables de entorno mal configuradas

**Solución:**
1. Vercel → Settings → Environment Variables
2. Verificá que `DATABASE_URL` esté completa y correcta
3. Asegurate de que está seleccionada en **Production, Preview, Development**
4. Redeploy desde Vercel → Deployments → ... → Redeploy

### ❌ Error: "404 on /api/productos"

**Causa:** El routing del backend no está funcionando

**Solución:**
1. Verificá que `vercel.json` tenga la ruta correcta:
   ```json
   { "src": "/api/(.*)", "dest": "/server.js" }
   ```
2. Asegurate de que `server.js` esté en la raíz del proyecto
3. Redeploy

### ❌ Error: "404 NOT_FOUND" en rutas como /menu, /cart, etc.

**Causa:** El routing de React Router no está configurado correctamente para SPA

**Solución:**
Ya está corregido en `vercel.json`. Todas las rutas del frontend ahora apuntan a `/dist/index.html` para que React Router maneje la navegación:
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/assets/(.*)", "dest": "/dist/assets/$1" },
    { "src": "/images/(.*)", "dest": "/dist/images/$1" },
    { "src": "/(.*)", "dest": "/dist/index.html" }
  ]
}
```

### ❌ Las imágenes no se ven

**Causa:** Las rutas de imágenes apuntan a `localhost`

**Solución:**
Las imágenes en `public/images/` deberían funcionar automáticamente. Si no:
1. Verifica que las rutas en el código sean relativas: `/images/trebol.png`
2. NO uses `http://localhost:5173/images/...`

### ❌ Error: "Function exceeded timeout"

**Causa:** Una función tarda más de 10 segundos

**Solución:**
Ya está configurado en `vercel.json`:
```json
"functions": {
  "server.js": {
    "maxDuration": 10,
    "memory": 1024
  }
}
```

Si necesitas más tiempo (requiere plan Pro):
- Cambia `maxDuration` a `60` o más

---

## ✅ Verificar que Todo Funciona

### 1. Frontend

```
https://tu-proyecto.vercel.app
```

Deberías ver:
- ✅ Landing page con tréboles y escudos
- ✅ Botón "Ver Menú y Hacer Pedido"
- ✅ Footer con información del evento

### 2. Backend - Health Check

```
https://tu-proyecto.vercel.app/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-14T..."
}
```

### 3. Productos

```
https://tu-proyecto.vercel.app/api/productos
```

Debería devolver un JSON con la lista de productos.

### 4. Login de Admin

```
POST https://tu-proyecto.vercel.app/api/auth/login
Body: { "username": "admin", "password": "admin123" }
```

Debería devolver:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": 1, "username": "admin", ... }
}
```

### 5. Panel de Administración

```
https://tu-proyecto.vercel.app/vendor/login
```

- Ingresa: `admin` / `admin123`
- Deberías ver el panel con productos y ventas

---

## 🎯 URLs Importantes

Después del deploy, tendrás estas URLs:

| Tipo | URL | Descripción |
|------|-----|-------------|
| **Landing** | `https://sanpaholmes.vercel.app` | Página principal pública |
| **Menú** | `https://sanpaholmes.vercel.app/menu` | Menú de productos |
| **Carrito** | `https://sanpaholmes.vercel.app/cart` | Carrito de compras |
| **Checkout** | `https://sanpaholmes.vercel.app/checkout` | Formulario de compra |
| **Admin Login** | `https://sanpaholmes.vercel.app/vendor/login` | Login de administrador |
| **Admin Panel** | `https://sanpaholmes.vercel.app/vendor/panel` | Panel de gestión |
| **API Health** | `https://sanpaholmes.vercel.app/api/health` | Status del backend |
| **API Productos** | `https://sanpaholmes.vercel.app/api/productos` | Lista de productos |
| **API Compras** | `https://sanpaholmes.vercel.app/api/compras` | Gestión de compras |

---

## 📱 Compartir con el Equipo

Una vez deployado:

1. **Compartí el link principal:**
   ```
   https://sanpaholmes.vercel.app
   ```

2. **Credenciales de admin:**
   ```
   Usuario: admin
   Contraseña: admin123
   ```

3. **QR Code:**
   - Ve a Vercel Dashboard → tu proyecto
   - Click en "Domains"
   - Genera un QR code para compartir fácilmente

---

## 🔒 Seguridad

### Cambiar Contraseña de Admin (IMPORTANTE)

Después del primer deploy, cambia la contraseña:

1. Conectate a tu base de datos Neon
2. Ejecuta:
   ```sql
   UPDATE usuarios 
   SET password = '$2b$10$NUEVA_CONTRASEÑA_HASHEADA' 
   WHERE username = 'admin';
   ```

O desde tu panel de admin, agrega una función para cambiar contraseña.

### Variables de Entorno Seguras

- ✅ **NUNCA** subas `.env` a GitHub
- ✅ Las variables en Vercel están encriptadas
- ✅ Cambia `JWT_SECRET` en producción por algo único

---

## 💾 Archivos de Comprobantes

**⚠️ LIMITACIÓN:** Vercel es serverless, NO guarda archivos entre deploys.

**Soluciones:**

### Opción 1: Cloudinary (Recomendado - Gratis)

1. Crea cuenta en [cloudinary.com](https://cloudinary.com)
2. Instala: `npm install cloudinary`
3. Modifica `api/compras.js` para usar Cloudinary en vez de `multer`

### Opción 2: AWS S3

Requiere configuración de bucket S3.

### Opción 3: Vercel Blob (Nuevo servicio de Vercel)

```powershell
npm install @vercel/blob
```

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

**Desde Vercel Dashboard:**
1. Deployments → [tu deploy] → Logs

**Desde CLI:**
```powershell
vercel logs --follow
```

### Analytics

Vercel automáticamente te da:
- Número de visitas
- Tiempo de carga
- Errores 404/500
- Ubicación geográfica de usuarios

---

## 🔄 Actualizar el Proyecto

### Método 1: Push a GitHub (Automático)

```powershell
git add .
git commit -m "Update: descripción de cambios"
git push
```

Vercel detecta el push y redespliega automáticamente.

### Método 2: Deploy Manual

```powershell
vercel --prod
```

---

## 📝 Comandos Útiles de Vercel CLI

```powershell
# Ver información del proyecto
vercel inspect

# Ver logs en tiempo real
vercel logs --follow

# Listar todos los deploys
vercel list

# Eliminar un deploy específico
vercel remove [deployment-url]

# Ver dominios configurados
vercel domains ls

# Agregar variable de entorno
vercel env add VARIABLE_NAME production

# Ver variables de entorno
vercel env ls
```

---

## 🌐 Dominios Personalizados (Opcional)

Si querés usar tu propio dominio:

1. **Compra un dominio** (Namecheap, GoDaddy, etc.)
2. **En Vercel:**
   - Settings → Domains
   - Click en "Add"
   - Ingresa tu dominio: `sanpaholmes.com`
3. **Configura DNS:**
   - Ve a tu proveedor de dominio
   - Agrega estos records:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
4. Espera 24-48 horas para propagación

---

## 🎉 ¡Listo!

Tu proyecto está en producción en:
```
https://sanpaholmes.vercel.app
```

**Compartilo con tu equipo y empezá a usarlo! 🚀**

---

## 📞 Soporte

**Problemas con Vercel:**
- [Documentación oficial](https://vercel.com/docs)
- [Discord de Vercel](https://vercel.com/discord)
- [GitHub Issues](https://github.com/vercel/vercel/issues)

**Problemas con el código:**
1. Revisa los logs en Vercel
2. Prueba localmente: `npm run dev` y `npm start`
3. Verifica las variables de entorno
4. Consulta `CAMPO_DETALLES_IMPLEMENTADO.md` para features recientes

---

**Última actualización:** 14 de noviembre de 2025  
**Proyecto:** SanpaHolmes - Sistema de Pedidos Evento Scout 2025  
**Stack:** React + Vite + Node.js + Express + PostgreSQL (Neon)
