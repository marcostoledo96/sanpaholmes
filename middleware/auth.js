// Middleware de autenticación y permisos
// Acá validamos que el usuario esté logueado y tenga los permisos necesarios

const jwt = require('jsonwebtoken');

// Clave secreta (igual que en auth.js)
const JWT_SECRET = process.env.JWT_SECRET || 'sanpaholmes-secret-key-2025';

// Middleware para verificar que el usuario esté autenticado
function verificarAutenticacion(req, res, next) {
  try {
    // Obtenemos el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        mensaje: 'No se proporcionó token de autenticación'
      });
    }

    const token = authHeader.substring(7); // Quitamos "Bearer "

    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Guardamos los datos del usuario en el request para usarlos después
    req.usuario = decoded;

    next(); // Continuamos con la siguiente función

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        mensaje: 'El token ha expirado'
      });
    }

    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido'
    });
  }
}

// Middleware para verificar que el usuario tenga un permiso específico
function verificarPermiso(permisoRequerido) {
  return (req, res, next) => {
    try {
      // Verificamos que el usuario esté autenticado
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          mensaje: 'Usuario no autenticado'
        });
      }

      // Verificamos que el usuario tenga el permiso
      if (!req.usuario.permisos.includes(permisoRequerido)) {
        return res.status(403).json({
          success: false,
          mensaje: `No tenés permiso para realizar esta acción (se requiere: ${permisoRequerido})`
        });
      }

      next(); // El usuario tiene el permiso, continuamos

    } catch (error) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al verificar permisos'
      });
    }
  };
}

// Middleware para verificar que el usuario tenga un rol específico
function verificarRol(rolRequerido) {
  return (req, res, next) => {
    try {
      // Verificamos que el usuario esté autenticado
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          mensaje: 'Usuario no autenticado'
        });
      }

      // Verificamos que el usuario tenga el rol
      if (!req.usuario.roles.includes(rolRequerido)) {
        return res.status(403).json({
          success: false,
          mensaje: `No tenés permiso para realizar esta acción (se requiere rol: ${rolRequerido})`
        });
      }

      next(); // El usuario tiene el rol, continuamos

    } catch (error) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al verificar rol'
      });
    }
  };
}

module.exports = {
  verificarAutenticacion,
  verificarPermiso,
  verificarRol
};
