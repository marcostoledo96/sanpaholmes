// Script para actualizar la contraseña del usuario admin
const bcrypt = require('bcrypt');
const pool = require('../db/connection');

async function updateAdminPassword() {
  const client = await pool.connect();
  
  try {
    console.log('🔑 Actualizando contraseña del usuario admin...\n');
    
    const newPassword = 'SanpaHolmes2025';
    
    // Encriptar la nueva contraseña
    console.log('1. Encriptando nueva contraseña...');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    console.log('   ✅ Contraseña encriptada\n');
    
    // Actualizar en la base de datos
    console.log('2. Actualizando en la base de datos...');
    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2 RETURNING id, username, nombre_completo',
      [passwordHash, 'admin']
    );
    
    if (result.rows.length === 0) {
      console.log('   ❌ Usuario admin no encontrado en la base de datos');
      return;
    }
    
    console.log('   ✅ Contraseña actualizada exitosamente\n');
    
    console.log('📋 Información del usuario:');
    console.log('   ID:', result.rows[0].id);
    console.log('   Username:', result.rows[0].username);
    console.log('   Nombre:', result.rows[0].nombre_completo);
    console.log('   Nueva contraseña:', newPassword);
    
    console.log('\n✅ ACTUALIZACIÓN COMPLETADA');
    console.log('   Credenciales de acceso:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: SanpaHolmes2025');
    
  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateAdminPassword().catch(console.error);
