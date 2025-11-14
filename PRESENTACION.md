# 🎤 Guía para la Defensa Oral del Proyecto

## 📋 Checklist antes de la presentación

### ✅ Verificaciones técnicas

- [ ] El proyecto corre sin errores (`npm run dev`)
- [ ] La base de datos tiene datos de prueba
- [ ] Podés hacer login con admin/admin123
- [ ] Podés crear una compra de prueba
- [ ] Tenés ejemplos de comprobantes guardados

### ✅ Preparación personal

- [ ] Leíste el README.md completo
- [ ] Entendés cómo funciona cada endpoint
- [ ] Sabés explicar el sistema de permisos
- [ ] Conocés las tecnologías usadas
- [ ] Podés demostrar el flujo completo

---

## 🎯 Estructura de la presentación (10-15 minutos)

### 1. Introducción (2 minutos)

**¿Qué es SanpaHolmes?**
> "SanpaHolmes es un sistema de carrito de compras diseñado específicamente para el evento Scout 2024 del Grupo San Patricio. Permite que los participantes del campamento puedan hacer pedidos de comida de forma digital, sin necesidad de registrarse, mientras que los vendedores y administradores tienen un panel protegido para gestionar productos y ver las ventas."

**Problema que resuelve:**
> "Antes, los pedidos se tomaban en papel, lo que generaba errores, pérdida de comprobantes y descontrol del stock. Con este sistema, todo queda registrado digitalmente, el stock se descuenta automáticamente y los comprobantes de transferencia se guardan de forma segura."

### 2. Tecnologías utilizadas (2 minutos)

**Backend:**
- **Node.js + Express**: Framework ligero y rápido para crear APIs REST
- **PostgreSQL en Neon**: Base de datos relacional en la nube
- **JWT**: Para autenticación segura sin sesiones
- **Bcrypt**: Encriptación de contraseñas
- **Multer**: Para subir archivos (comprobantes)

**¿Por qué estas tecnologías?**
- Node.js es JavaScript, lo mismo que usamos en el frontend
- PostgreSQL maneja bien las relaciones (usuarios-roles-permisos)
- Neon es gratis y no requiere instalación local
- Vercel permite deploy gratuito y automático

### 3. Demostración práctica (5 minutos)

**Mostrar en vivo:**

1. **Página principal**
   - Diseño policial temático
   - Placeholders para logos institucionales

2. **Flujo de compra (comprador sin usuario)**
   - Ver menú de productos
   - Agregar al carrito
   - Aumentar/disminuir cantidad (sin poder eliminar)
   - Confirmar compra con datos
   - Subir comprobante si es transferencia

3. **Panel de administración**
   - Login con admin/admin123
   - Ver listado de ventas
   - Ver detalle de una venta
   - Gestionar productos (crear/editar)

4. **Verificar en la base de datos**
   - Mostrar que el stock se descontó
   - Mostrar que la compra quedó registrada

### 4. Arquitectura y código (3 minutos)

**Estructura del backend:**

```
api/
├── auth.js       → Login y gestión de usuarios
├── productos.js  → CRUD de productos
└── compras.js    → Registro y consulta de ventas

db/
├── connection.js → Conexión a PostgreSQL
└── init.js      → Creación de tablas y datos iniciales

middleware/
└── auth.js      → Validación de permisos
```

**Explicar un endpoint:**

Mostrá el código de `POST /api/compras` y explicá:
- Validación de datos
- Verificación de stock
- Uso de transacciones para evitar inconsistencias
- Descuento automático del stock
- Registro del detalle de compra

### 5. Características técnicas destacadas (2 minutos)

**Sistema de permisos:**
- No es solo admin/vendedor
- Es un sistema escalable de roles y permisos
- Un usuario puede tener múltiples roles
- Un rol puede tener múltiples permisos
- Se valida en cada endpoint con middleware

**Seguridad:**
- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT firmados con clave secreta
- Validación de inputs en todos los endpoints
- Transacciones en la BD para garantizar consistencia

**Carrito sin eliminar:**
- Decisión de diseño intencional
- Solo permite aumentar/disminuir cantidad
- Al llegar a 0, se quita del carrito
- Obliga al usuario a confirmar su pedido

### 6. Deploy y producción (1 minuto)

**Preparado para Vercel:**
- Configuración serverless
- Variables de entorno
- Compatible con funciones limitadas en tiempo
- URL: `https://tu-proyecto.vercel.app`

---

## 🤔 Preguntas frecuentes y respuestas

### Técnicas

**P: ¿Por qué Node.js y no PHP o Python?**
> R: Node.js es JavaScript, lo que me permite usar el mismo lenguaje en frontend y backend. Además, Express es muy simple y tiene muchísima documentación. Es ideal para APIs REST.

**P: ¿Por qué PostgreSQL y no MongoDB?**
> R: Mi proyecto tiene relaciones claras: usuarios tienen roles, roles tienen permisos, compras tienen productos. PostgreSQL maneja esto perfectamente con claves foráneas y JOINS.

**P: ¿Qué es Neon?**
> R: Es PostgreSQL como servicio. Me da una base de datos en la nube sin tener que instalar ni configurar nada localmente. Es gratis para proyectos educativos.

**P: ¿Cómo funciona JWT?**
> R: Cuando el usuario hace login, el servidor genera un token firmado con una clave secreta. Ese token tiene info del usuario y sus permisos. En cada petición protegida, el cliente envía el token y el servidor lo verifica. Si es válido, permite la acción.

**P: ¿Los compradores están en la base de datos?**
> R: No. Solo se registra su nombre y mesa en cada compra. No hay tabla de compradores ni necesitan crear cuenta. Esto simplifica el proceso.

**P: ¿Qué pasa si dos personas compran el último producto al mismo tiempo?**
> R: Uso transacciones en PostgreSQL. La segunda compra verá que no hay stock y recibirá un error. No se puede vender lo que no hay.

### De diseño

**P: ¿Por qué el carrito no permite eliminar productos?**
> R: Es una decisión de negocio. En el contexto del evento scout, queremos que las personas se tomen un momento para pensar qué van a pedir. Pueden reducir la cantidad a 0 si se equivocaron, pero no hay un botón de "vaciar carrito".

**P: ¿Los vendedores pueden crear usuarios?**
> R: No, solo el admin. Los vendedores solo pueden ver productos y ventas. Esto evita que se creen usuarios no autorizados.

**P: ¿Por qué hay placeholders de logos?**
> R: El diseño está preparado para recibir los logos institucionales oficiales (escudo del grupo, símbolos raiders, tréboles). Los placeholders marcan dónde van esas imágenes cuando las tengamos.

### De seguridad

**P: ¿Cómo se protegen las contraseñas?**
> R: Uso bcrypt con 10 rounds de salt. Esto significa que aunque alguien acceda a la base de datos, no puede ver las contraseñas reales. Bcrypt hace que hashear la misma contraseña dos veces dé resultados diferentes.

**P: ¿Qué pasa si roban el token JWT?**
> R: El token expira en 24 horas. Además, en un entorno de producción real se debería usar HTTPS para evitar que el token sea interceptado.

**P: ¿Validás los archivos que suben?**
> R: Sí, Multer está configurado para aceptar solo imágenes (JPG, PNG) y PDF. Además, hay un límite de 5MB por archivo.

---

## 💡 Tips para la presentación

### ✅ Hacer:

- **Practicá el demo antes**: Que funcione todo sin errores
- **Tené datos de prueba**: Productos, compras, usuarios
- **Mostrá el código**: No solo la interfaz
- **Explicá tus decisiones**: Por qué elegiste X tecnología
- **Sé honesto**: Si no sabés algo, decilo
- **Hablá en primera persona**: "Yo elegí...", "Yo implementé..."

### ❌ Evitar:

- No leas las slides o el código palabra por palabra
- No uses términos que no entendés
- No digas "es como lo vi en YouTube"
- No minimices tu trabajo: "es solo una API simple"
- No te pongas nervioso si algo falla, explicá el error

---

## 🎯 Puntos clave para destacar

1. **Separación de responsabilidades**: Frontend y backend separados
2. **Sistema de permisos escalable**: No solo roles fijos
3. **Transacciones**: Garantizan consistencia en la BD
4. **Seguridad**: Contraseñas encriptadas, tokens firmados
5. **Código comentado**: Todo está documentado en español
6. **Preparado para producción**: Funciona en Vercel sin cambios
7. **Sin dependencias externas**: No necesita email, SMS, etc.

---

## 📊 Métricas del proyecto

- **Archivos creados**: ~20 archivos backend + mejoras frontend
- **Endpoints**: 13 endpoints (3 públicos, 10 protegidos)
- **Tablas en BD**: 8 tablas con relaciones
- **Líneas de código**: ~1500 líneas bien comentadas
- **Tecnologías**: 6 tecnologías principales
- **Tiempo de desarrollo**: [tu tiempo real]

---

## 🏆 Cómo cerrar la presentación

> "En resumen, desarrollé un sistema completo de backend con Node.js y PostgreSQL que resuelve un problema real del evento scout. El sistema es seguro, escalable y está preparado para producción. Los compradores pueden hacer pedidos sin registrarse, el stock se controla automáticamente y los administradores tienen visibilidad completa de las ventas. Todo el código está comentado en español para que sea fácil de mantener. Gracias por su atención, ¿tienen alguna pregunta?"

---

## 🎬 Ensayo final

Antes de presentar:

1. ✅ Corré el proyecto desde cero
2. ✅ Practicá el demo 3 veces
3. ✅ Leé todas las preguntas y respuestas
4. ✅ Anotá las 3 cosas más importantes
5. ✅ Preparate para mostrar código

---

## ✨ ¡Éxito en tu presentación!

Recordá: **vos hiciste todo esto**. Confiá en tu trabajo y mostralo con orgullo.

🕵️‍♂️ **¡Caso resuelto, detective!** 🔎
