const headers={'Content-Type':'application/json','Cache-Control':'no-store'};
export async function onRequestGet({data,env}){
  const email=String(data?.cloudflareAccess?.JWT?.payload?.email||'').trim().toLowerCase();
  if(!email)return new Response(JSON.stringify({error:'No se encontró identidad de usuario'}),{status:403,headers});
  const allow=String(env.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  if(!allow.length||!allow.includes(email))return new Response(JSON.stringify({error:'Usuario no autorizado'}),{status:403,headers});
  return new Response(JSON.stringify({email}),{status:200,headers});
}
