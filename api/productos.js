// API de productos
// Acá está todo lo relacionado con listar, crear, editar y eliminar productos

const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { verificarAutenticacion, verificarPermiso } = require('../middleware/auth');

// 📋 GET /api/productos - Listar todos los productos activos
// Esta ruta es pública, cualquiera puede ver los productos
router.get('/', async (req, res) => {
  try {
    const { categoria, subcategoria } = req.query;

    // Armamos la consulta según los filtros
    let query = 'SELECT * FROM productos WHERE activo = true';
    const params = [];

    if (categoria) {
      params.push(categoria);
      query += ` AND categoria = $${params.length}`;
    }

    if (subcategoria) {
      params.push(subcategoria);
      query += ` AND subcategoria = $${params.length}`;
    }

    query += ' ORDER BY categoria, subcategoria, nombre';

    const result = await pool.query(query, params);

    console.log(`📋 GET /api/productos - Devolviendo ${result.rows.length} productos`);
    if (result.rows.length > 0) {
      console.log('Ejemplo primer producto:', {
        id: result.rows[0].id,
        nombre: result.rows[0].nombre,
        categoria: result.rows[0].categoria,
        subcategoria: result.rows[0].subcategoria,
        activo: result.rows[0].activo
      });
    }

    // Headers para evitar caché
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.json({
      success: true,
      productos: result.rows
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los productos'
    });
  }
});

// 🔍 GET /api/productos/:id - Obtener un producto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el producto'
    });
  }
});

// ➕ POST /api/productos - Crear un nuevo producto
// Solo usuarios con permiso 'gestionar_productos' pueden hacer esto
router.post('/', verificarAutenticacion, verificarPermiso('gestionar_productos'), async (req, res) => {
  try {
    const { nombre, categoria, subcategoria, precio, stock, descripcion, imagen_url, activo } = req.body;

    // Logging para debug de categoria/subcategoria
    console.log('POST /api/productos - Datos recibidos:', {
      nombre,
      categoria,
      subcategoria,
      precio,
      imagen_url: imagen_url ? 'SÍ' : 'NO'
    });

    // Validamos que los campos obligatorios estén presentes
    if (!nombre || !categoria || !precio) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan datos obligatorios: nombre, categoria y precio'
      });
    }

    // Insertamos el producto con la URL de imagen directamente
    const result = await pool.query(
      `INSERT INTO productos (nombre, categoria, subcategoria, precio, stock, descripcion, imagen_url, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [nombre, categoria, subcategoria || null, precio, stock || 0, descripcion || null, imagen_url || null, activo !== undefined ? activo : true]
    );

    console.log('✅ Producto creado con ID:', result.rows[0].id, '| Categoria:', result.rows[0].categoria, '| Subcategoria:', result.rows[0].subcategoria);

    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear el producto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✏️ PUT /api/productos/:id - Actualizar un producto
// Solo usuarios con permiso 'gestionar_productos' pueden hacer esto
router.put('/:id', verificarAutenticacion, verificarPermiso('gestionar_productos'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, subcategoria, precio, stock, descripcion, imagen_url, activo } = req.body;

    console.log('📝 PUT /api/productos/:id - Datos recibidos:', { 
      id, 
      nombre, 
      categoria, 
      subcategoria, 
      precio,
      imagen_url: imagen_url ? 'SÍ' : 'NO'
    });

    // Verificamos que el producto existe
    const productoExiste = await pool.query(
      'SELECT id FROM productos WHERE id = $1',
      [id]
    );

    if (productoExiste.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    // Actualizamos el producto con la URL de imagen directamente
    const result = await pool.query(
      `UPDATE productos 
       SET nombre = COALESCE($1, nombre),
           categoria = COALESCE($2, categoria),
           subcategoria = COALESCE($3, subcategoria),
           precio = COALESCE($4, precio),
           stock = COALESCE($5, stock),
           descripcion = COALESCE($6, descripcion),
           imagen_url = COALESCE($7, imagen_url),
           activo = COALESCE($8, activo)
       WHERE id = $9
       RETURNING *`,
      [nombre, categoria, subcategoria, precio, stock, descripcion, imagen_url, activo, id]
    );

    console.log('✅ Producto actualizado ID:', id, '| Categoria:', result.rows[0].categoria, '| Subcategoria:', result.rows[0].subcategoria);

    res.json({
      success: true,
      mensaje: 'Producto actualizado exitosamente',
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el producto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 🗑️ DELETE /api/productos/:id - Eliminar (desactivar) un producto
// En realidad no lo borramos, solo lo marcamos como inactivo
// Solo usuarios con permiso 'gestionar_productos' pueden hacer esto
router.delete('/:id', verificarAutenticacion, verificarPermiso('gestionar_productos'), async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos que el producto existe
    const productoExiste = await pool.query(
      'SELECT id FROM productos WHERE id = $1',
      [id]
    );

    if (productoExiste.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    // Lo marcamos como inactivo en lugar de eliminarlo
    const result = await pool.query(
      'UPDATE productos SET activo = false WHERE id = $1 RETURNING id, nombre, activo',
      [id]
    );

    console.log('🗑️ Producto marcado como inactivo:', {
      id: result.rows[0].id,
      nombre: result.rows[0].nombre,
      activo: result.rows[0].activo
    });

    res.json({
      success: true,
      mensaje: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el producto'
    });
  }
});

module.exports = router;
