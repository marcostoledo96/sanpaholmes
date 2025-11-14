// Script para verificar la conexión a la base de datos
// Ejecutá esto si querés probar que la conexión a Neon funciona

const pool = require('./connection');

async function verificarConexion() {
  console.log('🔍 Verificando conexión a Neon PostgreSQL...\n');

  try {
    // Intentamos hacer una query simple
    const result = await pool.query('SELECT NOW() as tiempo_actual');
    
    console.log('✅ Conexión exitosa!');
    console.log('⏰ Hora del servidor:', result.rows[0].tiempo_actual);

    // Verificamos qué tablas existen
    const tablas = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablas.rows.length > 0) {
      console.log('\n📋 Tablas encontradas:');
      tablas.rows.forEach(tabla => {
        console.log(`  - ${tabla.table_name}`);
      });

      // Contamos registros en algunas tablas importantes
      console.log('\n📊 Registros en las tablas:');

      const conteos = [
        { tabla: 'users', nombre: 'Usuarios' },
        { tabla: 'roles', nombre: 'Roles' },
        { tabla: 'permisos', nombre: 'Permisos' },
        { tabla: 'productos', nombre: 'Productos' },
        { tabla: 'compras', nombre: 'Compras' }
      ];

      for (const { tabla, nombre } of conteos) {
        try {
          const count = await pool.query(`SELECT COUNT(*) FROM ${tabla}`);
          console.log(`  ${nombre}: ${count.rows[0].count}`);
        } catch (err) {
          console.log(`  ${nombre}: tabla no existe aún`);
        }
      }

    } else {
      console.log('\n⚠️  No se encontraron tablas.');
      console.log('Ejecutá "npm run init-db" para crear las tablas e insertar datos iniciales.');
    }

    console.log('\n✨ Todo listo para usar!\n');

  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    console.log('\n💡 Verificá que:');
    console.log('  1. La URL de DATABASE_URL en .env sea correcta');
    console.log('  2. Tengas conexión a internet');
    console.log('  3. El servicio de Neon esté funcionando\n');
  } finally {
    await pool.end();
  }
}

verificarConexion();
