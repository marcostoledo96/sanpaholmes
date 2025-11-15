// Script para ejecutar migración: VARCHAR(500) -> TEXT en comprobante_archivo
const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // 1. Ver el tipo actual
    const checkType = await pool.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'compras' AND column_name = 'comprobante_archivo';
    `);
    
    console.log('📋 Tipo actual de comprobante_archivo:', checkType.rows[0]);
    
    // 2. Cambiar a TEXT
    console.log('🔧 Ejecutando ALTER TABLE...');
    await pool.query(`
      ALTER TABLE compras 
      ALTER COLUMN comprobante_archivo TYPE TEXT;
    `);
    
    console.log('✅ Migración exitosa!');
    
    // 3. Verificar el cambio
    const verifyType = await pool.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'compras' AND column_name = 'comprobante_archivo';
    `);
    
    console.log('📋 Tipo nuevo de comprobante_archivo:', verifyType.rows[0]);
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
