// Script para agregar permisos faltantes
const pool = require('./db/connection');

async function agregarPermisos() {
  console.log('🔐 Agregando permisos faltantes...\n');

  try {
    const permisos = [
      { nombre: 'editar_compras', descripcion: 'Puede editar compras y actualizar estados' },
      { nombre: 'eliminar_compras', descripcion: 'Puede eliminar compras' }
    ];

    for (const permiso of permisos) {
      const result = await pool.query(
        'INSERT INTO permisos (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING RETURNING *',
        [permiso.nombre, permiso.descripcion]
      );
      
      if (result.rows.length > 0) {
        console.log(`✅ Permiso agregado: ${permiso.nombre}`);
        
        // Asignar al rol admin
        const adminRole = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['admin']);
        if (adminRole.rows.length > 0) {
          await pool.query(
            'INSERT INTO role_permisos (role_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [adminRole.rows[0].id, result.rows[0].id]
          );
          console.log(`  → Asignado a rol admin`);
        }
      } else {
        console.log(`✓ Permiso ya existe: ${permiso.nombre}`);
      }
    }

    console.log('\n✅ Permisos actualizados correctamente');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

agregarPermisos();
