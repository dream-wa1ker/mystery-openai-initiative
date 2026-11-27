import fs from 'node:fs';
import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}readAsDataURL(blob){blob.arrayBuffer().then(b=>{this.result='data:'+blob.type+';base64,'+Buffer.from(b).toString('base64');this.onloadend?.();});}};
const dir='assets/ninth/models';fs.mkdirSync(dir,{recursive:true});
const mat=(name,color,metalness=0,roughness=.65)=>{const m=new T.MeshStandardMaterial({color,metalness,roughness});m.name=name;return m;};
const wood=mat('walnut','#60452d',0,.43),edge=mat('wood_edge','#30271d'),brass=mat('brass','#b5a071',.75,.3),steel=mat('painted_steel','#3c4b3d',.3,.49),paper=mat('paper','#dfd6b7',0,.95),dark=mat('dark','#141f1b',.1,.6),cream=mat('cream','#c1b99a'),fabric=mat('fabric','#293c32',0,.96),screen=mat('screen','#386c59',.1,.35);screen.emissive.set('#315a48');screen.emissiveIntensity=.6;
const g=()=>new T.Group();
function mesh(group,geo,m,x=0,y=0,z=0,name=''){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;o.name=name;group.add(o);return o;}
const box=(p,w,h,d,m,x=0,y=0,z=0,r=.015,name='')=>mesh(p,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/4,h/4,d/4)),m,x,y,z,name);
const cyl=(p,rt,rb,h,m,x=0,y=0,z=0,n=28)=>mesh(p,new T.CylinderGeometry(rt,rb,h,n),m,x,y,z);
const tube=(p,pts,r,m)=>mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a))),24,r,8,false),m);
const models={};
{
const p=g();box(p,3.6,.13,1.75,wood,0,1,0,.045);box(p,3.48,.08,1.65,edge,0,.91,0,.02);for(const x of [-1.55,1.55])for(const z of [-.63,.63])box(p,.13,.91,.13,wood,x,.46,z);box(p,1,.58,.6,wood,-.92,.61,-.2,.03);for(let i=0;i<2;i++){box(p,.96,.24,.035,edge,-.92,.49+i*.28,.12,.012);box(p,.22,.025,.025,brass,-.92,.49+i*.28,.15);}models.desk=p;
}
{
const p=g();cyl(p,.19,.22,.055,brass,0,.03,0);cyl(p,.025,.035,.66,brass,0,.38,0);tube(p,[[0,.7,0],[.04,.92,0],[.28,.99,0],[.38,.86,0]],.022,brass);cyl(p,.12,.29,.22,steel,.38,.78,0);cyl(p,.25,.25,.01,cream,.38,.665,0);models.lamp=p;
}
{
const p=g();box(p,.85,.64,.42,steel,0,.63,0,.07);box(p,.7,.48,.018,dark,0,.65,.22,.045);box(p,.61,.4,.012,screen,0,.65,.233,.035,'terminal_screen');box(p,.12,.3,.15,brass,0,.2,0);box(p,.44,.04,.3,steel,0,.04,.02);box(p,.85,.055,.35,dark,0,.055,.38,.02);for(let j=0;j<4;j++)for(let i=0;i<10;i++)box(p,.058,.015,.045,cream,-.32+i*.072,.091,.26+j*.065,.003);models.terminal=p;
}
{
const p=g();box(p,.84,.44,.3,wood,0,.25,0,.04);box(p,.72,.32,.015,dark,0,.26,.16,.01);for(let i=0;i<8;i++)box(p,.38,.012,.015,cream,-.12,.14+i*.033,.177,.002);for(const y of [.17,.35]){const o=cyl(p,.055,.055,.03,brass,.26,y,.19);o.rotation.x=Math.PI/2;}tube(p,[[-.27,.47,0],[-.27,.59,0],[.27,.59,0],[.27,.47,0]],.022,steel);const a=cyl(p,.006,.006,.7,brass,-.33,.79,-.05);a.rotation.z=-.15;models.radio=p;
}
{
const p=g();box(p,.68,.025,.88,steel,0,.02,0,.015);for(let i=0;i<7;i++){const q=box(p,.61,.004,.78,paper,.006*i,.038+i*.005,.003*i,.001);q.rotation.y=(i-3)*.008;}box(p,.64,.008,.83,mat('folder_cover','#6c7454'),0,.08,-.018,.007);box(p,.26,.001,.11,paper,.02,.085,.05,.001,'folder_label');models.dossier=p;
}
{
const p=g();box(p,.92,1.35,.58,steel,0,.69,0,.035);for(let i=0;i<3;i++){box(p,.83,.38,.04,steel,0,.25+i*.43,.32,.014,'drawer_'+i);box(p,.3,.035,.04,brass,0,.25+i*.43,.36,.01);box(p,.2,.09,.01,cream,0,.34+i*.43,.348,.004);}models.cabinet=p;
}
{
const p=g();box(p,1.65,1.95,.08,wood,0,1,-.18,.02);for(const x of [-.8,.8])box(p,.08,2,.38,wood,x,1,0);for(const y of [.06,.65,1.3,1.96])box(p,1.6,.065,.38,wood,0,y,0);const colors=['#5e6344','#434f43','#8b7650','#786249','#374d49'];for(let row=0;row<3;row++)for(let i=0;i<9;i++){const h=.38+(i%3)*.055,x=-.65+i*.16,y=[.1,.69,1.34][row];const book=box(p,.12,h,.25,mat('book_'+row+'_'+i,colors[(i+row)%5]),x,y+h/2,0,.006);box(p,.09,.012,.008,brass,x,y+h*.75,.13,.001);}models.shelf=p;
}
{
const p=g();box(p,.68,.16,.62,fabric,0,.58,0,.07);box(p,.68,.65,.12,fabric,0,.98,-.28,.065);cyl(p,.055,.055,.48,steel,0,.29,0);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leg=box(p,.06,.045,.53,steel,Math.sin(a)*.19,.055,Math.cos(a)*.19,.02);leg.rotation.y=a;const wheel=cyl(p,.04,.04,.04,dark,Math.sin(a)*.42,.04,Math.cos(a)*.42);wheel.rotation.z=Math.PI/2;}models.chair=p;
}
{
const p=g();const ring=mesh(p,new T.TorusGeometry(.13,.012,12,48),brass,0,.03,0);ring.rotation.x=Math.PI/2;const lens=mesh(p,new T.CircleGeometry(.12,40),new T.MeshPhysicalMaterial({color:'#c3d3bd',transparent:true,opacity:.22,roughness:.1,metalness:.15,side:T.DoubleSide}),0,.03,0);lens.rotation.x=-Math.PI/2;const handle=cyl(p,.023,.028,.32,dark,0,.03,.26,12);handle.rotation.x=Math.PI/2;models.magnifier=p;
}
{
const p=g();const points=[[.07,0],[.09,.02],[.105,.19],[.1,.22],[.086,.22],[.084,.04],[.07,.025]].map(([x,y])=>new T.Vector2(x,y));mesh(p,new T.LatheGeometry(points,40),cream);const handle=mesh(p,new T.TorusGeometry(.065,.015,10,24,Math.PI*1.65),cream,.12,.12,0);handle.rotation.z=-Math.PI*.82;cyl(p,.085,.085,.002,mat('coffee','#271d13'),0,.185,0);models.cup=p;
}
{
const p=g();box(p,.2,.055,.14,dark,0,.03,0,.012);box(p,.19,.025,.13,wood,0,.07,0,.012);cyl(p,.027,.035,.12,wood,0,.14,0);mesh(p,new T.SphereGeometry(.052,20,12),wood,0,.21,0);models.stamp=p;
}
{
const p=g();const body=cyl(p,.009,.009,.36,mat('pencil','#b9974e'),0,.012,0,6);body.rotation.x=Math.PI/2;const tip=mesh(p,new T.ConeGeometry(.009,.03,6),wood,0,.012,.195);tip.rotation.x=Math.PI/2;models.pencil=p;
}
{
const p=g();box(p,.54,.1,.35,steel,0,.065,0,.025);for(const x of [-.13,.13]){cyl(p,.085,.085,.012,brass,x,.124,-.025);const reel=mesh(p,new T.TorusGeometry(.05,.007,8,24),dark,x,.132,-.025);reel.rotation.x=Math.PI/2;}for(let i=0;i<4;i++)box(p,.065,.022,.035,i===0?mat('red','#845142'):cream,-.13+i*.09,.135,.12,.004);models.recorder=p;
}
{
const p=g();box(p,.5,.11,.47,wood,0,.06,0,.025);box(p,.43,.006,.4,paper,0,.12,0,.005,'grid_card');for(let i=0;i<3;i++)box(p,.46,.005,.42,paper,.008*i,.112-i*.008,0,.003);models.indexbox=p;
}
{
const p=g();box(p,2.55,1.6,.09,wood,0,0,0,.04);box(p,2.43,1.48,.012,mat('cork','#8e805c',0,1),0,0,.053,.015,'cork');for(let i=0;i<9;i++){const x=-.84+i%3*.83,y=.45-Math.floor(i/3)*.45;box(p,.39,.3,.006,paper,x,y,.069,.002,'board_card_'+i);mesh(p,new T.SphereGeometry(.014,12,8),i%2?brass:mat('pin','#874f3a'),x,y+.12,.09);}models.board=p;
}
{
const p=g();box(p,.9,.62,.045,brass,0,0,0,.02);box(p,.84,.56,.012,mat('photo','#7d8971'),0,0,.028,.005,'photo');models.frame=p;
}
{
const p=g();box(p,.67,.045,.44,wood,0,.024,0,.012);for(const x of [-.16,.16]){const page=box(p,.32,.035,.4,paper,x,.06,0,.012);page.rotation.z=x<0?-.05:.05;}box(p,.012,.045,.43,brass,0,.05,0,.002);models.referencebook=p;
}
const exporter=new GLTFExporter();const manifest=[];
for(const [name,object]of Object.entries(models)){object.name=name;const buffer=await exporter.parseAsync(object,{binary:true,onlyVisible:true});fs.writeFileSync(`${dir}/${name}.glb`,Buffer.from(buffer));manifest.push({name,url:`assets/ninth/models/${name}.glb`,bytes:buffer.byteLength});}
fs.writeFileSync(`${dir}/manifest.json`,JSON.stringify(manifest,null,2));console.log(`Exported ${manifest.length} original glTF models; ${manifest.reduce((n,m)=>n+m.bytes,0)} bytes.`);
