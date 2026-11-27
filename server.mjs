import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.glb':'model/gltf-binary','.wav':'audio/wav','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
export function resolveRequest(url){let pathname;try{pathname=decodeURIComponent(new URL(url,'http://localhost').pathname);}catch{return null;}const full=path.resolve(root,'.'+pathname);if(full!==root&&!full.startsWith(root+path.sep))return null;return pathname.endsWith('/')?path.join(full,'index.html'):full;}
export const server=http.createServer(async(req,res)=>{const file=resolveRequest(req.url||'/');if(!file){res.writeHead(400);res.end('Invalid path');return;}if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}try{const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Archive record not found.');}});
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT)||5173;server.listen(port,'127.0.0.1',()=>console.log(`The Ninth Record: http://localhost:${port}`));}
