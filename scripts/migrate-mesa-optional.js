// Script para ejecutar la migración de campo mesa opcional
const fs = require('fs');
const path = require('path');
const pool = require('../db/connection');

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Iniciando migración: make_mesa_optional.sql');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '../db/migrations/make_mesa_optional.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar cada statement (separar por punto y coma, ignorar comentarios)
    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('\\d'))
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`Ejecutando ${statements.length} statements...`);
    
    for (const statement of statements) {
      if (statement) {
        console.log('Ejecutando:', statement.substring(0, 80) + '...');
        await client.query(statement);
      }
    }
    
    console.log('✅ Migración completada exitosamente');
    
    // Verificar el cambio
    const result = await client.query(`
      SELECT column_name, is_nullable, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'compras' AND column_name = 'comprador_mesa'
    `);
    
    console.log('Verificación de columna comprador_mesa:');
    console.log(result.rows[0]);
    
    // Verificar constraint
    const constraintResult = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conname LIKE '%comprador_mesa%'
    `);
    
    console.log('\nConstraints de comprador_mesa:');
    console.log(constraintResult.rows);
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
