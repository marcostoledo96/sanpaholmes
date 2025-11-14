// Script para resetear la base de datos
// ⚠️ CUIDADO: Este script elimina TODOS los datos
// Solo usalo si querés empezar de cero

const pool = require('./connection');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pregunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      resolve(respuesta);
    });
  });
}

async function resetearBaseDeDatos() {
  console.log('\n⚠️  ADVERTENCIA: Vas a ELIMINAR TODOS los datos de la base de datos\n');
  
  const confirmacion1 = await pregunta('¿Estás seguro? (escribí "SI" en mayúsculas): ');
  
  if (confirmacion1 !== 'SI') {
    console.log('\n❌ Operación cancelada.\n');
    rl.close();
    process.exit(0);
  }

  const confirmacion2 = await pregunta('¿Realmente querés borrar TODO? (escribí "CONFIRMO"): ');
  
  if (confirmacion2 !== 'CONFIRMO') {
    console.log('\n❌ Operación cancelada.\n');
    rl.close();
    process.exit(0);
  }

  console.log('\n🗑️  Eliminando todas las tablas...\n');

  try {
    await pool.query('DROP TABLE IF EXISTS detalle_compra CASCADE');
    console.log('  ✓ Tabla detalle_compra eliminada');

    await pool.query('DROP TABLE IF EXISTS compras CASCADE');
    console.log('  ✓ Tabla compras eliminada');

    await pool.query('DROP TABLE IF EXISTS productos CASCADE');
    console.log('  ✓ Tabla productos eliminada');

    await pool.query('DROP TABLE IF EXISTS role_permisos CASCADE');
    console.log('  ✓ Tabla role_permisos eliminada');

    await pool.query('DROP TABLE IF EXISTS user_roles CASCADE');
    console.log('  ✓ Tabla user_roles eliminada');

    await pool.query('DROP TABLE IF EXISTS permisos CASCADE');
    console.log('  ✓ Tabla permisos eliminada');

    await pool.query('DROP TABLE IF EXISTS roles CASCADE');
    console.log('  ✓ Tabla roles eliminada');

    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('  ✓ Tabla users eliminada');

    console.log('\n✅ Base de datos reseteada exitosamente.\n');
    console.log('💡 Ahora ejecutá "npm run init-db" para volver a crear todo.\n');

  } catch (error) {
    console.error('\n❌ Error al resetear:', error.message);
  } finally {
    await pool.end();
    rl.close();
  }
}

resetearBaseDeDatos();
