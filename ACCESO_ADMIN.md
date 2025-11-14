# 🔐 ACCESO AL PANEL DE ADMINISTRACIÓN

## Pasos Rápidos

### 1. Iniciar los Servidores

Necesitas DOS terminales abiertas:

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 2. Abrir el Navegador

Ve a: **http://localhost:5174**

### 3. Ir al Login

Haz click en el botón **"Panel Vendedor"** en la barra de navegación (esquina superior derecha)

O ve directamente a: **http://localhost:5174/vendor/login**

### 4. Credenciales

```
Usuario:    admin
Contraseña: admin123
```

### 5. ¡Listo!

Ahora estás en el panel de administración con acceso completo.

---

## ¿Qué Puedo Hacer en el Panel?

### Pestaña "Ventas" 📊

- Ver todas las órdenes realizadas
- Detalles completos de cada compra
- Total recaudado
- Descargar comprobantes de pago

### Pestaña "Productos" 📦

**Crear Producto:**
1. Click en botón "Nuevo Producto"
2. Completar formulario:
   - Nombre (ej: "Café con medialunas")
   - Descripción
   - Precio en ARS
   - Stock disponible
   - Categoría (Merienda o Cena)
   - URL de imagen (opcional)
   - Disponible (checkbox)
3. Click en "Crear Producto"

**Editar Producto:**
1. Click en botón "Editar" en cualquier producto
2. Modificar los campos que necesites
3. Click en "Actualizar Producto"

**Actualizar Stock:**
- Usar la función de editar
- Cambiar el número en el campo "Stock"
- Guardar cambios

**Eliminar Producto:**
1. Click en botón "Eliminar"
2. Confirmar la acción
3. El producto se marca como "No disponible"
   - No se borra físicamente (soft delete)
   - Se mantiene el historial de ventas

---

## Troubleshooting

### No puedo hacer login

**Solución 1**: Reiniciar la base de datos
```bash
npm run init-db
```

**Solución 2**: Verificar que el backend esté corriendo
```bash
# En la terminal del backend deberías ver:
🚀 Servidor corriendo en http://localhost:3000
```

### Los productos no aparecen

```bash
npm run init-db
```

Esto cargará 30 productos de ejemplo.

### El botón no responde

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta de nuevo
4. Verifica que las peticiones lleguen a `http://localhost:3000`

---

## Usuarios de Prueba

Solo existe un usuario por ahora:

| Usuario | Contraseña | Rol | Permisos |
|---------|-----------|-----|----------|
| admin | admin123 | Administrador | Todos |

**Para crear más usuarios**, deberías:
1. Conectarte a la base de datos Neon
2. Insertar en la tabla `users`
3. Usar bcrypt para hashear la contraseña

O modificar el script `db/init.js` para agregar más usuarios.

---

## Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN:**

Si vas a usar esto en un ambiente real (no solo local):

1. **Cambiar la contraseña admin**:
   - Usar el endpoint `/api/auth/cambiar-password`
   - O actualizar directamente en PostgreSQL

2. **Cambiar JWT_SECRET**:
   - En el archivo `.env`
   - Usar una clave segura y larga

3. **Usar HTTPS**:
   - En Vercel esto se configura automáticamente

4. **Agregar rate limiting**:
   - Para prevenir ataques de fuerza bruta

---

## URLs Útiles

### Frontend
- **Landing Page**: http://localhost:5174
- **Menú**: http://localhost:5174/menu
- **Carrito**: http://localhost:5174/cart
- **Login Admin**: http://localhost:5174/vendor/login
- **Panel Admin**: http://localhost:5174/vendor/panel

### Backend API
- **Health Check**: http://localhost:3000/api/health
- **Productos**: http://localhost:3000/api/productos
- **Login**: http://localhost:3000/api/auth/login
- **Compras**: http://localhost:3000/api/compras

---

## Flujo Completo de Uso

### Como Admin

1. Login → http://localhost:5174/vendor/login
2. Ingresá credenciales
3. Serás redirigido al panel
4. Pestaña "Ventas": Ver historial
5. Pestaña "Productos": Gestionar catálogo

### Como Cliente

1. Abrís http://localhost:5174
2. Click "Ver Menú"
3. Agregás productos al carrito
4. Click "Finalizar Compra"
5. Completás formulario
6. Subís comprobante (si es transferencia)
7. Confirmás compra
8. **El admin ve tu compra en el panel**

---

## Datos Iniciales

Después de ejecutar `npm run init-db`, tendrás:

### Usuarios
- 1 admin (admin/admin123)

### Productos
- 30 productos cargados
- 15 de "Merienda"
- 15 de "Cena"
- Con imágenes de Unsplash
- Stock entre 20-50 unidades

### Roles y Permisos
- Rol "admin" con todos los permisos
- Rol "vendedor" con permisos limitados
- 4 permisos configurados:
  - ver_ventas
  - registrar_compra
  - gestionar_productos
  - gestionar_usuarios

---

## Próximos Pasos

Después de acceder al panel:

1. **Explorá las funcionalidades**:
   - Probá crear un producto
   - Probá editarlo
   - Probá eliminarlo
   - Revisá las ventas

2. **Practicá la explicación**:
   - Abrí GUIA_DEFENSA_ORAL.md
   - Leé cómo explicar cada parte
   - Practicá en voz alta

3. **Entendé el código**:
   - Abrí src/components/AdminPanelNew.tsx
   - Leé los comentarios
   - Abrí api/auth.js
   - Entendé el flujo

---

**¡Listo para administrar tu sistema! 🎯**

Si tenés dudas, leé:
- **README.md** - Documentación general
- **GUIA_DEFENSA_ORAL.md** - Explicación completa del proyecto
- **API.md** - Documentación de endpoints
