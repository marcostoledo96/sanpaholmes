# 🚀 Guía de Deploy en Vercel

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Subir el proyecto a GitHub

1. Creá un nuevo repositorio en GitHub
2. Desde la terminal en VS Code:

```bash
git init
git add .
git commit -m "Initial commit - SanpaHolmes Backend"
git branch -M main
git remote add origin [URL-de-tu-repositorio]
git push -u origin main
```

### Paso 2: Conectar con Vercel

1. Andá a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importá tu repositorio de GitHub
4. Vercel detecta automáticamente que es un proyecto Node.js

### Paso 3: Configurar variables de entorno

En la configuración del proyecto en Vercel, agregá estas variables:

```
DATABASE_URL = postgresql://neondb_owner:npg_UI1cJxXKOG2u@ep-young-thunder-a4t6hx3f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET = sanpaholmes-secret-key-2025-production

NODE_ENV = production
```

### Paso 4: Deploy

Click en "Deploy" y esperá a que termine.

### Paso 5: Inicializar la base de datos

Una vez deployado, ejecutá desde tu computadora:

```bash
node db/init.js
```

Esto crea las tablas y carga los datos iniciales en Neon.

---

## Opción 2: Deploy desde la terminal

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Loguearte

```bash
vercel login
```

### Paso 3: Deploy

Desde la carpeta del proyecto:

```bash
vercel
```

Seguí las instrucciones:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta
- **Link to existing project?** → No
- **What's your project's name?** → sanpaholmes-carrito
- **In which directory is your code located?** → ./

### Paso 4: Configurar variables de entorno

Después del primer deploy:

```bash
vercel env add DATABASE_URL
```

Pegá la URL de Neon cuando te lo pida.

```bash
vercel env add JWT_SECRET
```

Ingresá: `sanpaholmes-secret-key-2025-production`

```bash
vercel env add NODE_ENV
```

Ingresá: `production`

### Paso 5: Redeploy con las variables

```bash
vercel --prod
```

---

## ✅ Verificar que funciona

Una vez deployado, probá:

1. **Health check:**
   ```
   https://tu-proyecto.vercel.app/api/health
   ```

2. **Listar productos:**
   ```
   https://tu-proyecto.vercel.app/api/productos
   ```

3. **Login:**
   ```
   POST https://tu-proyecto.vercel.app/api/auth/login
   Body: { "username": "admin", "password": "admin123" }
   ```

---

## 🔧 Configuración adicional

### Dominios personalizados

Si querés usar tu propio dominio:

1. Desde el dashboard de Vercel → Settings → Domains
2. Agregá tu dominio
3. Seguí las instrucciones para configurar el DNS

### Logs y monitoreo

Para ver los logs en tiempo real:

```bash
vercel logs
```

O desde el dashboard de Vercel → Deployments → [tu deploy] → Logs

---

## ⚠️ Limitaciones del plan gratuito

- **Timeout:** 10 segundos por request
- **Memoria:** 1024 MB
- **Ancho de banda:** 100 GB/mes
- **Ejecuciones:** Ilimitadas

Para este proyecto, el plan gratuito es más que suficiente.

---

## 🐛 Solución de problemas

### Error: "Function exceeded timeout"

Aumentá el timeout en `vercel.json`:

```json
"functions": {
  "server.js": {
    "maxDuration": 10
  }
}
```

### Error: "Cannot connect to database"

Verificá que las variables de entorno estén configuradas correctamente en Vercel.

### Los archivos subidos no se guardan

Vercel es serverless, no guarda archivos entre ejecuciones. Para guardar comprobantes, considerá usar:
- **Cloudinary** (imágenes gratis)
- **AWS S3** (almacenamiento)
- **Vercel Blob** (nuevo servicio de Vercel)

---

## 📝 Comandos útiles

```bash
# Ver información del proyecto
vercel inspect

# Ver logs en tiempo real
vercel logs --follow

# Eliminar un deploy
vercel remove [deployment-url]

# Listar todos los deploys
vercel list
```

---

## 🎉 ¡Listo!

Tu proyecto está en producción. Compartí el link con tu equipo y empezá a usarlo.

**URL de ejemplo:**
```
https://sanpaholmes-carrito-abc123.vercel.app
```

---

## 📞 Soporte

Si tenés problemas:
1. Revisá los logs en Vercel
2. Verificá las variables de entorno
3. Probá localmente primero con `npm run dev`
