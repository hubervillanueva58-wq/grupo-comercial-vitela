const JSON_HEADERS={'Content-Type':'application/json','Cache-Control':'no-store'};
const MAX_BODY=32768;
const SKU=/^[A-Za-z0-9_-]{3,48}$/;
const clean=(v,max)=>String(v??'').normalize('NFKC').trim().slice(0,max);
const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:JSON_HEADERS});
function allowed(email,env){const list=String(env.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);return !!email&&list.includes(email.toLowerCase());}
function validProduct(x){
  if(!x||typeof x!=='object')return [false,'Formato inválido'];
  if(!SKU.test(String(x.sku||'')))return [false,'SKU inválido'];
  const modelo=clean(x.modelo,80),color=clean(x.color,50),tam=Number(x.tam),precio=Number(x.precio),stock=Number(x.stock);
  if(!modelo||!color)return [false,'Modelo y color son obligatorios'];
  if(!Number.isInteger(tam)||tam<1||tam>999)return [false,'Tamaño inválido'];
  if(!Number.isFinite(precio)||precio<0||precio>1000000)return [false,'Precio inválido'];
  if(!Number.isInteger(stock)||stock<0||stock>1000000)return [false,'Stock inválido'];
  return [true,{sku:String(x.sku).trim(),modelo,color,tam,precio,stock,descripcion:clean(x.descripcion,1000),activo:x.activo!==false}];
}
async function requireAdmin(data,env){const email=String(data?.cloudflareAccess?.JWT?.payload?.email||'').trim().toLowerCase();if(!allowed(email,env))throw new Error('No autorizado');return email;}
export async function onRequestGet({env,data}){
  try{await requireAdmin(data,env);const result=await env.VITELA_DB.prepare('SELECT sku,modelo,tam,color,precio,stock,descripcion,activo,imagenes,caracteristicas FROM products WHERE categoria = ? ORDER BY sku').bind('menudeo').all();return json((result.results||[]).map(p=>({...p,activo:Boolean(p.activo),imagenes:JSON.parse(p.imagenes||'[]'),caracteristicas:JSON.parse(p.caracteristicas||'[]')})));}catch(e){return json({error:e.message||'Error interno'},e.message==='No autorizado'?403:500);}
}
export async function onRequestPut({request,env,data}){
  try{await requireAdmin(data,env);const len=Number(request.headers.get('content-length')||0);if(len>MAX_BODY)return json({error:'Solicitud demasiado grande'},413);const text=await request.text();if(text.length>MAX_BODY)return json({error:'Solicitud demasiado grande'},413);let raw;try{raw=JSON.parse(text)}catch{return json({error:'JSON inválido'},400)}const [ok,p]=validProduct(raw);if(!ok)return json({error:p},400);
    const exists=await env.VITELA_DB.prepare('SELECT sku,imagenes,caracteristicas FROM products WHERE sku=?').bind(p.sku).first();
    const imagenes=Array.isArray(raw.imagenes)?raw.imagenes.slice(0,10).map(v=>clean(v,300)).filter(Boolean):(exists?JSON.parse(exists.imagenes||'[]'):[]);
    const caracteristicas=Array.isArray(raw.caracteristicas)?raw.caracteristicas.slice(0,20).map(v=>clean(v,200)).filter(Boolean):(exists?JSON.parse(exists.caracteristicas||'[]'):[]);
    await env.VITELA_DB.prepare(`INSERT INTO products (sku,modelo,tam,color,precio,stock,descripcion,activo,categoria,imagenes,caracteristicas,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(sku) DO UPDATE SET modelo=excluded.modelo,tam=excluded.tam,color=excluded.color,precio=excluded.precio,stock=excluded.stock,descripcion=excluded.descripcion,activo=excluded.activo,imagenes=excluded.imagenes,caracteristicas=excluded.caracteristicas,updated_at=datetime('now')`).bind(p.sku,p.modelo,p.tam,p.color,p.precio,p.stock,p.descripcion,p.activo?1:0,'menudeo',JSON.stringify(imagenes),JSON.stringify(caracteristicas)).run();
    return json({...p,imagenes,caracteristicas});
  }catch(e){return json({error:e.message||'Error interno'},e.message==='No autorizado'?403:500);}
}
