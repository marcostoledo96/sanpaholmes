// Script para agregar campos de estado a la tabla compras
const pool = require('./db/connection');

async function actualizarEsquemaCompras() {
  console.log('🔧 Actualizando esquema de la tabla compras...\n');

  try {
    // Verificar si las columnas ya existen
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'compras' 
      AND column_name IN ('abonado', 'entregado', 'comprador_telefono')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);

    // Agregar campo abonado
    if (!existingColumns.includes('abonado')) {
      await pool.query(`
        ALTER TABLE compras 
        ADD COLUMN abonado BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Campo abonado agregado');
    } else {
      console.log('✓ Campo abonado ya existe');
    }

    // Agregar campo entregado
    if (!existingColumns.includes('entregado')) {
      await pool.query(`
        ALTER TABLE compras 
        ADD COLUMN entregado BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Campo entregado agregado');
    } else {
      console.log('✓ Campo entregado ya existe');
    }

    // Agregar campo comprador_telefono si no existe
    if (!existingColumns.includes('comprador_telefono')) {
      await pool.query(`
        ALTER TABLE compras 
        ADD COLUMN comprador_telefono VARCHAR(50)
      `);
      console.log('✅ Campo comprador_telefono agregado');
    } else {
      console.log('✓ Campo comprador_telefono ya existe');
    }

    console.log('\n✅ Esquema actualizado exitosamente');

  } catch (error) {
    console.error('❌ Error al actualizar esquema:', error);
  } finally {
    await pool.end();
  }
}

actualizarEsquemaCompras();
