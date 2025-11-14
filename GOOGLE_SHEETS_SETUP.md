# 📊 Configuración de Exportación a Google Sheets

Esta guía te ayudará a configurar la exportación automática de ventas desde el panel de administración hacia Google Sheets.

---

## 🎯 Pasos para Configurar

### Paso 1: Crear una Hoja de Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: **"SanpaHolmes - Ventas 2025"**
4. Crea los siguientes encabezados en la primera fila:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| ID Orden | Fecha | Cliente | Teléfono | Mesa | Método de Pago | Total | Abonado | Entregado | Detalles | Productos |

---

### Paso 2: Crear Google Apps Script

1. En la hoja de cálculo, ve a **Extensiones** → **Apps Script**
2. Borra todo el código que aparece por defecto
3. Pega el siguiente código:

```javascript
function doPost(e) {
  try {
    // Obtener la hoja activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos recibidos
    var data = JSON.parse(e.postData.contents);
    var ventas = data.ventas;
    
    // Si no hay ventas, retornar error
    if (!ventas || ventas.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        'success': false,
        'mensaje': 'No hay ventas para exportar'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Agregar cada venta como una nueva fila
    ventas.forEach(function(venta) {
      sheet.appendRow([
        venta.orden_id,
        venta.fecha,
        venta.cliente,
        venta.telefono,
        venta.mesa,
        venta.metodo_pago,
        venta.total,
        venta.abonado,
        venta.entregado,
        venta.detalles,
        venta.productos
      ]);
    });
    
    // Retornar éxito
    return ContentService.createTextOutput(JSON.stringify({
      'success': true,
      'mensaje': ventas.length + ' ventas agregadas correctamente'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Retornar error
    return ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'mensaje': 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función de prueba (opcional)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        ventas: [
          {
            orden_id: 1,
            fecha: '14/11/2025 20:30',
            cliente: 'Juan Pérez',
            telefono: '1234567890',
            mesa: 5,
            metodo_pago: 'efectivo',
            total: 5000,
            abonado: 'Sí',
            entregado: 'Sí',
            detalles: 'Vegetariano, sin cebolla',
            productos: '2x Café, 1x Medialunas'
          }
        ]
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. **Guardar** el proyecto con un nombre: "SanpaHolmes Ventas API"

---

### Paso 3: Implementar como Web App

1. En el editor de Apps Script, haz clic en **Implementar** → **Nueva implementación**
2. Haz clic en el ícono de engranaje ⚙️ junto a "Seleccionar tipo"
3. Selecciona **Aplicación web**
4. Configura:
   - **Descripción:** SanpaHolmes Ventas API
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
5. Haz clic en **Implementar**
6. **Copia la URL** que aparece (algo como: `https://script.google.com/macros/s/ABCD.../exec`)

---

### Paso 4: Autorizar el Script

La primera vez que implementes, Google te pedirá autorizar el script:

1. Haz clic en **Autorizar acceso**
2. Selecciona tu cuenta de Google
3. Haz clic en **Avanzado** (si aparece una advertencia)
4. Haz clic en **Ir a [nombre del proyecto] (no seguro)**
5. Haz clic en **Permitir**

---

### Paso 5: Configurar en el Panel de Admin

1. Ve a `http://localhost:5173/vendor/panel`
2. Inicia sesión con tu usuario admin
3. Ve a la pestaña **Ventas**
4. Haz clic en el botón **"Exportar a Sheets"**
5. Pega la URL del Web App que copiaste en el Paso 3
6. Haz clic en **Aceptar**

¡Listo! Tus ventas se exportarán automáticamente a Google Sheets.

---

## 🔧 Probar la Configuración

### Opción 1: Usar la función de prueba del script

1. En el editor de Apps Script
2. Selecciona la función `testDoPost` en el menú desplegable
3. Haz clic en **Ejecutar**
4. Verifica que aparezca una nueva fila en tu hoja de cálculo

### Opción 2: Exportar desde el panel

1. Crea algunas ventas de prueba en el sistema
2. Haz clic en "Exportar a Sheets"
3. Verifica que las ventas aparezcan en la hoja

---

## 📝 Notas Importantes

### Formato de Datos

El sistema exporta los siguientes campos:

- **ID Orden:** Número único de la orden
- **Fecha:** Fecha y hora de la compra (formato: DD/MM/YYYY HH:MM)
- **Cliente:** Nombre completo del comprador
- **Teléfono:** Número de contacto (o "N/A" si no proporcionó)
- **Mesa:** Número de mesa (1-32)
- **Método de Pago:** "efectivo" o "transferencia"
- **Total:** Monto total en pesos argentinos
- **Abonado:** "Sí" o "No"
- **Entregado:** "Sí" o "No"
- **Detalles:** Observaciones del cliente (vegetariano, celíaco, alergias, etc.) o "Sin observaciones"
- **Productos:** Lista de productos con formato "cantidad x nombre"

### Filtros de Búsqueda

El sistema exporta **solo las ventas filtradas**, no todas las ventas:

- Si buscas por mesa "5", solo exportará las ventas de la mesa 5
- Si buscas por nombre "Juan", solo exportará las ventas de clientes llamados Juan
- Si no hay búsqueda activa, exportará todas las ventas

### Permisos de Google Sheets

El script necesita:
- ✅ Permiso para **ver y editar** hojas de cálculo de Google
- ✅ Permiso para **conectarse a servicios externos**

Estos permisos son necesarios para que el script funcione correctamente.

---

## 🛠️ Solución de Problemas

### Error: "No se puede exportar"

**Causa:** URL del Web App incorrecta o no autorizada

**Solución:**
1. Verifica que copiaste la URL completa del Web App
2. Asegúrate de que termina en `/exec`
3. Verifica que autorizaste el script correctamente

### Error: "Las ventas no aparecen en Sheets"

**Causa:** Permisos o configuración incorrecta

**Solución:**
1. Ve al editor de Apps Script
2. Ejecuta la función `testDoPost` manualmente
3. Verifica que no haya errores en la consola
4. Asegúrate de que la hoja tenga los encabezados correctos

### Ventas duplicadas

**Causa:** Exportación múltiple de las mismas ventas

**Solución:**
- El script **no verifica duplicados**
- Usa filtros de búsqueda por fecha para exportar solo ventas nuevas
- O borra las filas antiguas antes de exportar

---

## 📊 Mejoras Opcionales

### Agregar Formato Condicional

Para destacar ventas pendientes:

1. Selecciona la columna **H (Abonado)**
2. Ve a **Formato** → **Formato condicional**
3. Regla: "El texto contiene" → "No"
4. Color de fondo: Rojo claro

### Crear Dashboard

Puedes crear gráficos automáticos:

1. **Total de ventas por día:** Gráfico de líneas
2. **Método de pago más usado:** Gráfico circular
3. **Productos más vendidos:** Gráfico de barras

### Agregar Filtros

1. Selecciona la fila de encabezados
2. Ve a **Datos** → **Crear un filtro**
3. Ahora puedes filtrar por cualquier columna

---

## 🔐 Seguridad

### Proteger la Hoja

Para evitar ediciones accidentales:

1. Ve a **Datos** → **Proteger hojas y rangos**
2. Selecciona el rango que quieres proteger
3. Define quién puede editar

### Compartir el Archivo

Para dar acceso de solo lectura a otros:

1. Haz clic en **Compartir**
2. Agrega los emails de las personas
3. Selecciona **Lector** como permiso

---

## 📚 Recursos Adicionales

- [Documentación de Google Apps Script](https://developers.google.com/apps-script)
- [Referencia de Spreadsheet API](https://developers.google.com/apps-script/reference/spreadsheet)
- [Tutorial de Web Apps](https://developers.google.com/apps-script/guides/web)

---

## ✅ Checklist de Configuración

- [ ] Hoja de cálculo creada con encabezados
- [ ] Google Apps Script creado y guardado
- [ ] Script implementado como Web App
- [ ] Permisos autorizados correctamente
- [ ] URL del Web App copiada
- [ ] URL configurada en el panel de admin
- [ ] Prueba de exportación realizada exitosamente

---

**Última actualización:** 14 de noviembre de 2025  
**Proyecto:** SanpaHolmes - Sistema de Pedidos Evento Scout 2025
