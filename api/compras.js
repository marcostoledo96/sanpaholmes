// API de compras
// Acá se registran las compras, se valida el stock y se guarda el comprobante como Base64

const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const multer = require('multer');
const { verificarAutenticacion, verificarPermiso } = require('../middleware/auth');

// Configuración de multer para mantener archivo en MEMORIA (no en disco)
// Esto es necesario porque Vercel serverless no permite escribir en disco
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 3 * 1024 * 1024 // Máximo 3MB (más seguro para Base64 en PostgreSQL)
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const mimetype = tiposPermitidos.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP)'));
    }
  }
});

// 🛍️ POST /api/compras - Crear una nueva compra
// Esta ruta es pública, cualquier comprador puede usarla
router.post('/', upload.single('comprobante'), async (req, res) => {
  const client = await pool.connect(); // Usamos una transacción

  try {
    console.log('=== INICIO POST /api/compras ===');
    console.log('Body keys:', Object.keys(req.body));
    console.log('File exists:', !!req.file);
    if (req.file) {
      console.log('File size:', req.file.size, 'bytes');
      console.log('File mimetype:', req.file.mimetype);
    }

    const { comprador_nombre, comprador_telefono, comprador_mesa, metodo_pago, productos, detalles_pedido } = req.body;

    console.log('comprador_nombre:', comprador_nombre);
    console.log('comprador_mesa:', comprador_mesa);
    console.log('metodo_pago:', metodo_pago);
    console.log('productos type:', typeof productos);
    console.log('productos:', productos?.substring ? productos.substring(0, 100) : productos);

    // Normalizar comprador_mesa: convertir string vacío a null
    const mesaNormalizada = comprador_mesa && comprador_mesa !== '' ? parseInt(comprador_mesa) : null;
    console.log('mesaNormalizada:', mesaNormalizada);

    // Validamos los datos obligatorios (mesa ya no es obligatoria)
    if (!comprador_nombre || !metodo_pago) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan datos obligatorios: comprador_nombre y metodo_pago'
      });
    }

    // Validamos que la mesa (si existe) esté entre 1 y 50
    if (mesaNormalizada && (mesaNormalizada < 1 || mesaNormalizada > 50)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El número de mesa debe estar entre 1 y 50'
      });
    }

    // Validamos el método de pago
    if (!['efectivo', 'transferencia'].includes(metodo_pago)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El método de pago debe ser "efectivo" o "transferencia"'
      });
    }

    // Si es transferencia, debe haber comprobante
    if (metodo_pago === 'transferencia' && !req.file) {
      return res.status(400).json({
        success: false,
        mensaje: 'Para transferencia es obligatorio subir el comprobante'
      });
    }

    // Parseamos los productos (viene como JSON string)
    let productosArray;
    try {
      productosArray = typeof productos === 'string' ? JSON.parse(productos) : productos;
    } catch (error) {
      return res.status(400).json({
        success: false,
        mensaje: 'El formato de productos es inválido'
      });
    }

    if (!Array.isArray(productosArray) || productosArray.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debe incluir al menos un producto'
      });
    }

    // Iniciamos la transacción
    await client.query('BEGIN');

    // 1️⃣ Validamos el stock de cada producto
    for (const item of productosArray) {
      const { producto_id, cantidad } = item;

      const producto = await client.query(
        'SELECT id, nombre, precio, stock FROM productos WHERE id = $1 AND activo = true',
        [producto_id]
      );

      if (producto.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          mensaje: `El producto con ID ${producto_id} no existe o no está disponible`
        });
      }

      if (producto.rows[0].stock < cantidad) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          mensaje: `No hay suficiente stock de ${producto.rows[0].nombre}. Stock disponible: ${producto.rows[0].stock}`
        });
      }
    }

    // 2️⃣ Calculamos el total
    let total = 0;
    for (const item of productosArray) {
      const producto = await client.query(
        'SELECT precio FROM productos WHERE id = $1',
        [item.producto_id]
      );
      total += producto.rows[0].precio * item.cantidad;
    }

    // 3️⃣ Registramos la compra
    // Si hay archivo, lo convertimos a Base64 con el formato data:image/jpeg;base64,...
    let comprobante_archivo = null;
    if (req.file) {
      console.log('Convirtiendo archivo a Base64...');
      console.log('Buffer size:', req.file.buffer.length);
      
      try {
        const base64String = req.file.buffer.toString('base64');
        comprobante_archivo = `data:${req.file.mimetype};base64,${base64String}`;
        console.log('Base64 length:', comprobante_archivo.length);
        
        // Verificar que no exceda 10MB en Base64 (límite razonable para PostgreSQL TEXT)
        if (comprobante_archivo.length > 10 * 1024 * 1024) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            success: false,
            mensaje: 'El archivo es demasiado grande. Por favor usá una imagen más pequeña o de menor calidad.'
          });
        }
      } catch (conversionError) {
        console.error('Error al convertir a Base64:', conversionError);
        await client.query('ROLLBACK');
        return res.status(500).json({
          success: false,
          mensaje: 'Error al procesar el archivo'
        });
      }
    }

    console.log('Insertando compra en BD...');
    const compra = await client.query(
      `INSERT INTO compras (comprador_nombre, comprador_telefono, comprador_mesa, metodo_pago, comprobante_archivo, total, detalles_pedido)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [comprador_nombre, comprador_telefono || null, mesaNormalizada, metodo_pago, comprobante_archivo, total, detalles_pedido || null]
    );
    console.log('Compra insertada con ID:', compra.rows[0].id);

    // 4️⃣ Registramos el detalle de la compra y descontamos stock
    for (const item of productosArray) {
      const { producto_id, cantidad } = item;

      // Obtenemos el precio actual del producto
      const producto = await client.query(
        'SELECT precio FROM productos WHERE id = $1',
        [producto_id]
      );

      const precio_unitario = producto.rows[0].precio;
      const subtotal = precio_unitario * cantidad;

      // Insertamos el detalle
      await client.query(
        `INSERT INTO detalle_compra (compra_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [compra.rows[0].id, producto_id, cantidad, precio_unitario, subtotal]
      );

      // Descontamos el stock
      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [cantidad, producto_id]
      );
    }

    // Confirmamos la transacción
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      mensaje: 'Compra registrada exitosamente',
      compra: compra.rows[0]
    });

  } catch (error) {
    // Si hay algún error, revertimos todo
    await client.query('ROLLBACK');
    console.error('Error al crear compra:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      mensaje: 'Error al procesar la compra',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
});

// 📋 GET /api/compras - Listar todas las compras
// Solo usuarios con permiso 'ver_compras' pueden hacer esto
router.get('/', verificarAutenticacion, verificarPermiso('ver_compras'), async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, mesa } = req.query;

    // Armamos la consulta según los filtros
    let query = 'SELECT * FROM compras WHERE 1=1';
    const params = [];

    if (fecha_desde) {
      params.push(fecha_desde);
      query += ` AND fecha >= $${params.length}`;
    }

    if (fecha_hasta) {
      params.push(fecha_hasta);
      query += ` AND fecha <= $${params.length}`;
    }

    if (mesa) {
      params.push(mesa);
      query += ` AND comprador_mesa = $${params.length}`;
    }

    query += ' ORDER BY fecha DESC';

    const result = await pool.query(query, params);

    // Para cada compra, obtenemos sus detalles
    const comprasConDetalles = await Promise.all(
      result.rows.map(async (compra) => {
        const detallesResult = await pool.query(
          `SELECT dc.*, p.nombre as producto_nombre
           FROM detalle_compra dc
           JOIN productos p ON dc.producto_id = p.id
           WHERE dc.compra_id = $1`,
          [compra.id]
        );
        
        return {
          ...compra,
          detalles: detallesResult.rows
        };
      })
    );

    res.json({
      success: true,
      compras: comprasConDetalles
    });

  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las compras'
    });
  }
});

// 🔍 GET /api/compras/:id - Obtener detalle de una compra específica
// Solo usuarios con permiso 'ver_compras' pueden hacer esto
router.get('/:id', verificarAutenticacion, verificarPermiso('ver_compras'), async (req, res) => {
  try {
    const { id } = req.params;

    // Obtenemos la compra
    const compra = await pool.query(
      'SELECT * FROM compras WHERE id = $1',
      [id]
    );

    if (compra.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Compra no encontrada'
      });
    }

    // Obtenemos el detalle de la compra con los nombres de los productos
    const detalle = await pool.query(
      `SELECT dc.*, p.nombre as producto_nombre
       FROM detalle_compra dc
       JOIN productos p ON dc.producto_id = p.id
       WHERE dc.compra_id = $1`,
      [id]
    );

    res.json({
      success: true,
      compra: compra.rows[0],
      detalle: detalle.rows
    });

  } catch (error) {
    console.error('Error al obtener detalle de compra:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el detalle de la compra'
    });
  }
});

// 🔄 PUT /api/compras/:id/productos - Actualizar productos de una compra
// Solo usuarios con permiso 'editar_compras' pueden hacer esto
router.put('/:id/productos', verificarAutenticacion, verificarPermiso('editar_compras'), async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { productos } = req.body; // Array: [{producto_id, cantidad, precio_unitario, subtotal}]

    // Validar que exista la compra
    const compraExiste = await client.query('SELECT id FROM compras WHERE id = $1', [id]);
    if (compraExiste.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Compra no encontrada'
      });
    }

    // Validar que se envíen productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debe enviar al menos un producto'
      });
    }

    await client.query('BEGIN');

    // Eliminar todos los productos existentes de esta compra
    await client.query('DELETE FROM detalle_compra WHERE compra_id = $1', [id]);

    // Insertar los productos actualizados y calcular el nuevo total
    let nuevoTotal = 0;
    
    for (const prod of productos) {
      // Validar que el producto exista
      const productoExiste = await client.query('SELECT id FROM productos WHERE id = $1', [prod.producto_id]);
      if (productoExiste.rows.length === 0) {
        throw new Error(`Producto con ID ${prod.producto_id} no encontrado`);
      }

      await client.query(
        `INSERT INTO detalle_compra (compra_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, prod.producto_id, prod.cantidad, prod.precio_unitario, prod.subtotal]
      );
      
      nuevoTotal += parseFloat(prod.subtotal);
    }

    // Actualizar el total de la compra
    await client.query(
      'UPDATE compras SET total = $1 WHERE id = $2',
      [nuevoTotal, id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      mensaje: 'Productos actualizados correctamente',
      nuevoTotal: nuevoTotal
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar productos:', error);
    res.status(500).json({
      success: false,
      mensaje: error.message || 'Error al actualizar los productos'
    });
  } finally {
    client.release();
  }
});

// 📊 GET /api/compras/estadisticas/ventas - Obtener estadísticas de ventas
// Solo usuarios con permiso 'ver_compras' pueden hacer esto
router.get('/estadisticas/ventas', verificarAutenticacion, verificarPermiso('ver_compras'), async (req, res) => {
  try {
    // Total de ventas
    const totalVentas = await pool.query(
      'SELECT COUNT(*) as total, SUM(total) as monto_total FROM compras'
    );

    // Ventas por método de pago
    const ventasPorMetodo = await pool.query(
      `SELECT metodo_pago, COUNT(*) as cantidad, SUM(total) as monto
       FROM compras
       GROUP BY metodo_pago`
    );

    // Productos más vendidos
    const productosMasVendidos = await pool.query(
      `SELECT p.nombre, SUM(dc.cantidad) as cantidad_vendida, SUM(dc.subtotal) as monto_total
       FROM detalle_compra dc
       JOIN productos p ON dc.producto_id = p.id
       GROUP BY p.id, p.nombre
       ORDER BY cantidad_vendida DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      estadisticas: {
        total_ventas: totalVentas.rows[0],
        ventas_por_metodo: ventasPorMetodo.rows,
        productos_mas_vendidos: productosMasVendidos.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las estadísticas'
    });
  }
});

// 🔄 PATCH /api/compras/:id/estado - Actualizar estado de una compra (abonado/listo/entregado)
router.patch('/:id/estado', verificarAutenticacion, verificarPermiso('editar_compras'), async (req, res) => {
  try {
    const { id } = req.params;
    const { abonado, listo, entregado } = req.body;

    // Construir la consulta dinámicamente según los campos que se envíen
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (typeof abonado === 'boolean') {
      updates.push(`abonado = $${paramCount}`);
      values.push(abonado);
      paramCount++;
    }

    if (typeof listo === 'boolean') {
      updates.push(`listo = $${paramCount}`);
      values.push(listo);
      paramCount++;
    }

    if (typeof entregado === 'boolean') {
      updates.push(`entregado = $${paramCount}`);
      values.push(entregado);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debe proporcionar al menos un campo a actualizar (abonado, listo o entregado)'
      });
    }

    values.push(id);
    const query = `
      UPDATE compras 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Compra no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Estado actualizado correctamente',
      compra: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el estado de la compra'
    });
  }
});

// 🗑️ DELETE /api/compras/:id - Eliminar una compra
router.delete('/:id', verificarAutenticacion, verificarPermiso('eliminar_compras'), async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que existe la compra
    const compra = await pool.query('SELECT * FROM compras WHERE id = $1', [id]);

    if (compra.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Compra no encontrada'
      });
    }

    // Eliminar la compra (el detalle_compra se eliminará en cascada)
    await pool.query('DELETE FROM compras WHERE id = $1', [id]);

    res.json({
      success: true,
      mensaje: 'Compra eliminada correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar compra:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la compra'
    });
  }
});

// ✏️ PUT /api/compras/:id - Actualizar información de una compra
router.put('/:id', verificarAutenticacion, verificarPermiso('editar_compras'), async (req, res) => {
  try {
    const { id } = req.params;
    const { comprador_nombre, comprador_telefono, comprador_mesa } = req.body;

    // Validar que la mesa esté en el rango correcto
    if (comprador_mesa && (comprador_mesa < 1 || comprador_mesa > 32)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El número de mesa debe estar entre 1 y 32'
      });
    }

    const result = await pool.query(
      `UPDATE compras 
       SET comprador_nombre = COALESCE($1, comprador_nombre),
           comprador_telefono = COALESCE($2, comprador_telefono),
           comprador_mesa = COALESCE($3, comprador_mesa)
       WHERE id = $4
       RETURNING *`,
      [comprador_nombre, comprador_telefono, comprador_mesa, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Compra no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Compra actualizada correctamente',
      compra: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar compra:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar la compra'
    });
  }
});

module.exports = router;
