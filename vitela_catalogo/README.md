# Vitela — Catálogo por SKU

## Separación de imágenes
- Menudeo: `images/menudeo/<SKU>/`
- Mayoreo: `images/mayoreo/<SKU>/`

Nunca mezcles imágenes entre ambas carpetas.

## SKU menudeo
Formato: `OWA-MODELO-CAPACIDAD-COLOR`
Ejemplo: `OWA-KID-12OZ-MOR` = Owala Kids / 12 oz / Morado.

## SKU mayoreo
Los paquetes tienen un namespace propio para evitar colisiones con productos individuales:
- `MAY-OWA-10-ARR` = Owala / 10 piezas / Arranque
- `MAY-OWA-30-NEG` = Owala / 30 piezas / Negocio
- `MAY-OWA-50-MAY` = Owala / 50 piezas / Mayorista

## Imágenes
La imagen principal es `1.webp`. Puedes agregar `2.webp`, `3.webp`, etc.

## Catálogos
- `productos.json` controla menudeo.
- `paquetes-mayoreo.json` controla mayoreo.
- `catalogo.js` renderiza menudeo.
- `mayoreo-catalogo.js` renderiza mayoreo.

## WhatsApp
El botón `Lo quiero` genera un mensaje con el SKU, nombre, cantidad y precio de referencia.
