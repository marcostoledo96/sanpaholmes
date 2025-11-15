// ====================================================================
// GOOGLE APPS SCRIPT PARA EXPORTAR VENTAS CON LIMPIEZA AUTOMÁTICA
// ====================================================================
// 
// INSTRUCCIONES:
// 1. Abrí tu Google Sheet
// 2. Extensiones → Apps Script
// 3. Borrá todo el código que haya y pegá este
// 4. Guardá (Ctrl+S)
// 5. Implementar → Nueva implementación
// 6. Tipo: Aplicación web
// 7. Ejecutar como: Tu cuenta
// 8. Quién tiene acceso: Cualquiera
// 9. Copiá la URL que te da
//
// ====================================================================

function doPost(e) {
  try {
    // Parsear los datos recibidos del frontend
    const data = JSON.parse(e.postData.contents);
    const ventas = data.ventas;
    const clearBefore = data.clearBefore || false;
    
    // Abrir la hoja de cálculo activa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ===== LIMPIEZA DE DATOS ANTERIORES =====
    if (clearBefore) {
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      
      // Si hay datos, limpiar TODO (incluso encabezados)
      if (lastRow > 0) {
        // Limpiar todo el contenido
        sheet.clear();
        Logger.log('HOJA LIMPIADA COMPLETAMENTE');
      }
    }
    
    // ===== CREAR O VERIFICAR ENCABEZADOS =====
    if (sheet.getLastRow() === 0 || sheet.getLastRow() === 1) {
      // Si está vacío o solo tiene encabezados, agregar/reemplazar encabezados
      sheet.getRange(1, 1, 1, 12).setValues([[
        'ID Orden', 
        'Fecha', 
        'Cliente', 
        'Teléfono', 
        'Mesa', 
        'Método de Pago', 
        'Total', 
        'Abonado', 
        'Listo',
        'Entregado', 
        'Detalles', 
        'Productos'
      ]]);
      
      // Formatear encabezados
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setBackground('#fbbf24');
      headerRange.setFontColor('#000000');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      Logger.log('Encabezados creados/actualizados');
    }
    
    // ===== INSERTAR NUEVAS VENTAS =====
    if (ventas && ventas.length > 0) {
      ventas.forEach(venta => {
        sheet.appendRow([
          venta.orden_id,
          venta.fecha,
          venta.cliente,
          venta.telefono,
          venta.mesa,
          venta.metodo_pago,
          venta.total,
          venta.abonado,
          venta.listo,
          venta.entregado,
          venta.detalles,
          venta.productos
        ]);
      });
      
      Logger.log('Ventas insertadas: ' + ventas.length);
    }
    
    // ===== AJUSTAR COLUMNAS AUTOMÁTICAMENTE =====
    sheet.autoResizeColumns(1, 12);
    
    // Respuesta de éxito
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: `${ventas.length} ventas procesadas correctamente`,
      cleared: clearBefore
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== FUNCIÓN DE PRUEBA (ejecutá esto para probar) =====
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        clearBefore: true,
        ventas: [
          {
            orden_id: 1,
            fecha: '15/11/2025 14:30',
            cliente: 'Test Usuario',
            telefono: '1234567890',
            mesa: 5,
            metodo_pago: 'efectivo',
            total: 3000,
            abonado: 'Sí',
            listo: 'No',
            entregado: 'No',
            detalles: 'Test',
            productos: '1x Café'
          }
        ]
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
