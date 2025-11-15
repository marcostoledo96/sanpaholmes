// Script directo para modificar la tabla compras
const pool = require('../db/connection');

async function updateComprasTable() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Actualizando tabla compras...\n');
    
    // 1. Hacer comprador_mesa opcional (permitir NULL)
    console.log('1. Permitiendo NULL en comprador_mesa...');
    await client.query(`ALTER TABLE compras ALTER COLUMN comprador_mesa DROP NOT NULL`);
    console.log('   ✅ comprador_mesa ahora permite NULL\n');
    
    // 2. Eliminar constraint viejo
    console.log('2. Eliminando constraint viejo (1-32)...');
    await client.query(`ALTER TABLE compras DROP CONSTRAINT IF EXISTS compras_comprador_mesa_check`);
    console.log('   ✅ Constraint viejo eliminado\n');
    
    // 3. Agregar nuevo constraint (1-50 o NULL)
    console.log('3. Agregando nuevo constraint (1-50 o NULL)...');
    await client.query(`
      ALTER TABLE compras 
      ADD CONSTRAINT compras_comprador_mesa_check 
      CHECK (comprador_mesa IS NULL OR (comprador_mesa BETWEEN 1 AND 50))
    `);
    console.log('   ✅ Nuevo constraint agregado\n');
    
    // 4. Verificar cambios
    console.log('4. Verificando cambios...');
    const columnInfo = await client.query(`
      SELECT column_name, is_nullable, data_type
      FROM information_schema.columns 
      WHERE table_name = 'compras' AND column_name = 'comprador_mesa'
    `);
    console.log('   Columna comprador_mesa:', columnInfo.rows[0]);
    
    const constraintInfo = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'compras'::regclass AND conname LIKE '%mesa%'
    `);
    console.log('   Constraints:', constraintInfo.rows);
    
    console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateComprasTable().catch(console.error);
