/*
  Catalogo Vitela - fuente única de productos
  Estructura de imágenes:
  images/{SKU}/1.webp, 2.webp, 3.webp...
*/
(function(){
  'use strict';
  const DATA_URL = 'productos.json';
  const API_URL = '/api/catalogo';
  const WHATSAPP = '525534126629';

  function esc(value){
    return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function waText(p, tipo){
    const lineas = [
      'Hola, me interesa este producto de Grupo Comercial Vitela:',
      '',
      `${p.nombre || p.modelo} · ${p.color || ''} · ${p.tamano || (p.tam+' oz')}`,
      `SKU: ${p.sku}`,
      tipo ? `Tipo: ${tipo}` : '',
      p.precio != null ? `Precio mostrado: $${Number(p.precio).toLocaleString('es-MX')} MXN` : '',
      '',
      '¿Me pueden confirmar disponibilidad y cómo puedo comprarlo?'
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;
  }

  function imagenesProducto(p){
    if (Array.isArray(p.imagenes) && p.imagenes.length) return p.imagenes;
    return [`images/${p.sku}/1.webp`];
  }

  window.VitelaCatalogo = { load: async () => {
    try {
      const api = await fetch(API_URL, {cache:'no-store'});
      if (api.ok) {
        const data = await api.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (_) {}
    const res = await fetch(DATA_URL, {cache:'no-store'});
    if (!res.ok) throw new Error(`No se pudo cargar ${DATA_URL}`);
    return await res.json();
  }, waText, imagenesProducto, esc };
})();
