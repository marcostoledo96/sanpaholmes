# 📸 Guía de Imágenes del Proyecto SanpaHolmes

Esta guía te indica dónde encontrar y cómo reemplazar las imágenes placeholder del proyecto con las imágenes oficiales del evento Scout.

---

## 🎯 Ubicaciones de Imágenes a Reemplazar

### 1. **Landing Page - Logo Principal**
📁 **Archivo:** `src/components/LandingPage.tsx`  
📍 **Líneas:** 27-30

**Código actual:**
```tsx
<div className="logo-placeholder-large animate-pulse hidden sm:block">
  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#fbbf24] opacity-50" />
</div>
```

**Cómo reemplazar:**
```tsx
<img 
  src="/images/escudo-san-patricio.png" 
  alt="Escudo Grupo San Patricio" 
  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
/>
```

**Imagen esperada:** Escudo del Grupo Scout San Patricio

---

### 2. **Landing Page - Logos Secundarios (Placeholders LOGO)**
📁 **Archivo:** `src/components/LandingPage.tsx`  
📍 **Búsqueda:** Busca todos los elementos con clase `logo-placeholder`

**Ubicaciones encontradas:**
- Línea ~92: Logo de Comunidad Raider
- Línea ~109: Logo de Tropa Raider
- Otros placeholders similares

**Código actual ejemplo:**
```tsx
<div className="logo-placeholder">
  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#fbbf24] opacity-50" />
</div>
```

**Cómo reemplazar:**
```tsx
<img 
  src="/images/logo-comunidad-raider.png" 
  alt="Logo Comunidad Raider" 
  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
/>
```

**Imágenes esperadas:**
- `logo-comunidad-raider.png` - Logo de la Comunidad Raider
- `logo-tropa-raider.png` - Logo de la Tropa Raider
- `emblema-raiders.png` - Emblema Raiders
- `treboles-san-patricio.png` - Tréboles San Patricio

---

### 3. **Landing Page - Cards de Características**
📁 **Archivo:** `src/components/LandingPage.tsx`  
📍 **Líneas:** ~82-115

**Imágenes placeholder para los 5 cards:**

#### Card 1: Escudo San Patricio
```tsx
<div className="logo-placeholder-card">
  <ImageIcon />
</div>
```
**Reemplazar con:**
```tsx
<img 
  src="/images/escudo-san-patricio.png" 
  alt="Escudo San Patricio" 
  className="w-full h-full object-cover rounded-xl"
/>
```

#### Card 2: Comunidad Raider
```tsx
<img 
  src="/images/comunidad-raider.jpg" 
  alt="Comunidad Raider" 
  className="w-full h-full object-cover rounded-xl"
/>
```

#### Card 3: Tropa Raider
```tsx
<img 
  src="/images/tropa-raider.jpg" 
  alt="Tropa Raider" 
  className="w-full h-full object-cover rounded-xl"
/>
```

#### Card 4: Emblema Raiders
```tsx
<img 
  src="/images/emblema-raiders.png" 
  alt="Emblema Raiders" 
  className="w-full h-full object-cover rounded-xl"
/>
```

#### Card 5: Tréboles San Patricio
```tsx
<img 
  src="/images/treboles-san-patricio.png" 
  alt="Tréboles San Patricio" 
  className="w-full h-full object-cover rounded-xl"
/>
```

---

## 📂 Estructura de Carpetas Recomendada

Crea la siguiente estructura en la carpeta `public` del proyecto:

```
public/
├── images/
│   ├── logos/
│   │   ├── escudo-san-patricio.png
│   │   ├── logo-comunidad-raider.png
│   │   ├── logo-tropa-raider.png
│   │   ├── emblema-raiders.png
│   │   └── treboles-san-patricio.png
│   │
│   ├── cards/
│   │   ├── comunidad-raider.jpg
│   │   └── tropa-raider.jpg
│   │
│   └── backgrounds/
│       └── hero-background.jpg (opcional)
```

---

## 🎨 Especificaciones de Imágenes

### Logos Principales
- **Formato:** PNG con fondo transparente
- **Tamaño recomendado:** 512x512px o superior
- **Peso máximo:** 200KB por imagen

### Imágenes de Cards
- **Formato:** JPG o PNG
- **Tamaño recomendado:** 400x300px o superior
- **Peso máximo:** 500KB por imagen
- **Ratio:** 4:3 preferentemente

### Logos Pequeños (Placeholders)
- **Formato:** PNG con fondo transparente
- **Tamaño recomendado:** 256x256px
- **Peso máximo:** 100KB

---

## 🔧 Cómo Aplicar los Cambios

### Paso 1: Preparar las Imágenes
1. Reúne todas las imágenes oficiales del evento
2. Optimízalas usando herramientas como TinyPNG o Squoosh
3. Renómbralas según los nombres indicados arriba

### Paso 2: Subir las Imágenes
1. Crea la carpeta `public/images` si no existe
2. Crea las subcarpetas `logos`, `cards` y `backgrounds`
3. Copia las imágenes a sus carpetas correspondientes

### Paso 3: Reemplazar el Código
1. Abre `src/components/LandingPage.tsx`
2. Busca cada `<div className="logo-placeholder...">` 
3. Reemplázalo con la etiqueta `<img>` correspondiente usando los ejemplos de esta guía

### Paso 4: Verificar
1. Ejecuta el proyecto: `npm run dev`
2. Visita http://localhost:5173
3. Verifica que todas las imágenes se muestren correctamente
4. Ajusta tamaños si es necesario modificando las clases de Tailwind

---

## 🎭 Placeholders CSS Personalizados

Si necesitas estilizar los placeholders mientras esperas las imágenes reales, puedes usar estas clases CSS que ya están definidas:

```css
.logo-placeholder {
  /* Placeholder pequeño para logos */
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 100%);
  border: 2px dashed #fbbf24;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder-large {
  /* Placeholder grande para logo principal */
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 100%);
  border: 2px dashed #fbbf24;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder-card {
  /* Placeholder para cards de características */
  width: 100%;
  height: 10rem;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px dashed #fbbf24;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 💡 Consejos Adicionales

### Optimización de Imágenes
- Usa **WebP** para mejor compresión (opcional)
- Mantén las imágenes **por debajo de 500KB**
- Usa **lazy loading** para imágenes que no están en el viewport inicial

### Rutas Relativas vs Absolutas
- `/images/...` busca en `public/images/`
- No uses `./images/` o `../images/` en componentes React
- Vite maneja automáticamente los assets en `public/`

### Backup
- Guarda las imágenes originales en una carpeta separada
- Mantén versiones sin comprimir por si necesitas editarlas

---

## ✅ Checklist de Imágenes

Marca las imágenes que ya has reemplazado:

- [ ] Escudo Grupo San Patricio (logo principal)
- [ ] Logo Comunidad Raider
- [ ] Logo Tropa Raider
- [ ] Emblema Raiders
- [ ] Tréboles San Patricio
- [ ] Card: Escudo San Patricio
- [ ] Card: Comunidad Raider
- [ ] Card: Tropa Raider
- [ ] Card: Emblema Raiders
- [ ] Card: Tréboles San Patricio

---

## 🆘 Soporte

Si tienes problemas con las imágenes:

1. **Imágenes no se ven:** Verifica que estén en `public/images/` y no en `src/`
2. **Imágenes pixeladas:** Usa imágenes de mayor resolución (2x el tamaño mostrado)
3. **Imágenes muy pesadas:** Optimízalas con https://tinypng.com
4. **Formatos no soportados:** Convierte a PNG o JPG

---

**Última actualización:** 14 de noviembre de 2025  
**Proyecto:** SanpaHolmes - Sistema de Pedidos Evento Scout 2025
