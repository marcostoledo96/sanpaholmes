# ✅ Lista de Verificación - Testing Completo SanpaHolmes

**Última actualización:** 14 de noviembre de 2025  
**URL de producción:** https://sanpaholmes.vercel.app

---

## 📱 FRONTEND - Rutas Públicas

### 1. Landing Page (/)
**Desktop:**
- [ ] Se carga correctamente
- [ ] Hero section con logo central visible
- [ ] 2 imágenes de trébol flanqueando el logo (ocultas en mobile)
- [ ] Título "SanpaHolmes 2025" visible
- [ ] Botón "Ver Menú y Hacer Pedido" funcional
- [ ] Banner con 3 escudos institucionales (Comunidad Raider | San Patricio | Tropa Raider)
- [ ] Footer con información del evento
- [ ] 2 tréboles en el footer
- [ ] Scroll suave

**Mobile (< 768px):**
- [ ] Se carga correctamente
- [ ] Hero section responsivo (tréboles ocultos)
- [ ] Botón "Ver Menú" accesible
- [ ] Banner en columna única (3 escudos apilados)
- [ ] Footer responsivo
- [ ] Sin scroll horizontal

---

### 2. Menú (/menu)
**Desktop:**
- [ ] Se carga correctamente
- [ ] Título "Menú" visible
- [ ] Productos se cargan desde API (/api/productos)
- [ ] Filtros por categoría funcionan (Comida, Bebida, Merienda, etc.)
- [ ] Imágenes de productos se muestran correctamente
- [ ] Precios formateados: $X,XXX
- [ ] Botón "Agregar al carrito" funcional
- [ ] Toast notification al agregar producto
- [ ] Stock visible (si disponible < 10)
- [ ] Badge de categoría visible y correcto

**Mobile:**
- [ ] Grid de productos responsivo (1 columna)
- [ ] Filtros accesibles
- [ ] Botones de agregar al carrito fáciles de tocar
- [ ] Imágenes se ajustan correctamente

**Casos Edge:**
- [ ] Mensaje si no hay productos
- [ ] Mensaje si no hay stock de un producto
- [ ] Error de conexión a base de datos manejado

---

### 3. Carrito (/cart)
**Desktop:**
- [ ] Se carga correctamente
- [ ] Lista de productos agregados visible
- [ ] Imagen, nombre, precio y cantidad por producto
- [ ] Botones +/- para ajustar cantidad funcionan
- [ ] Botón eliminar (X) funciona
- [ ] Subtotal se actualiza en tiempo real
- [ ] Total calculado correctamente
- [ ] Botón "Proceder al Checkout" funcional
- [ ] Botón "Seguir Comprando" redirige a /menu

**Mobile:**
- [ ] Lista responsiva
- [ ] Botones +/- accesibles
- [ ] Total visible sin scroll

**Casos Edge:**
- [ ] Mensaje "Carrito vacío" si no hay productos
- [ ] No se puede agregar cantidad > stock disponible
- [ ] Cantidad mínima = 1

---

### 4. Checkout (/checkout)
**Desktop:**
- [ ] Se carga correctamente
- [ ] Formulario con todos los campos:
  - [ ] Nombre completo (requerido)
  - [ ] Teléfono (requerido)
  - [ ] Mesa (input numérico, requerido)
  - [ ] Método de pago (select: Efectivo/Transferencia, requerido)
  - [ ] Comprobante de pago (opcional, archivo)
  - [ ] Detalles del pedido (textarea, opcional, max 500 caracteres)
- [ ] Resumen de pedido visible con productos y total
- [ ] Botón "Confirmar Pedido" funcional
- [ ] Validación de campos obligatorios
- [ ] Toast de error si falta información
- [ ] Redirección a /order-confirmation después de confirmar

**Mobile:**
- [ ] Formulario responsivo
- [ ] Campos fáciles de completar
- [ ] Textarea para detalles visible
- [ ] Resumen de pedido accesible

**Casos Edge:**
- [ ] No se puede acceder si carrito está vacío (redirige a /cart)
- [ ] Error si falla el POST a /api/compras
- [ ] Validación de formato de teléfono
- [ ] Límite de 500 caracteres en detalles

---

### 5. Confirmación de Orden (/order-confirmation)
**Desktop:**
- [ ] Se carga correctamente
- [ ] Mensaje de éxito visible
- [ ] Número de orden mostrado
- [ ] Detalles del pedido visibles
- [ ] Botón "Volver al Inicio" funciona
- [ ] Botón "Hacer Otro Pedido" funciona
- [ ] Carrito se vacía después de confirmar

**Mobile:**
- [ ] Mensaje centrado y legible
- [ ] Botones accesibles

---

## 🔐 PANEL DE ADMINISTRACIÓN

### 6. Login de Vendedor (/vendor/login)
**Desktop:**
- [ ] Se carga correctamente
- [ ] Formulario de login visible
- [ ] Campo "Usuario" funcional
- [ ] Campo "Contraseña" funcional (tipo password)
- [ ] Botón "Iniciar Sesión" funcional
- [ ] Validación de credenciales (admin/admin123)
- [ ] Token JWT guardado en localStorage
- [ ] Redirección a /vendor/panel después de login exitoso
- [ ] Mensaje de error si credenciales incorrectas

**Mobile:**
- [ ] Formulario responsivo
- [ ] Campos fáciles de completar
- [ ] Botón accesible

**Casos Edge:**
- [ ] No se puede acceder a /vendor/panel sin login
- [ ] Token expira después de X tiempo
- [ ] Error de conexión manejado

---

### 7. Panel de Administración (/vendor/panel)
**Desktop:**
- [ ] Se carga correctamente (requiere autenticación)
- [ ] 2 pestañas visibles: "Productos" y "Ventas"

#### Pestaña Productos:
- [ ] Lista de productos cargada desde API
- [ ] Columnas: Imagen, Nombre, Categoría, Subcategoría, Precio, Stock, Acciones
- [ ] Botón "Nuevo Producto" funcional
- [ ] Modal de crear producto se abre correctamente
- [ ] Campos del formulario:
  - [ ] Nombre (requerido)
  - [ ] Descripción
  - [ ] Categoría (select)
  - [ ] Subcategoría (select, depende de categoría)
  - [ ] Precio (número, requerido)
  - [ ] Stock (número, requerido)
  - [ ] URL de imagen
- [ ] Botón "Guardar" crea producto vía POST /api/productos
- [ ] Botón "Editar" abre modal con datos pre-cargados
- [ ] PUT /api/productos/:id actualiza producto
- [ ] Botón "Eliminar" borra producto vía DELETE /api/productos/:id
- [ ] Confirmación antes de eliminar

#### Pestaña Ventas:
- [ ] Lista de compras cargada desde API (/api/compras)
- [ ] Barra de búsqueda por nombre/teléfono funcional
- [ ] Columnas: ID, Fecha, Cliente, Teléfono, Mesa, Total, Abonado, Entregado, Acciones
- [ ] Checkbox "Abonado" toggle funciona (PATCH /api/compras/:id/estado)
- [ ] Checkbox "Entregado" toggle funciona (PATCH /api/compras/:id/estado)
- [ ] Botón "Ver Detalles" expande fila con:
  - [ ] Lista de productos
  - [ ] Detalles del pedido (si tiene observaciones, en caja amber)
  - [ ] Método de pago
- [ ] Botón "Editar Productos" abre modal
- [ ] Modal de editar productos:
  - [ ] Lista de productos con cantidad
  - [ ] Botones +/- para ajustar cantidad
  - [ ] Botón "Eliminar" producto de la orden
  - [ ] Total recalculado en tiempo real
  - [ ] Botón "Guardar Cambios" actualiza vía PUT /api/compras/:id/productos
- [ ] Botón "Eliminar" borra compra vía DELETE /api/compras/:id
- [ ] Confirmación antes de eliminar
- [ ] Botón "Exportar a Google Sheets" funcional (si URL configurada)
- [ ] Total de ventas calculado correctamente (suma de todas las compras)

**Mobile:**
- [ ] Pestañas accesibles
- [ ] Tablas responsivas con scroll horizontal
- [ ] Botones de acción accesibles
- [ ] Modales responsivos

**Casos Edge:**
- [ ] Mensaje si no hay productos
- [ ] Mensaje si no hay ventas
- [ ] Error de conexión manejado
- [ ] Permisos verificados (solo admin puede editar/eliminar)
- [ ] Logout funcional

---

## 🔌 BACKEND - Endpoints API

### 8. Health Check
- [ ] GET /api/health → 200 OK
- [ ] Respuesta: `{ "status": "ok", "database": "connected", "timestamp": "..." }`

### 9. Productos
- [ ] GET /api/productos → 200 OK (lista de productos)
- [ ] POST /api/productos → 201 Created (crea producto, requiere auth)
- [ ] PUT /api/productos/:id → 200 OK (actualiza producto, requiere auth)
- [ ] DELETE /api/productos/:id → 200 OK (elimina producto, requiere auth)

### 10. Autenticación
- [ ] POST /api/auth/login → 200 OK (devuelve token)
- [ ] Body: `{ "username": "admin", "password": "admin123" }`
- [ ] Respuesta: `{ "success": true, "token": "...", "usuario": {...} }`
- [ ] POST /api/auth/login → 401 Unauthorized (credenciales incorrectas)

### 11. Compras
- [ ] GET /api/compras → 200 OK (lista de compras, requiere auth)
- [ ] POST /api/compras → 201 Created (crea compra)
- [ ] Body debe incluir: comprador_nombre, comprador_telefono, mesa, metodo_pago, productos[], detalles_pedido (opcional)
- [ ] PUT /api/compras/:id → 200 OK (actualiza datos del comprador, requiere auth)
- [ ] PATCH /api/compras/:id/estado → 200 OK (actualiza abonado/entregado, requiere auth)
- [ ] PUT /api/compras/:id/productos → 200 OK (actualiza productos de la orden, requiere auth)
- [ ] DELETE /api/compras/:id → 200 OK (elimina compra, requiere auth y permiso eliminar_compras)

---

## 🗄️ BASE DE DATOS

### 12. Conexión y Datos
- [ ] Conexión a Neon PostgreSQL funcional
- [ ] Tabla `productos` con datos (al menos 4 productos)
- [ ] Tabla `compras` funcional
- [ ] Tabla `compras_productos` (relación many-to-many)
- [ ] Tabla `usuarios` con admin
- [ ] Campo `detalles_pedido` presente en tabla `compras`
- [ ] Triggers y constraints funcionando

---

## 🎨 UI/UX

### 13. Diseño General
**Desktop:**
- [ ] Fuentes cargadas correctamente
- [ ] Colores consistentes (tema scout: verde/amarillo/negro)
- [ ] Botones con hover effects
- [ ] Transiciones suaves
- [ ] Sin elementos cortados
- [ ] Sin scroll horizontal
- [ ] Footer siempre al final

**Mobile:**
- [ ] Todo el contenido visible sin zoom
- [ ] Botones con tamaño mínimo táctil (44px)
- [ ] Formularios fáciles de completar
- [ ] Sin elementos superpuestos

### 14. Navegación
- [ ] Navbar visible en todas las páginas
- [ ] Logo clicable (redirige a /)
- [ ] Contador de carrito actualizado en tiempo real
- [ ] Link "Menú" funciona
- [ ] Link "Carrito" funciona
- [ ] Link "Login" funciona (si no está autenticado)
- [ ] Link "Panel" funciona (si está autenticado)
- [ ] Botón "Cerrar Sesión" funciona

### 15. Notificaciones (Toasts)
- [ ] Toast de éxito al agregar al carrito
- [ ] Toast de éxito al crear orden
- [ ] Toast de éxito al guardar cambios
- [ ] Toast de error si falla operación
- [ ] Toast de advertencia si falta información
- [ ] Posición: top-right
- [ ] Auto-dismiss después de 3-5 segundos

---

## 🐛 Casos de Error

### 16. Manejo de Errores
- [ ] Error 404 para rutas inexistentes → muestra página 404 o redirige a /
- [ ] Error 500 del servidor → mensaje amigable al usuario
- [ ] Timeout de conexión → mensaje de error
- [ ] Base de datos offline → mensaje de mantenimiento
- [ ] API devuelve error → toast con mensaje descriptivo
- [ ] JWT inválido → redirige a /vendor/login
- [ ] Sin conexión a internet → mensaje de error

---

## 📊 Performance

### 17. Velocidad de Carga
- [ ] Landing page carga en < 2 segundos
- [ ] Menú carga productos en < 3 segundos
- [ ] Panel de admin carga en < 3 segundos
- [ ] Imágenes optimizadas (< 500KB cada una)
- [ ] Sin bloqueos en el UI
- [ ] Lazy loading de imágenes

---

## 🔒 Seguridad

### 18. Protección de Datos
- [ ] Contraseñas hasheadas con bcrypt
- [ ] JWT con expiración
- [ ] CORS configurado correctamente
- [ ] Variables de entorno en Vercel (no en código)
- [ ] SQL injection prevenida (prepared statements)
- [ ] XSS prevenido (validación de inputs)
- [ ] Rutas protegidas requieren autenticación
- [ ] Permisos verificados en backend

---

## 📱 Compatibilidad

### 19. Navegadores
- [ ] Chrome (desktop y mobile)
- [ ] Firefox (desktop y mobile)
- [ ] Safari (desktop y mobile)
- [ ] Edge (desktop)

### 20. Dispositivos
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667 - iPhone SE)
- [ ] Mobile (414x896 - iPhone 11)
- [ ] Mobile (360x640 - Android)

---

## 🎯 Flujo Completo de Usuario

### 21. Flujo de Compra (Usuario Final)
1. [ ] Usuario entra a https://sanpaholmes.vercel.app
2. [ ] Hace clic en "Ver Menú y Hacer Pedido"
3. [ ] Ve el menú de productos
4. [ ] Filtra por categoría "Bebidas"
5. [ ] Agrega 2x "Coca-Cola" al carrito
6. [ ] Ve notificación de éxito
7. [ ] Agrega 1x "Hamburguesa completa" al carrito
8. [ ] Hace clic en el ícono de carrito (badge muestra "3")
9. [ ] Revisa el carrito
10. [ ] Ajusta cantidad de Coca-Cola a 3
11. [ ] Ve el total actualizado
12. [ ] Hace clic en "Proceder al Checkout"
13. [ ] Completa formulario:
    - Nombre: "Juan Pérez"
    - Teléfono: "1234567890"
    - Mesa: "15"
    - Método de pago: "Efectivo"
    - Detalles: "Sin cebolla en la hamburguesa"
14. [ ] Hace clic en "Confirmar Pedido"
15. [ ] Ve página de confirmación con número de orden
16. [ ] Carrito se vacía automáticamente

### 22. Flujo de Administración
1. [ ] Admin entra a https://sanpaholmes.vercel.app/vendor/login
2. [ ] Ingresa usuario: "admin" y contraseña: "admin123"
3. [ ] Es redirigido a /vendor/panel
4. [ ] Ve pestaña "Ventas"
5. [ ] Ve la orden de "Juan Pérez" en la lista
6. [ ] Hace clic en "Ver Detalles"
7. [ ] Ve los productos y los detalles "Sin cebolla en la hamburguesa" en caja amber
8. [ ] Marca checkbox "Abonado"
9. [ ] Hace clic en "Editar Productos"
10. [ ] Agrega 1x más de Coca-Cola (ahora son 4)
11. [ ] Ve el total recalculado
12. [ ] Guarda cambios
13. [ ] Marca checkbox "Entregado"
14. [ ] Cambia a pestaña "Productos"
15. [ ] Hace clic en "Nuevo Producto"
16. [ ] Completa formulario de nuevo producto
17. [ ] Guarda
18. [ ] Ve el nuevo producto en la lista
19. [ ] Hace clic en "Exportar a Google Sheets"
20. [ ] Cierra sesión

---

## ✅ Resumen de Verificación

**Total de checks:** ~200+

**Prioridad Alta (Críticos):**
- [ ] Todas las rutas cargan sin 404
- [ ] Flujo de compra completo funciona
- [ ] Panel de admin accesible
- [ ] API responde correctamente
- [ ] Base de datos conectada
- [ ] Autenticación funciona

**Prioridad Media (Importantes):**
- [ ] Diseño responsivo en todos los dispositivos
- [ ] Todas las imágenes cargan
- [ ] Notificaciones funcionan
- [ ] Manejo de errores correcto

**Prioridad Baja (Nice to have):**
- [ ] Performance óptimo
- [ ] Animaciones suaves
- [ ] Lazy loading

---

## 📝 Reporte de Bugs

**Formato:**
```
Página: [URL]
Dispositivo: [Desktop/Mobile/Tablet]
Navegador: [Chrome/Firefox/Safari/etc]
Descripción: [Qué pasó]
Pasos para reproducir: [1. 2. 3.]
Esperado: [Qué debería pasar]
Actual: [Qué pasó realmente]
Screenshot: [Si es posible]
```

---

**Fecha de última prueba:** _____________  
**Testeado por:** _____________  
**Estado general:** ⏳ En progreso
