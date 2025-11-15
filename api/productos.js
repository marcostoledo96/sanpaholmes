// API de productos
// Acá está todo lo relacionado con listar, crear, editar y eliminar productos

const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const multer = require('multer');
const path = require('path');
const { verificarAutenticacion, verificarPermiso } = require('../middleware/auth');

// Configuración de multer para subir imágenes de productos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/productos/'); // Carpeta específica para productos
  },
  filename: function (req, file, cb) {
    // Generamos un nombre único para la imagen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetype = tiposPermitidos.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Máximo 5MB
});

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
router.post('/', verificarAutenticacion, verificarPermiso('gestionar_productos'), upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, categoria, subcategoria, precio, stock, descripcion, activo } = req.body;

    // Validamos que los campos obligatorios estén presentes
    if (!nombre || !categoria || !precio) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan datos obligatorios: nombre, categoria y precio'
      });
    }

    // Si se subió una imagen, guardamos la ruta
    const imagen_url = req.file ? `/uploads/productos/${req.file.filename}` : null;

    // Insertamos el producto
    const result = await pool.query(
      `INSERT INTO productos (nombre, categoria, subcategoria, precio, stock, descripcion, imagen_url, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [nombre, categoria, subcategoria || null, precio, stock || 0, descripcion || null, imagen_url, activo !== undefined ? activo : true]
    );

    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear el producto'
    });
  }
});

// ✏️ PUT /api/productos/:id - Actualizar un producto
// Solo usuarios con permiso 'gestionar_productos' pueden hacer esto
router.put('/:id', verificarAutenticacion, verificarPermiso('gestionar_productos'), upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, subcategoria, precio, stock, descripcion, activo } = req.body;

    // Verificamos que el producto existe
    const productoExiste = await pool.query(
      'SELECT id, imagen_url FROM productos WHERE id = $1',
      [id]
    );

    if (productoExiste.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    // Si se subió una nueva imagen, usamos esa ruta, sino mantenemos la anterior
    const imagen_url = req.file 
      ? `/uploads/productos/${req.file.filename}` 
      : productoExiste.rows[0].imagen_url;

    // Actualizamos el producto
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

    res.json({
      success: true,
      mensaje: 'Producto actualizado exitosamente',
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el producto'
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
    await pool.query(
      'UPDATE productos SET activo = false WHERE id = $1',
      [id]
    );

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
