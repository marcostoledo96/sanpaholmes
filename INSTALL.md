# 🚀 Guía de Instalación Rápida

## Paso 1: Instalar dependencias

Abrí una terminal en VS Code y ejecutá:

```bash
npm install
```

## Paso 2: Configurar variables de entorno

Copiá el archivo de ejemplo:

```bash
copy .env.example .env
```

El archivo `.env` ya tiene la configuración correcta de Neon.

## Paso 3: Inicializar la base de datos

**IMPORTANTE:** Ejecutá este comando para crear las tablas y cargar los datos iniciales:

```bash
npm run init-db
```

Este comando:
- ✅ Crea todas las tablas
- ✅ Carga roles y permisos
- ✅ Crea el usuario admin (usuario: `admin` / contraseña: `admin123`)
- ✅ Carga el menú completo de productos

## Paso 4: Iniciar el servidor

Para desarrollo:

```bash
npm run dev
```

Para producción:

```bash
npm start
```

El servidor va a estar en: `http://localhost:3000`

---

## ✅ Verificar que funciona

1. Abrí tu navegador en `http://localhost:3000`
2. Deberías ver la página de bienvenida del backend
3. Probá la API: `http://localhost:3000/api/health`

---

## 🔐 Credenciales por defecto

**Usuario admin:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 📝 Próximos pasos

1. Probá hacer login en `/vendor/login`
2. Revisá el panel de admin en `/admin`
3. Hacé una compra de prueba desde el menú público

---

## 🆘 Problemas?

Revisá el archivo `README.md` completo para más información.
