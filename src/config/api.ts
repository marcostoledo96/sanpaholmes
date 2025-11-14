// Configuración de la API
// Automáticamente usa la URL correcta según el entorno

export const API_URL = import.meta.env.PROD 
  ? '' // En producción, usa rutas relativas (mismo dominio)
  : 'http://localhost:3000'; // En desarrollo, usa el servidor local

// Helper para construir URLs de API
export const getApiUrl = (endpoint: string) => {
  // Si estamos en producción, usa rutas relativas
  if (import.meta.env.PROD) {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }
  // En desarrollo, usa localhost
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Exportar también como default para imports más limpios
export default {
  API_URL,
  getApiUrl
};
