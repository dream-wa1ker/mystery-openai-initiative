/* Original height-field sectors, collision and navigation for the Meridian case. */
(function(root){
'use strict';
const width=56,height=44,cells=Array.from({length:height},()=>Array(width).fill(null));
const rooms=[
 {id:'lobby',name:'Arrival hall',zone:'brief',x:26.5,y:37,z:0},
 {id:'atrium',name:'Central atrium',zone:'brief',x:27,y:24,z:0},
 {id:'crisis',name:'Crisis room',zone:'brief',x:11,y:25,z:0},
 {id:'security',name:'Security office',zone:'logs',x:44,y:25,z:0},
 {id:'archive',name:'Document archive',zone:'archive',x:12,y:9,z:1.4},
 {id:'liaison',name:'Press liaison wing',zone:'desk',x:44,y:9,z:1.4},
 {id:'observatory',name:'Observation gallery',zone:'brief',x:27,y:9,z:1.4},
 {id:'plant',name:'Service workshop',zone:'brief',x:8,y:36,z:0}
];
function carve(x1,y1,x2,y2,z,room,material='floor'){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)cells[y][x]={z,ceiling:z+3.4,room,material};}
carve(22,33,31,40,0,'lobby');carve(25,27,28,34,0,'atrium');carve(21,18,33,28,0,'atrium');
carve(5,19,17,29,0,'crisis');carve(17,24,22,25,0,'crisis');
carve(38,19,50,29,0,'security','tile');carve(32,24,38,25,0,'security','tile');
carve(5,4,18,14,1.4,'archive','wood');carve(37,4,50,14,1.4,'liaison','wood');
carve(18,8,37,10,1.4,'observatory','wood');carve(23,5,31,12,1.4,'observatory','wood');
carve(3,33,12,39,0,'plant','tile');carve(10,34,25,36,0,'plant','tile');carve(10,28,12,35,0,'plant','tile');
carve(6,15,8,20,0,'crisis');
for(let y=14;y<=20;y++){carve(10,y,13,y,Math.round((20-y)*.2*100)/100,'archive','stairs');carve(42,y,45,y,Math.round((20-y)*.2*100)/100,'liaison','stairs');}
for(let y=13;y<=19;y++)carve(26,y,28,y,Math.round((19-y)*.2*100)/100,'observatory','stairs');
// Solid storage islands and structural pillars create actual collision geometry.
for(const [x,y] of [[8,7],[15,7],[8,11],[15,11],[40,6],[47,6],[40,11],[47,11],[24,21],[30,21],[24,26],[30,26],[5,35],[6,35],[9,38],[40,22],[48,27]])cells[y][x]=null;
const doors=[{id:'west-door',name:'Crisis wing door',tiles:[[20,24],[20,25]],x:20.5,y:25,axis:'x'}, {id:'east-door',name:'Security wing door',tiles:[[35,24],[35,25]],x:35.5,y:25,axis:'x'}];
const stations=[
 {id:'map',name:'Harbor intelligence map',x:7.5,y:22,z:0,kind:'map',clue:'cable'},
 {id:'dossier',name:'Leaked briefing dossier',x:15,y:24,z:0,kind:'paper',clue:'revision'},
 {id:'annex',name:'Source annex B',x:16,y:5.8,z:1.4,kind:'paper',clue:'annex'},
 {id:'dossier',name:'Revision archive',x:6.7,y:5.8,z:1.4,kind:'paper',clue:'revision'},
 {id:'export',name:'Device audit terminal',x:40.5,y:20.7,z:0,kind:'terminal',clue:'export'},
 {id:'camera',name:'Corridor surveillance',x:44,y:20.7,z:0,kind:'terminal',clue:'camera'},
 {id:'upload',name:'Outbound traffic monitor',x:48,y:20.7,z:0,kind:'terminal',clue:'upload'},
 {id:'message',name:'Deleted press messages',x:48,y:8.5,z:1.4,kind:'terminal',clue:'message'},
 {id:'notes',name:'Kade’s working notes',x:40,y:13,z:1.4,kind:'paper',discovery:'motive'},
 {id:'assessment',name:'Case assessment terminal',x:27.5,y:20.2,z:0,kind:'terminal'}
];
const people=[
 {id:'Vale',name:'Director Vale',x:15.5,y:27,z:0,kind:'person',portrait:0},
 {id:'Imani',name:'Analyst Imani',x:28.5,y:8,z:1.4,kind:'person',portrait:1},
 {id:'Kade',name:'Liaison Kade',x:45,y:12.5,z:1.4,kind:'person',portrait:2},
 {id:'Marin',name:'Officer Marin',x:29,y:35,z:0,kind:'person',role:'Security officer'},
 {id:'Sato',name:'Archivist Sato',x:11.8,y:12.2,z:1.4,kind:'person',role:'Records custodian'},
 {id:'Ortega',name:'Technician Ortega',x:7.5,y:37,z:0,kind:'person',role:'Facilities technician'}
];
const extras=[
 {id:'roster',name:'Staff access roster',x:23.5,y:35,z:0,kind:'paper'},
 {id:'maintenance',name:'Maintenance route chart',x:10.5,y:34,z:0,kind:'map'},
 {id:'receipt',name:'Press delivery receipt',x:38.8,y:5.5,z:1.4,kind:'paper'},
 {id:'checklist',name:'Document release checklist',x:17,y:12.5,z:1.4,kind:'paper'},
 {id:'schedule',name:'Summit schedule',x:30,y:10.5,z:1.4,kind:'paper'},
 {id:'manifest',name:'Port shift manifest',x:49,y:28,z:0,kind:'paper'}
];
const ladders=[{id:'maintenance-ladder',name:'Maintenance ladder',bottom:{x:7.5,y:15.65,z:0,angle:-Math.PI/2},top:{x:7.5,y:13.5,z:1.4,angle:Math.PI/2}}];
const spawn={x:26.5,y:37.5,z:0,angle:-Math.PI/2};
const tile=(x,y)=>cells[Math.floor(y)]?.[Math.floor(x)]||null;
function doorAt(x,y){return doors.find(d=>d.tiles.some(([a,b])=>a===Math.floor(x)&&b===Math.floor(y)));}
function canStand(x,y,fromZ=null,opened=[],radius=.19){const checks=[[x-radius,y-radius],[x+radius,y-radius],[x-radius,y+radius],[x+radius,y+radius]];return checks.every(([a,b])=>{const t=tile(a,b),d=doorAt(a,b);return !!t&&(!d||opened.includes(d.id))&&(fromZ===null||Math.abs(t.z-fromZ)<=.235);});}
function move(p,dx,dy,opened=[]){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.09));for(let i=0;i<steps;i++){const z=tile(p.x,p.y)?.z??p.z;if(canStand(p.x+dx/steps,p.y,z,opened))p.x+=dx/steps;const z2=tile(p.x,p.y)?.z??z;if(canStand(p.x,p.y+dy/steps,z2,opened))p.y+=dy/steps;p.z=tile(p.x,p.y)?.z??p.z;}return p;}
function visible(a,b,opened=[]){const dist=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.ceil(dist/.08);for(let i=1;i<steps;i++){const f=i/steps,x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f,t=tile(x,y),d=doorAt(x,y);if(!t||d&&!opened.includes(d.id)||t.z>Math.min(a.z??0,b.z??0)+1.0)return false;}return true;}
function targets(p,opened=[]){const objects=[...stations,...people,...extras,...doors.map(d=>({...d,z:0,kind:'door'})),...ladders.map(l=>({id:l.id,name:l.name,kind:'ladder',x:l.bottom.x,y:14.95,z:p.z>.8?l.top.z:l.bottom.z}))];return objects.map(s=>{const dx=s.x-p.x,dy=s.y-p.y,angle=Math.atan2(dy,dx);return {...s,distance:Math.hypot(dx,dy),difference:Math.atan2(Math.sin(angle-p.angle),Math.cos(angle-p.angle))};}).filter(s=>s.distance<(s.kind==='door'?2.2:2.15)&&Math.abs(s.difference)<.5&&Math.abs((s.z||0)-p.z)<.5&&(s.kind==='door'||s.kind==='ladder'||visible(p,s,opened))).sort((a,b)=>Math.abs(a.difference)-Math.abs(b.difference)||a.distance-b.distance)[0]||null;}
function route(start,dest){const sx=Math.floor(start.x),sy=Math.floor(start.y),gx=Math.floor(dest.x),gy=Math.floor(dest.y),key=(x,y)=>y*width+x,queue=[[sx,sy]],previous=new Map([[key(sx,sy),null]]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===gx&&y===gy)break;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,t=tile(nx,ny),cur=tile(x,y),k=key(nx,ny);if(t&&cur&&Math.abs(t.z-cur.z)<=.235&&!previous.has(k)){previous.set(k,key(x,y));queue.push([nx,ny]);}}}let at=key(gx,gy);if(!previous.has(at))return [];const path=[];while(at!==null){path.push({x:at%width+.5,y:Math.floor(at/width)+.5});at=previous.get(at);}return path.reverse();}
function roomAt(p){const id=tile(p.x,p.y)?.room;return rooms.find(r=>r.id===id)||rooms[0];}
function restore(raw){const fresh=()=>({version:1,pose:{...spawn},opened:[],visited:[],trail:[],routeTo:null,showRoute:true});try{const s=JSON.parse(raw),f=fresh();if(s?.version!==1)return f;f.opened=[...new Set((s.opened||[]).filter(id=>doors.some(d=>d.id===id)))];if(s.pose&&Number.isFinite(s.pose.x)&&Number.isFinite(s.pose.y)&&Number.isFinite(s.pose.angle)&&canStand(s.pose.x,s.pose.y,null,f.opened)){f.pose={x:s.pose.x,y:s.pose.y,z:tile(s.pose.x,s.pose.y).z,angle:s.pose.angle};}f.visited=[...new Set((s.visited||[]).filter(n=>Number.isInteger(n)&&tile(n%width,Math.floor(n/width))))];f.trail=(s.trail||[]).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&tile(p.x,p.y)).slice(-2500).map(p=>({x:p.x,y:p.y}));f.showRoute=s.showRoute!==false;f.routeTo=rooms.some(r=>r.id===s.routeTo)?s.routeTo:null;return f;}catch{return fresh();}}
const api={width,height,cells,rooms,stations,people,extras,doors,ladders,spawn,tile,doorAt,canStand,move,visible,targets,route,roomAt,restore};if(typeof module!=='undefined')module.exports=api;root.MysteryWorld=api;
})(typeof window==='undefined'?globalThis:window);
