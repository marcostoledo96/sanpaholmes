// Archivo de configuración para conectarse a la base de datos Neon PostgreSQL
// Acá está toda la configuración necesaria para que la app se conecte a la base de datos

const { Pool } = require('pg');

// Esta es la URL de conexión que nos dio Neon
// Incluye usuario, contraseña, host y nombre de la base de datos
const connectionString = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_UI1cJxXKOG2u@ep-young-thunder-a4t6hx3f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Creamos un "pool" de conexiones
// Esto permite reutilizar las conexiones a la BD en lugar de crear una nueva cada vez
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necesario para conectarnos a Neon de forma segura
  },
  // Configuración de timeouts y conexiones - aumentados para móviles
  connectionTimeoutMillis: 10000, // 10 segundos para conectarse (antes 5)
  idleTimeoutMillis: 30000, // 30 segundos antes de cerrar una conexión inactiva
  max: 20, // Máximo 20 conexiones simultáneas
  query_timeout: 15000, // 15 segundos máximo para queries (nuevo)
  statement_timeout: 15000, // 15 segundos máximo para statements (nuevo)
});

// Probamos la conexión al iniciar
pool.on('connect', () => {
  console.log('✅ Conectado a Neon PostgreSQL');
});

// Si hay un error, lo mostramos
pool.on('error', (err) => {
  console.error('❌ Error en la conexión a la base de datos:', err);
});

// Exportamos el pool para usarlo en otros archivos
module.exports = pool;
