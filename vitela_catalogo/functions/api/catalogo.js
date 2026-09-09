export async function onRequestGet({env}){
  const result=await env.VITELA_DB.prepare('SELECT sku,modelo,tam,color,precio,stock,descripcion,activo,categoria,imagenes,caracteristicas FROM products WHERE activo=1 ORDER BY categoria,modelo,tam,color').all();
  return Response.json((result.results||[]).map(p=>({...p,activo:Boolean(p.activo),imagenes:JSON.parse(p.imagenes||'[]'),caracteristicas:JSON.parse(p.caracteristicas||'[]')})),{headers:{'Cache-Control':'public, max-age=60, stale-while-revalidate=300'}});
}
