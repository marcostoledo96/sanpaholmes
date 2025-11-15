-- Agregar campo 'listo' a la tabla compras
-- Este campo indica si el pedido está listo para entregar (estado intermedio)

ALTER TABLE compras 
  ADD COLUMN IF NOT EXISTS listo BOOLEAN DEFAULT false;

-- Agregar comentario explicativo
COMMENT ON COLUMN compras.listo IS 'Indica si el pedido está listo para ser entregado al cliente';

-- Verificar los cambios
\d compras
