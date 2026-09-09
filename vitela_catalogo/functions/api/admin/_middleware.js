import cloudflareAccessPlugin from '@cloudflare/pages-plugin-cloudflare-access';

const accessMiddleware = cloudflareAccessPlugin({
  domain: "${CLOUDFLARE_ACCESS_DOMAIN}",
  aud: "${CLOUDFLARE_ACCESS_AUD}"
});

function securityHeaders(headers){
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests");
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('X-Frame-Options','DENY');
  headers.set('Referrer-Policy','no-referrer');
  headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  headers.set('Cache-Control','no-store');
  headers.set('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  return headers;
}

export async function onRequest(context){
  const accessResponse = await accessMiddleware(context);
  if (accessResponse instanceof Response) {
    const h=securityHeaders(new Headers(accessResponse.headers));
    return new Response(accessResponse.body,{status:accessResponse.status,statusText:accessResponse.statusText,headers:h});
  }
  const req=context.request;
  if(req.method==='OPTIONS') return new Response(null,{status:204,headers:securityHeaders(new Headers({'Allow':'GET, PUT, OPTIONS'}))});
  const origin=req.headers.get('Origin');
  if(origin && origin!==new URL(req.url).origin) return new Response(JSON.stringify({error:'Origen no permitido'}),{status:403,headers:securityHeaders(new Headers({'Content-Type':'application/json'}))});
  const res=await context.next();
  return new Response(res.body,{status:res.status,statusText:res.statusText,headers:securityHeaders(new Headers(res.headers))});
}
