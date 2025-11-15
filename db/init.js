// Script de inicialización de la base de datos
// Este archivo crea todas las tablas necesarias y carga los datos iniciales
// Solo lo ejecutás una vez al principio, o cuando querés resetear todo

const pool = require('./connection');
const bcrypt = require('bcrypt');

// Función principal que ejecuta todo
async function inicializarBaseDeDatos() {
  console.log('🚀 Iniciando configuración de la base de datos...\n');

  try {
    // 1️⃣ CREAR TABLAS
    await crearTablas();

    // 2️⃣ VERIFICAR SI YA HAY DATOS
    const hayDatos = await verificarDatosExistentes();

    if (hayDatos) {
      console.log('\n✅ La base de datos ya tiene datos cargados.');
      console.log('Si querés resetear todo, borrá manualmente las tablas desde Neon y volvé a ejecutar este script.\n');
      process.exit(0);
    }

    // 3️⃣ CARGAR DATOS INICIALES
    await cargarRoles();
    await cargarPermisos();
    await asignarPermisosARoles();
    await crearUsuarioAdmin();
    await cargarProductos();

    console.log('\n✅ ¡Base de datos inicializada correctamente!');
    console.log('Usuario admin creado: admin / SanpaHolmes2025\n');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    // Cerramos la conexión
    await pool.end();
  }
}

// Crea todas las tablas necesarias
async function crearTablas() {
  console.log('📋 Creando tablas...');

  // Tabla de usuarios (solo para vendedores y admin)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      nombre_completo VARCHAR(200) NOT NULL,
      email VARCHAR(200) UNIQUE,
      activo BOOLEAN DEFAULT true,
      creado_en TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('  ✓ Tabla users');

  // Tabla de roles (admin, vendedor, etc.)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(50) UNIQUE NOT NULL,
      descripcion TEXT
    );
  `);
  console.log('  ✓ Tabla roles');

  // Tabla de permisos
  await pool.query(`
    CREATE TABLE IF NOT EXISTS permisos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(50) UNIQUE NOT NULL,
      descripcion TEXT
    );
  `);
  console.log('  ✓ Tabla permisos');

  // Relación usuarios-roles (un usuario puede tener varios roles)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );
  `);
  console.log('  ✓ Tabla user_roles');

  // Relación roles-permisos (un rol puede tener varios permisos)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS role_permisos (
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      permiso_id INTEGER REFERENCES permisos(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permiso_id)
    );
  `);
  console.log('  ✓ Tabla role_permisos');

  // Tabla de productos
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      categoria VARCHAR(50) NOT NULL,
      subcategoria VARCHAR(50),
      precio DECIMAL(10, 2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      descripcion TEXT,
      imagen_url TEXT,
      activo BOOLEAN DEFAULT true,
      creado_en TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('  ✓ Tabla productos');

  // Tabla de compras
  await pool.query(`
    CREATE TABLE IF NOT EXISTS compras (
      id SERIAL PRIMARY KEY,
      comprador_nombre VARCHAR(200) NOT NULL,
      comprador_mesa INTEGER CHECK (comprador_mesa IS NULL OR (comprador_mesa BETWEEN 1 AND 50)),
      metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia')),
      comprobante_archivo TEXT,
      total DECIMAL(10, 2) NOT NULL,
      fecha TIMESTAMP DEFAULT NOW(),
      estado VARCHAR(20) DEFAULT 'pendiente',
      abonado BOOLEAN DEFAULT false,
      listo BOOLEAN DEFAULT false,
      entregado BOOLEAN DEFAULT false,
      detalles_pedido TEXT,
      comprador_telefono VARCHAR(50)
    );
  `);
  console.log('  ✓ Tabla compras');

  // Tabla de detalle de compras (qué productos llevó en cada compra)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS detalle_compra (
      id SERIAL PRIMARY KEY,
      compra_id INTEGER REFERENCES compras(id) ON DELETE CASCADE,
      producto_id INTEGER REFERENCES productos(id),
      cantidad INTEGER NOT NULL,
      precio_unitario DECIMAL(10, 2) NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL
    );
  `);
  console.log('  ✓ Tabla detalle_compra');

  console.log('');
}

// Verifica si ya hay datos en la base
async function verificarDatosExistentes() {
  const result = await pool.query('SELECT COUNT(*) FROM roles');
  return parseInt(result.rows[0].count) > 0;
}

// Carga los roles iniciales
async function cargarRoles() {
  console.log('👥 Cargando roles...');

  const roles = [
    { nombre: 'admin', descripcion: 'Administrador con acceso total' },
    { nombre: 'vendedor', descripcion: 'Puede ver productos y compras' }
  ];

  for (const rol of roles) {
    await pool.query(
      'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2)',
      [rol.nombre, rol.descripcion]
    );
    console.log(`  ✓ Rol: ${rol.nombre}`);
  }
  console.log('');
}

// Carga los permisos necesarios
async function cargarPermisos() {
  console.log('🔐 Cargando permisos...');

  const permisos = [
    { nombre: 'ver_productos', descripcion: 'Puede ver el listado de productos' },
    { nombre: 'gestionar_productos', descripcion: 'Puede crear, editar y eliminar productos' },
    { nombre: 'ver_compras', descripcion: 'Puede ver el listado de compras' },
    { nombre: 'crear_compra', descripcion: 'Puede registrar nuevas compras' },
    { nombre: 'editar_compras', descripcion: 'Puede editar compras y actualizar estados' },
    { nombre: 'eliminar_compras', descripcion: 'Puede eliminar compras' }
  ];

  for (const permiso of permisos) {
    await pool.query(
      'INSERT INTO permisos (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING',
      [permiso.nombre, permiso.descripcion]
    );
    console.log(`  ✓ Permiso: ${permiso.nombre}`);
  }
  console.log('');
}

// Asigna los permisos a cada rol
async function asignarPermisosARoles() {
  console.log('🔗 Asignando permisos a roles...');

  // El admin tiene todos los permisos
  const adminRole = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['admin']);
  const todosPermisos = await pool.query('SELECT id FROM permisos');

  for (const permiso of todosPermisos.rows) {
    await pool.query(
      'INSERT INTO role_permisos (role_id, permiso_id) VALUES ($1, $2)',
      [adminRole.rows[0].id, permiso.id]
    );
  }
  console.log('  ✓ Admin tiene todos los permisos');

  // El vendedor solo puede ver productos y compras
  const vendedorRole = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['vendedor']);
  const permisosVendedor = await pool.query(
    "SELECT id FROM permisos WHERE nombre IN ('ver_productos', 'ver_compras')"
  );

  for (const permiso of permisosVendedor.rows) {
    await pool.query(
      'INSERT INTO role_permisos (role_id, permiso_id) VALUES ($1, $2)',
      [vendedorRole.rows[0].id, permiso.id]
    );
  }
  console.log('  ✓ Vendedor puede ver productos y compras');
  console.log('');
}

// Crea el usuario administrador por defecto
async function crearUsuarioAdmin() {
  console.log('🔑 Creando usuario administrador...');

  // Encriptamos la contraseña
  const passwordHash = await bcrypt.hash('SanpaHolmes2025', 10);

  // Creamos el usuario
  const result = await pool.query(
    'INSERT INTO users (username, password_hash, nombre_completo, email) VALUES ($1, $2, $3, $4) RETURNING id',
    ['admin', passwordHash, 'Administrador', 'admin@sanpaholmes.com']
  );

  // Le asignamos el rol de admin
  const adminRole = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['admin']);
  await pool.query(
    'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
    [result.rows[0].id, adminRole.rows[0].id]
  );

  console.log('  ✓ Usuario: admin / SanpaHolmes2025');
  console.log('');
}

// Carga el menú completo de productos
async function cargarProductos() {
  console.log('🍔 Cargando menú de productos...');

  const productos = [
    // MERIENDA - Panificación
    { nombre: 'Tostado de jamón y queso', categoria: 'merienda', subcategoria: 'panificacion', precio: 2500, stock: 50 },
    { nombre: 'Tostado especial', categoria: 'merienda', subcategoria: 'panificacion', precio: 3000, stock: 50 },
    { nombre: 'Sándwich de miga (6 unidades)', categoria: 'merienda', subcategoria: 'panificacion', precio: 3500, stock: 30 },
    { nombre: 'Medialunas (3 unidades)', categoria: 'merienda', subcategoria: 'panificacion', precio: 2000, stock: 60 },
    { nombre: 'Churros con dulce de leche', categoria: 'merienda', subcategoria: 'panificacion', precio: 2500, stock: 40 },

    // MERIENDA - Confitería
    { nombre: 'Alfajor artesanal', categoria: 'merienda', subcategoria: 'confiteria', precio: 1500, stock: 80 },
    { nombre: 'Porción de torta', categoria: 'merienda', subcategoria: 'confiteria', precio: 3000, stock: 25 },
    { nombre: 'Brownie', categoria: 'merienda', subcategoria: 'confiteria', precio: 2500, stock: 40 },
    { nombre: 'Cookie gigante', categoria: 'merienda', subcategoria: 'confiteria', precio: 2000, stock: 50 },

    // MERIENDA - Bebidas
    { nombre: 'Café', categoria: 'merienda', subcategoria: 'bebidas', precio: 1500, stock: 100 },
    { nombre: 'Café con leche', categoria: 'merienda', subcategoria: 'bebidas', precio: 2000, stock: 100 },
    { nombre: 'Té', categoria: 'merienda', subcategoria: 'bebidas', precio: 1200, stock: 100 },
    { nombre: 'Chocolatada', categoria: 'merienda', subcategoria: 'bebidas', precio: 2500, stock: 80 },
    { nombre: 'Licuado', categoria: 'merienda', subcategoria: 'bebidas', precio: 3000, stock: 60 },
    { nombre: 'Gaseosa (500ml)', categoria: 'merienda', subcategoria: 'bebidas', precio: 1800, stock: 100 },
    { nombre: 'Agua mineral', categoria: 'merienda', subcategoria: 'bebidas', precio: 1200, stock: 100 },
    { nombre: 'Jugo exprimido', categoria: 'merienda', subcategoria: 'bebidas', precio: 2500, stock: 50 },

    // CENA - Principales
    { nombre: 'Hamburguesa completa', categoria: 'cena', subcategoria: 'principales', precio: 5000, stock: 40 },
    { nombre: 'Hamburguesa doble', categoria: 'cena', subcategoria: 'principales', precio: 6500, stock: 30 },
    { nombre: 'Pancho completo', categoria: 'cena', subcategoria: 'principales', precio: 3500, stock: 50 },
    { nombre: 'Pizza individual', categoria: 'cena', subcategoria: 'principales', precio: 4500, stock: 35 },
    { nombre: 'Empanadas (3 unidades)', categoria: 'cena', subcategoria: 'principales', precio: 3000, stock: 60 },
    { nombre: 'Milanesa con papas', categoria: 'cena', subcategoria: 'principales', precio: 5500, stock: 30 },
    { nombre: 'Lomito completo', categoria: 'cena', subcategoria: 'principales', precio: 6000, stock: 25 },

    // CENA - Guarniciones
    { nombre: 'Papas fritas', categoria: 'cena', subcategoria: 'guarniciones', precio: 2500, stock: 80 },
    { nombre: 'Aros de cebolla', categoria: 'cena', subcategoria: 'guarniciones', precio: 2800, stock: 60 },
    { nombre: 'Ensalada', categoria: 'cena', subcategoria: 'guarniciones', precio: 2000, stock: 50 },

    // CENA - Bebidas
    { nombre: 'Cerveza', categoria: 'cena', subcategoria: 'bebidas', precio: 2500, stock: 80 },
    { nombre: 'Gaseosa (1.5L)', categoria: 'cena', subcategoria: 'bebidas', precio: 2800, stock: 60 },
    { nombre: 'Agua saborizada', categoria: 'cena', subcategoria: 'bebidas', precio: 1500, stock: 80 }
  ];

  for (const producto of productos) {
    await pool.query(
      `INSERT INTO productos (nombre, categoria, subcategoria, precio, stock) 
       VALUES ($1, $2, $3, $4, $5)`,
      [producto.nombre, producto.categoria, producto.subcategoria, producto.precio, producto.stock]
    );
  }

  console.log(`  ✓ ${productos.length} productos cargados`);
  console.log('');
}

// Ejecutamos todo
inicializarBaseDeDatos();
