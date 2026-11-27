/* Shared ray-casting geometry. No game/story state lives here. */
(function(root){
'use strict';
const size=15;
const map=Array.from({length:size},(_,y)=>Array.from({length:size},(_,x)=>x===0||y===0||x===14||y===14||x===7&&(y<6||y>8)||y===7&&(x<6||x>8)?1:0));
const starts={brief:{x:4,y:5,angle:-Math.PI/2},archive:{x:11,y:5,angle:-Math.PI/2},logs:{x:4,y:12,angle:-Math.PI/2},desk:{x:11,y:12,angle:-Math.PI/2}};
const stations=[
 {id:'map',place:'brief',name:'Harbor map',x:2.1,y:1.8,kind:'map'},
 {id:'dossier',place:'brief',name:'Leaked dossier',x:4.1,y:2.4,kind:'paper'},
 {id:'camera',place:'brief',name:'Surveillance',x:5.8,y:1.8,kind:'screen'},
 {id:'dossier',place:'archive',name:'Compare revisions',x:9.3,y:1.8,kind:'paper'},
 {id:'annex',place:'archive',name:'Inspect Annex B',x:12,y:2.4,kind:'paper'},
 {id:'export',place:'logs',name:'Device logs',x:2,y:9.6,kind:'screen'},
 {id:'camera',place:'logs',name:'Corridor CCTV',x:4.1,y:9.6,kind:'screen'},
 {id:'upload',place:'logs',name:'Outbound traffic',x:5.8,y:9.6,kind:'screen'},
 {id:'message',place:'desk',name:'Deleted messages',x:9.5,y:9.6,kind:'screen'},
 {id:'notes',place:'desk',name:'Desk notes',x:12,y:9.6,kind:'paper'}
];
function solid(x,y){return map[Math.floor(y)]?.[Math.floor(x)]!==0;}
function free(x,y,r=.2){return ![[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]].some(p=>solid(...p));}
function move(p,dx,dy){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.12));for(let i=0;i<steps;i++){if(free(p.x+dx/steps,p.y))p.x+=dx/steps;if(free(p.x,p.y+dy/steps))p.y+=dy/steps;}return p;}
function cast(x,y,dx,dy){let mx=Math.floor(x),my=Math.floor(y);const deltaX=dx===0?1e20:Math.abs(1/dx),deltaY=dy===0?1e20:Math.abs(1/dy),stepX=dx<0?-1:1,stepY=dy<0?-1:1;let sideX=(dx<0?x-mx:mx+1-x)*deltaX,sideY=(dy<0?y-my:my+1-y)*deltaY,side=0;for(let n=0;n<80;n++){if(sideX<sideY){sideX+=deltaX;mx+=stepX;side=0;}else{sideY+=deltaY;my+=stepY;side=1;}if(!map[my]||map[my][mx]!==0)break;}const distance=Math.max(.001,side===0?sideX-deltaX:sideY-deltaY),hit=side===0?y+distance*dy:x+distance*dx;return {distance,side,x:mx,y:my,u:hit-Math.floor(hit)};}
function zone(x,y){if(x>6&&x<9||y>6&&y<9)return null;return y<7?(x<7?'brief':'archive'):(x<7?'logs':'desk');}
function target(p,list=stations){return list.map(s=>{const dx=s.x-p.x,dy=s.y-p.y,distance=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),diff=Math.atan2(Math.sin(angle-p.angle),Math.cos(angle-p.angle));return {...s,distance,diff};}).filter(s=>s.distance<2.7&&Math.abs(s.diff)<.26&&cast(p.x,p.y,Math.cos(p.angle+s.diff),Math.sin(p.angle+s.diff)).distance>s.distance-.15).sort((a,b)=>Math.abs(a.diff)-Math.abs(b.diff))[0]||null;}
const api={map,size,starts,stations,solid,free,move,cast,zone,target};if(typeof module!=='undefined')module.exports=api;root.StationWorld=api;
})(typeof window==='undefined'?globalThis:window);
