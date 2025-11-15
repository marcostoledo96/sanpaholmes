-- Hacer el campo comprador_mesa opcional y aumentar límite a 50
-- Ejecutar esta migración para permitir pedidos sin número de mesa

ALTER TABLE compras 
  ALTER COLUMN comprador_mesa DROP NOT NULL;

-- Eliminar el constraint viejo (1-32)
ALTER TABLE compras 
  DROP CONSTRAINT IF EXISTS compras_comprador_mesa_check;

-- Agregar nuevo constraint (1-50 o NULL)
ALTER TABLE compras 
  ADD CONSTRAINT compras_comprador_mesa_check 
  CHECK (comprador_mesa IS NULL OR (comprador_mesa BETWEEN 1 AND 50));

-- Verificar los cambios
\d compras
