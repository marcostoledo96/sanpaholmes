/**
 * ============================================================================
 * API DE AUTENTICACIÓN (auth.js)
 * ============================================================================
 * 
 * Este archivo maneja todo lo relacionado con el inicio de sesión y la
 * autenticación de usuarios (vendedores y administradores).
 * 
 * ¿QUÉ ES UNA API?
 * Una API (Interfaz de Programación de Aplicaciones) es como un mesero en un
 * restaurante: toma tu pedido (petición), va a la cocina (base de datos), 
 * y te trae lo que pediste (respuesta).
 * 
 * TECNOLOGÍAS USADAS:
 * - Express: Framework de Node.js para crear el servidor
 * - bcrypt: Para encriptar y verificar contraseñas de forma segura
 * - JWT (JsonWebToken): Para crear tokens de autenticación
 * - PostgreSQL: Base de datos donde guardamos los usuarios
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * JWT_SECRET: La clave secreta para firmar tokens
 * 
 * ¿QUÉ ES UN TOKEN JWT?
 * Un JWT es como un pase VIP digital. Cuando el usuario inicia sesión,
 * le damos un token que demuestra quién es. Este token es como una firma
 * digital que solo nosotros podemos verificar.
 * 
 * La leemos desde las variables de entorno (.env) por seguridad.
 * Si no existe, usamos una por defecto (solo para desarrollo).
 */
const JWT_SECRET = process.env.JWT_SECRET || 'sanpaholmes-secret-key-2025';

/**
 * ============================================================================
 * ENDPOINT: POST /api/auth/login
 * ============================================================================
 * 
 * Este endpoint maneja el inicio de sesión de usuarios.
 * 
 * ¿QUÉ HACE?
 * 1. Recibe username y password del usuario
 * 2. Busca el usuario en la base de datos
 * 3. Verifica que la contraseña sea correcta
 * 4. Obtiene los roles y permisos del usuario
 * 5. Genera un token JWT
 * 6. Devuelve el token y los datos del usuario
 * 
 * EJEMPLO DE PETICIÓN:
 * POST http://localhost:3000/api/auth/login
 * Body: { "username": "admin", "password": "admin123" }
 * 
 * EJEMPLO DE RESPUESTA:
 * {
 *   "success": true,
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "usuario": {
 *     "id": 1,
 *     "username": "admin",
 *     "roles": ["admin"],
 *     "permisos": ["ver_ventas", "gestionar_productos"]
 *   }
 * }
 */
router.post('/login', async (req, res) => {
  try {
    // Paso 1: Extraemos username y password del body de la petición
    // req.body contiene los datos que envió el frontend
    const { username, password } = req.body;

    // Paso 2: Validación básica - verificamos que vengan los datos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan el usuario y/o la contraseña'
      });
    }

    // Paso 3: Buscamos el usuario en la base de datos
    // pool.query ejecuta una consulta SQL en PostgreSQL
    // $1 es un parámetro que se reemplaza por el valor de username
    // Esto previene ataques de SQL Injection (muy importante para seguridad)
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND activo = true',
      [username]
    );

    // Si no encontramos ningún usuario, respondemos con error 401
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Obtenemos el primer (y único) resultado
    const user = userResult.rows[0];

    // Paso 4: Verificamos la contraseña
    // bcrypt.compare compara la contraseña ingresada con el hash guardado
    // 
    // ¿POR QUÉ USAR BCRYPT?
    // Nunca guardamos contraseñas en texto plano por seguridad.
    // bcrypt convierte "admin123" en algo como:
    // "$2b$10$XQ9Z8N9k1K2L3M4N5O6P7Q..."
    // Es un proceso de un solo sentido: puedes crear el hash pero no revertirlo
    const passwordValida = await bcrypt.compare(password, user.password_hash);

    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Paso 5: Obtenemos los roles del usuario
    // Un usuario puede tener múltiples roles (admin, vendedor, etc.)
    // Hacemos un JOIN entre las tablas users, user_roles y roles
    const rolesResult = await pool.query(
      `SELECT r.id, r.nombre
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    // Paso 6: Obtenemos los permisos del usuario
    // Los permisos definen qué puede hacer el usuario
    // (ver_ventas, gestionar_productos, etc.)
    const permisosResult = await pool.query(
      `SELECT DISTINCT p.nombre
       FROM permisos p
       JOIN role_permisos rp ON p.id = rp.permiso_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    // Convertimos los resultados en arrays simples de strings
    const roles = rolesResult.rows.map(r => r.nombre);
    const permisos = permisosResult.rows.map(p => p.nombre);

    // Paso 7: Generamos el token JWT
    // 
    // ¿CÓMO FUNCIONA JWT?
    // 1. Tomamos datos del usuario (userId, username, roles, permisos)
    // 2. Los "firmamos" con nuestra clave secreta (JWT_SECRET)
    // 3. El resultado es un string largo que solo nosotros podemos verificar
    // 4. Este token se envía en cada petición futura para identificar al usuario
    // 
    // El token tiene 3 partes separadas por puntos:
    // Header.Payload.Signature
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        roles: roles,
        permisos: permisos
      },
      JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 24 horas
    );

    // Paso 8: Respondemos con éxito
    // Enviamos el token y los datos del usuario al frontend
    res.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      token: token,
      usuario: {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        email: user.email,
        roles: roles,
        permisos: permisos
      }
    });

  } catch (error) {
    // Si algo sale mal, capturamos el error y respondemos con 500
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión'
    });
  }
});

/**
 * ============================================================================
 * ENDPOINT: GET /api/auth/me
 * ============================================================================
 * 
 * Este endpoint devuelve la información del usuario actualmente autenticado.
 * 
 * ¿PARA QUÉ SIRVE?
 * El frontend puede usar este endpoint para verificar que el token sigue
 * siendo válido y obtener los datos actualizados del usuario.
 * 
 * REQUIERE AUTENTICACIÓN:
 * Sí - El usuario debe enviar su token JWT en el header Authorization
 * 
 * EJEMPLO DE PETICIÓN:
 * GET http://localhost:3000/api/auth/me
 * Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * 
 * EJEMPLO DE RESPUESTA:
 * {
 *   "success": true,
 *   "usuario": {
 *     "id": 1,
 *     "username": "admin",
 *     "nombre_completo": "Administrador",
 *     "email": "admin@sanpaholmes.com",
 *     "roles": ["admin"],
 *     "permisos": ["ver_ventas", "gestionar_productos"]
 *   }
 * }
 */
router.get('/me', async (req, res) => {
  try {
    // Paso 1: Extraemos el token del header Authorization
    // El formato es: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        mensaje: 'No se proporcionó token de autenticación'
      });
    }

    // Quitamos "Bearer " para obtener solo el token
    const token = authHeader.substring(7);

    // Paso 2: Verificamos el token
    // jwt.verify verifica que:
    // - El token fue firmado con nuestra clave secreta
    // - El token no ha expirado
    // - El token no ha sido modificado
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido o expirado'
      });
    }

    // Paso 3: Obtenemos los datos actualizados del usuario
    const userResult = await pool.query(
      'SELECT id, username, nombre_completo, email FROM users WHERE id = $1 AND activo = true',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const user = userResult.rows[0];

    // Paso 4: Obtenemos roles y permisos actualizados
    const rolesResult = await pool.query(
      `SELECT r.nombre
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    const permisosResult = await pool.query(
      `SELECT DISTINCT p.nombre
       FROM permisos p
       JOIN role_permisos rp ON p.id = rp.permiso_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    // Paso 5: Respondemos con los datos del usuario
    res.json({
      success: true,
      usuario: {
        ...user,
        roles: rolesResult.rows.map(r => r.nombre),
        permisos: permisosResult.rows.map(p => p.nombre)
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener información del usuario'
    });
  }
});

/**
 * ============================================================================
 * ENDPOINT: POST /api/auth/cambiar-password
 * ============================================================================
 * 
 * Este endpoint permite a un usuario cambiar su contraseña.
 * 
 * REQUIERE AUTENTICACIÓN: Sí
 * 
 * EJEMPLO DE PETICIÓN:
 * POST http://localhost:3000/api/auth/cambiar-password
 * Headers: { "Authorization": "Bearer <token>" }
 * Body: {
 *   "password_actual": "admin123",
 *   "password_nueva": "nuevaPassword123"
 * }
 */
router.post('/cambiar-password', async (req, res) => {
  try {
    // Verificamos autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        mensaje: 'No autorizado'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { password_actual, password_nueva } = req.body;

    // Validaciones
    if (!password_actual || !password_nueva) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan datos requeridos'
      });
    }

    if (password_nueva.length < 6) {
      return res.status(400).json({
        success: false,
        mensaje: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtenemos el usuario
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const user = userResult.rows[0];

    // Verificamos la contraseña actual
    const passwordValida = await bcrypt.compare(password_actual, user.password_hash);

    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptamos la nueva contraseña
    // El número 10 es el "salt rounds" - qué tan fuerte es la encriptación
    const nuevoHash = await bcrypt.hash(password_nueva, 10);

    // Actualizamos en la base de datos
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [nuevoHash, user.id]
    );

    res.json({
      success: true,
      mensaje: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cambiar contraseña'
    });
  }
});

// Exportamos el router para que server.js pueda usarlo
module.exports = router;
