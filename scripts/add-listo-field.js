// Script para agregar el campo 'listo' a la tabla compras
const pool = require('../db/connection');

async function addListoField() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Agregando campo "listo" a la tabla compras...\n');
    
    // Agregar columna listo
    console.log('1. Agregando columna listo (BOOLEAN DEFAULT false)...');
    await client.query(`ALTER TABLE compras ADD COLUMN IF NOT EXISTS listo BOOLEAN DEFAULT false`);
    console.log('   ✅ Columna listo agregada\n');
    
    // Verificar cambios
    console.log('2. Verificando cambios...');
    const result = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'compras' AND column_name = 'listo'
    `);
    
    if (result.rows.length > 0) {
      console.log('   Columna listo:', result.rows[0]);
      console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    } else {
      console.log('   ⚠️  No se pudo verificar la columna');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addListoField().catch(console.error);
