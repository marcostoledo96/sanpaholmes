// Script para ejecutar la migración desde PowerShell
// Este script se conecta a la base de datos y ejecuta el archivo de migración

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_UI1cJxXKOG2u@ep-young-thunder-a4t6hx3f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'add_detalles_pedido.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Ejecutando migración...');
    await pool.query(sql);
    
    console.log('✅ Migración completada exitosamente');
    console.log('   - Se agregó el campo detalles_pedido a la tabla compras');
    
  } catch (error) {
    console.error('❌ Error al ejecutar migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
