-- Migración: Cambiar comprobante_archivo de VARCHAR(500) a TEXT
-- Razón: VARCHAR(500) es muy pequeño para imágenes en Base64 (que pueden ser varios MB)
-- Fecha: 2025-11-15

-- Cambiar tipo de columna
ALTER TABLE compras 
ALTER COLUMN comprobante_archivo TYPE TEXT;

-- Verificar el cambio
\d compras
