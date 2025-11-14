// Script para verificar y recrear el usuario admin
// Si tenés problemas al iniciar sesión, ejecutá este script

const pool = require('./connection');
const bcrypt = require('bcrypt');

async function verificarYRecrearAdmin() {
  console.log('🔍 Verificando usuario admin...\n');

  try {
    // 1. Buscar si existe el usuario admin
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );

    if (userCheck.rows.length > 0) {
      console.log('✅ Usuario admin encontrado en la base de datos');
      const admin = userCheck.rows[0];
      
      console.log('\n📋 Datos del admin:');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Nombre: ${admin.nombre_completo}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Activo: ${admin.activo}`);
      console.log(`   Hash de contraseña: ${admin.password_hash.substring(0, 20)}...`);

      // Probar si la contraseña admin123 funciona
      console.log('\n🔐 Verificando contraseña...');
      const passwordValida = await bcrypt.compare('admin123', admin.password_hash);
      
      if (passwordValida) {
        console.log('✅ La contraseña "admin123" es CORRECTA\n');
        console.log('🎉 TODO ESTÁ BIEN. Deberías poder iniciar sesión con:');
        console.log('   Username: admin');
        console.log('   Password: admin123\n');
      } else {
        console.log('❌ La contraseña "admin123" NO FUNCIONA\n');
        console.log('🔧 Recreando contraseña...');
        
        // Generar nuevo hash
        const nuevoHash = await bcrypt.hash('admin123', 10);
        
        // Actualizar el usuario
        await pool.query(
          'UPDATE users SET password_hash = $1 WHERE username = $2',
          [nuevoHash, 'admin']
        );
        
        console.log('✅ Contraseña actualizada correctamente\n');
        console.log('🎉 Ahora podés iniciar sesión con:');
        console.log('   Username: admin');
        console.log('   Password: admin123\n');
      }

      // Verificar roles
      const roles = await pool.query(
        `SELECT r.nombre 
         FROM roles r 
         JOIN user_roles ur ON r.id = ur.role_id 
         WHERE ur.user_id = $1`,
        [admin.id]
      );

      console.log('👤 Roles asignados:');
      if (roles.rows.length > 0) {
        roles.rows.forEach(role => {
          console.log(`   - ${role.nombre}`);
        });
      } else {
        console.log('   ⚠️  No tiene roles asignados');
        
        // Asignar rol admin
        console.log('\n🔧 Asignando rol admin...');
        const adminRole = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['admin']);
        
        if (adminRole.rows.length > 0) {
          await pool.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [admin.id, adminRole.rows[0].id]
          );
          console.log('✅ Rol admin asignado correctamente');
        }
      }

    } else {
      console.log('❌ Usuario admin NO encontrado en la base de datos\n');
      console.log('🔧 Creando usuario admin...\n');

      // Crear el usuario admin
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      const result = await pool.query(
        'INSERT INTO users (username, password_hash, nombre_completo, email) VALUES ($1, $2, $3, $4) RETURNING id',
        ['admin', passwordHash, 'Administrador', 'admin@sanpaholmes.com']
      );

      console.log('✅ Usuario admin creado exitosamente');

      // Asignar rol admin
      const adminRole = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['admin']);
      
      if (adminRole.rows.length > 0) {
        await pool.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [result.rows[0].id, adminRole.rows[0].id]
        );
        console.log('✅ Rol admin asignado');
      } else {
        console.log('⚠️  Rol "admin" no existe en la base de datos');
        console.log('   Ejecutá npm run init-db para crear las tablas y roles');
      }

      console.log('\n🎉 Usuario admin creado correctamente:');
      console.log('   Username: admin');
      console.log('   Password: admin123\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('relation "users" does not exist')) {
      console.log('\n💡 La tabla "users" no existe.');
      console.log('   Ejecutá: npm run init-db\n');
    }
  } finally {
    await pool.end();
  }
}

// Ejecutar
verificarYRecrearAdmin();
