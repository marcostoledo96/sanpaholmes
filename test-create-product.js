// Script de prueba para crear productos directamente en la BD
const pool = require('./db/connection');

async function crearProductosDePrueba() {
  console.log('🧪 Creando productos de prueba...\n');

  try {
    // Producto 1: Café (Merienda - Bebidas)
    await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, stock, categoria, subcategoria, imagen_url, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      'Café con Leche',
      'Vaso de café con leche 250ml',
      1500,
      50,
      'merienda-bebidas',
      'bebidas',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      true
    ]);
    console.log('✅ Producto 1: Café con Leche (merienda-bebidas)');

    // Producto 2: Medialunas (Merienda - Dulces)
    await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, stock, categoria, subcategoria, imagen_url, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      'Medialunas',
      'Docena de medialunas dulces',
      2000,
      30,
      'merienda-dulces',
      'dulces',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
      true
    ]);
    console.log('✅ Producto 2: Medialunas (merienda-dulces)');

    // Producto 3: Pizza (Cena - Comidas)
    await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, stock, categoria, subcategoria, imagen_url, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      'Pizza Napolitana',
      'Pizza napolitana individual',
      3500,
      20,
      'cena-comidas',
      'comidas',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      true
    ]);
    console.log('✅ Producto 3: Pizza Napolitana (cena-comidas)');

    // Producto 4: Coca Cola (Cena - Bebidas)
    await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, stock, categoria, subcategoria, imagen_url, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      'Coca Cola',
      'Coca Cola 500ml',
      1200,
      100,
      'cena-bebidas',
      'bebidas',
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
      true
    ]);
    console.log('✅ Producto 4: Coca Cola (cena-bebidas)');

    console.log('\n✅ ¡Productos de prueba creados exitosamente!');
    console.log('Ahora abre http://localhost:5173/menu para verlos\n');

  } catch (error) {
    console.error('❌ Error al crear productos:', error);
  } finally {
    await pool.end();
  }
}

crearProductosDePrueba();
