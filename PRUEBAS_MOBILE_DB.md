# 📱 Pruebas Exhaustivas Mobile - Base de Datos

## ✅ Cambios Implementados (Commit `3c4241b`)

### 1. **Timeouts Aumentados para Conexiones Móviles**
- ✅ `connectionTimeoutMillis`: 5s → **10s**
- ✅ `query_timeout`: **15s** (nuevo)
- ✅ `statement_timeout`: **15s** (nuevo)

### 2. **Health Check Mejorado**
- ✅ Ahora prueba la conexión real a la base de datos
- ✅ Retorna información de versión de PostgreSQL
- ✅ Manejo de errores detallado

---

## 🧪 PRUEBAS EXHAUSTIVAS - CHECKLIST

### 📡 1. Verificar Deploy en Vercel

**Esperar 2-3 minutos** para que Vercel despliegue el commit `3c4241b`

1. Ve a https://vercel.com/marcostoledo96/sanpaholmes/deployments
2. Verifica que el último deploy diga: **"Fix: Aumentar timeouts de DB y mejorar health check para móviles"**
3. Espera a que el status sea **"Ready"** ✅

---

### 🖥️ 2. Pruebas desde DESKTOP (Chrome DevTools en Modo Mobile)

#### 2.1. Health Check - Base de Datos

**URL:** `https://sanpaholmes.vercel.app/api/health`

**Respuesta esperada:**
```json
{
  "success": true,
  "mensaje": "✅ API y Base de Datos funcionando correctamente",
  "timestamp": "2025-11-14T...",
  "database": {
    "connected": true,
    "timestamp": "2025-11-14T...",
    "version": "PostgreSQL 17.x"
  },
  "environment": "production"
}
```

**Si falla:**
- ❌ `database.connected: false` → Problema de variables de entorno en Vercel
- ❌ Error 503 → Base de datos no responde
- ❌ Error 500 → Error de servidor

#### 2.2. Productos - Listar

**URL:** `https://sanpaholmes.vercel.app/api/productos`

**Respuesta esperada:**
```json
{
  "success": true,
  "productos": [
    {
      "id": 1,
      "nombre": "...",
      "precio": 500,
      "categoria": "comida",
      ...
    }
  ]
}
```

**Verificar:**
- ✅ Retorna array de productos
- ✅ Cada producto tiene: id, nombre, precio, categoria, subcategoria
- ✅ `activo: true` en todos

#### 2.3. Productos - Uno Específico

**URL:** `https://sanpaholmes.vercel.app/api/productos/1`

**Respuesta esperada:**
```json
{
  "success": true,
  "producto": {
    "id": 1,
    "nombre": "...",
    "precio": 500
  }
}
```

#### 2.4. Auth - Login Admin

**URL:** `https://sanpaholmes.vercel.app/api/auth/login`
**Método:** POST
**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "username": "admin",
    "nombre": "Administrador",
    "rol_id": 1
  }
}
```

**Verificar:**
- ✅ Retorna token JWT válido
- ✅ Usuario tiene rol_id: 1 (admin)

---

### 📱 3. Pruebas desde MÓVIL REAL

#### A. Preparación
1. Desconecta del WiFi (usa solo datos móviles 4G/5G)
2. Abre Chrome/Safari en el móvil
3. Ve a: `https://sanpaholmes.vercel.app`

#### B. Test 1: Landing Page
- ✅ Carga completamente (imágenes de tréboles y escudos)
- ✅ Botón "Ver Menú y Hacer Pedido" funciona
- ✅ No hay errores en la consola

#### C. Test 2: Menú (Conexión a DB)
1. Click en "Ver Menú y Hacer Pedido"
2. Deberías ver: `https://sanpaholmes.vercel.app/menu`

**Verificar:**
- ✅ Carga la lista de productos
- ✅ Se ven las imágenes de productos
- ✅ Los precios se muestran correctamente
- ✅ Puedes filtrar por categorías (Comida, Bebidas, Merchandising)
- ✅ NO aparece mensaje de error "No se pudieron cargar los productos"

**Si falla:**
- ⏱️ Si tarda más de 10 segundos → Ver error de timeout
- ❌ Si aparece "Error al cargar" → Abrir DevTools (Chrome Desktop Remote Debugging)

#### D. Test 3: Agregar al Carrito
1. En el menú, click en "+" en varios productos
2. Verifica el contador del carrito en el navbar

**Verificar:**
- ✅ Contador aumenta correctamente
- ✅ Se puede aumentar/disminuir cantidad

#### E. Test 4: Ver Carrito
1. Click en el ícono del carrito
2. Deberías ver: `https://sanpaholmes.vercel.app/cart`

**Verificar:**
- ✅ Muestra todos los productos agregados
- ✅ Calcula el total correctamente
- ✅ Botón "Proceder al Checkout" funciona

#### F. Test 5: Checkout (Escritura a DB)
1. Click en "Proceder al Checkout"
2. Completa el formulario:
   - Nombre: "Test Mobile"
   - Teléfono: "1234567890"
   - Mesa: "5"
   - Método de pago: "Efectivo"
3. Click en "Confirmar Pedido"

**Verificar:**
- ✅ Se crea la orden correctamente
- ✅ Redirige a `/order-confirmation`
- ✅ Muestra el número de orden
- ✅ El carrito se vacía

**Si falla:**
- ❌ Error "No se pudo procesar la compra" → Problema de conexión a DB
- ❌ Timeout → Aumentar más los timeouts en `db/connection.js`

#### G. Test 6: Login Admin desde Móvil
1. Ve a: `https://sanpaholmes.vercel.app/vendor/login`
2. Login: `admin` / `admin123`

**Verificar:**
- ✅ El fondo es 100% negro (no se ve la imagen de fondo)
- ✅ Login exitoso
- ✅ Redirige a `/vendor/panel`
- ✅ Se ven las órdenes creadas

#### H. Test 7: Panel Admin - Ver Ventas (Lectura de DB)
1. En el panel admin, ve a la pestaña "Ventas"
2. Deberías ver la orden que creaste en el Test 5

**Verificar:**
- ✅ Se muestran todas las órdenes
- ✅ Puedes expandir para ver detalles
- ✅ El total coincide con lo que compraste
- ✅ Puedes marcar como "Entregado"

---

### 🌐 4. Pruebas de Red Lenta (Throttling)

#### En Chrome DevTools (Desktop):
1. F12 → Network tab
2. Throttling: **Slow 3G**
3. Repite las pruebas del punto 3

**Verificar:**
- ✅ El health check responde en menos de 10 segundos
- ✅ Los productos cargan (aunque lento)
- ✅ El checkout funciona sin timeout

---

### 🔍 5. Verificar Variables de Entorno en Vercel

Si alguna prueba falla con error de conexión a DB:

1. Ve a: https://vercel.com/marcostoledo96/sanpaholmes/settings/environment-variables
2. Verifica que existan estas 3 variables:

| Variable | Valor | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_UI1cJxXKOG2u@ep-young-thunder-a4t6hx3f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | ✅ Production, Preview, Development |
| `JWT_SECRET` | `sanpaholmes-secret-key-2025-production` | ✅ Production, Preview, Development |
| `NODE_ENV` | `production` | ✅ Production |

**Si falta alguna:**
1. Click en "Add New"
2. Nombre: (ej: `DATABASE_URL`)
3. Value: (copia el valor de arriba)
4. Environments: Selecciona **Production, Preview, Development**
5. Click "Save"
6. **IMPORTANTE:** Después de agregar variables, haz un **Redeploy**

---

### 📊 6. Logs de Vercel (Si hay errores)

1. Ve a: https://vercel.com/marcostoledo96/sanpaholmes/deployments
2. Click en el deployment actual
3. Tab "Logs" o "Runtime Logs"
4. Busca errores tipo:
   - `Error: connect ETIMEDOUT` → Timeout de conexión
   - `password authentication failed` → Variables de entorno mal configuradas
   - `relation "productos" does not exist` → Base de datos no inicializada

---

### 🔧 7. Debugging con Chrome Remote (Móvil Real)

Si necesitas ver errores de consola del móvil:

1. **En PC:**
   - Abre Chrome
   - Ve a: `chrome://inspect`

2. **En móvil Android:**
   - Conecta por USB
   - Habilita "Depuración USB"
   - Abre Chrome en el móvil
   - Ve a: `https://sanpaholmes.vercel.app`

3. **En PC:**
   - En `chrome://inspect` deberías ver tu móvil
   - Click en "Inspect"
   - Ahora ves la consola del móvil en tiempo real

**Busca errores tipo:**
```
❌ Failed to fetch
❌ net::ERR_CONNECTION_TIMED_OUT
❌ 503 Service Unavailable
❌ Error al obtener productos
```

---

## 📝 Resultados de Pruebas

### ✅ Pruebas Exitosas (Marcar con X)

- [ ] 1. Health Check responde en < 10 segundos
- [ ] 2. `/api/productos` retorna lista completa
- [ ] 3. Landing page carga en móvil con datos 4G
- [ ] 4. Menú muestra productos correctamente
- [ ] 5. Se puede agregar productos al carrito
- [ ] 6. Checkout crea orden exitosamente
- [ ] 7. Login admin funciona desde móvil
- [ ] 8. Panel admin muestra ventas
- [ ] 9. Fondo negro 100% opaco en login
- [ ] 10. Todas las imágenes cargan correctamente

### ❌ Errores Encontrados

**Si encuentras errores, anota:**

1. **URL donde falló:**
2. **Tipo de error:**
3. **Mensaje de error:**
4. **Red usada:** (WiFi / 4G / 5G / 3G)
5. **Dispositivo:** (iPhone 14 / Samsung A52 / etc.)
6. **Screenshot:**

---

## 🚀 Próximos Pasos si TODO funciona

1. ✅ Marca todas las pruebas como exitosas
2. ✅ Comparte el link con el equipo: `https://sanpaholmes.vercel.app`
3. ✅ Haz pruebas con usuarios reales
4. ✅ Monitorea logs de Vercel durante las primeras horas

---

## 🆘 Si las Pruebas Fallan

### Error: "No se pudieron cargar los productos"

**Causa:** Base de datos no responde o timeout

**Solución:**
1. Verifica variables de entorno en Vercel
2. Aumenta timeouts en `db/connection.js`:
   ```javascript
   connectionTimeoutMillis: 15000, // 15 segundos
   query_timeout: 20000, // 20 segundos
   ```
3. Commit + Push
4. Redeploy

### Error: "503 Service Unavailable"

**Causa:** Vercel serverless function falló

**Solución:**
1. Ve a Vercel Logs
2. Busca el error específico
3. Si dice "Function timeout", aumenta en `vercel.json`:
   ```json
   "functions": {
     "server.js": {
       "maxDuration": 15
     }
   }
   ```

### Error: "Failed to fetch"

**Causa:** CORS o ruta incorrecta

**Solución:**
1. Verifica que `server.js` tenga:
   ```javascript
   app.use(cors());
   ```
2. Verifica que `vercel.json` tenga las rewrites correctas

---

**Última actualización:** 14 de noviembre de 2025  
**Commit:** `3c4241b` - "Fix: Aumentar timeouts de DB y mejorar health check para móviles"
