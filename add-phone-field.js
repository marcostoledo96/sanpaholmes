// Migración: Agregar campo telefono a la tabla compras
const pool = require('./db/connection');

async function agregarCampoTelefono() {
  console.log('🔧 Agregando campo telefono a la tabla compras...\n');

  try {
    // Verificar si el campo ya existe
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'compras' 
      AND column_name = 'comprador_telefono'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ El campo comprador_telefono ya existe en la tabla compras');
    } else {
      // Agregar el campo
      await pool.query(`
        ALTER TABLE compras 
        ADD COLUMN comprador_telefono VARCHAR(50)
      `);
      console.log('✅ Campo comprador_telefono agregado exitosamente');
    }

  } catch (error) {
    console.error('❌ Error al agregar campo:', error);
  } finally {
    await pool.end();
  }
}

agregarCampoTelefono();
