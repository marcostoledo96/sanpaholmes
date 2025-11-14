// Servidor principal con Express
// Acá está toda la configuración del servidor y las rutas de la API

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors()); // Permite peticiones desde otros dominios
app.use(express.json()); // Para leer JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para leer formularios

// Servimos los archivos estáticos (imágenes, CSS, JS)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
const productosRouter = require('./api/productos');
const comprasRouter = require('./api/compras');
const authRouter = require('./api/auth');
const pool = require('./db/connection');

app.use('/api/productos', productosRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/auth', authRouter);

// Ruta de prueba para verificar que el servidor y la BD funcionan
app.get('/api/health', async (req, res) => {
  try {
    // Probamos la conexión a la base de datos
    const result = await pool.query('SELECT NOW() as timestamp, version() as version');
    
    res.json({
      success: true,
      mensaje: '✅ API y Base de Datos funcionando correctamente',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        timestamp: result.rows[0].timestamp,
        version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ Error en health check:', error);
    res.status(503).json({
      success: false,
      mensaje: '❌ Error de conexión a la base de datos',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      },
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Ruta para la raíz - sirve el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Solo iniciamos el servidor si no estamos en Vercel
// En Vercel, esto se maneja automáticamente
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🛍️ API Productos: http://localhost:${PORT}/api/productos`);
    console.log(`🛒 API Compras: http://localhost:${PORT}/api/compras`);
    console.log(`🔐 API Auth: http://localhost:${PORT}/api/auth/login\n`);
  });
}

// Exportamos la app para Vercel
module.exports = app;
