-- Agregar campo detalles_pedido a la tabla compras
-- Este campo almacenará observaciones del cliente (vegetariano, celíaco, sin cebolla, etc)

ALTER TABLE compras 
ADD COLUMN IF NOT EXISTS detalles_pedido TEXT;

-- Comentario para documentar el campo
COMMENT ON COLUMN compras.detalles_pedido IS 'Observaciones especiales del cliente sobre el pedido (vegetariano, celíaco, alergias, preferencias)';
