/* Canvas/DOM API smoke tests. These exercise lifecycle and drawing commands,
   not browser layout or pixel appearance. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const World=require('../station-world');
function harness(pref='cinematic'){
 let draws=0,frameId=0;const frames=new Map(),elements=new Map(),storage=new Map([['blackline-view',pref]]);
 class Element {
  constructor(){this.events={};this.hidden=false;this.width=640;this.height=360;this.style={setProperty(){}};const classes=new Set();this.classList={toggle(c,on){on?classes.add(c):classes.delete(c);},remove(...items){items.forEach(x=>classes.delete(x));},add(c){classes.add(c);},contains(c){return classes.has(c);}};this.dataset={};}
  addEventListener(type,fn,options={}){(this.events[type]??=[]).push(fn);options.signal?.addEventListener('abort',()=>{this.events[type]=this.events[type].filter(f=>f!==fn);},{once:true});}
  fire(type,event={}){for(const f of this.events[type]||[])f({preventDefault(){},...event});}
  setAttribute(){} focus(){document.activeElement=this;} setPointerCapture(){}
  getBoundingClientRect(){return {width:800,height:440,left:0,top:0,bottom:440};}
  getContext(){return context;}
  querySelector(selector){return get(selector);}
  querySelectorAll(selector){return selector==='[data-move]'?controls:selector==='.hotspot'?hotspots:[];}
 }
 const gradient={addColorStop(){}};
 const context=new Proxy({}, {get(_,name){if(name==='createImageData')return(w,h)=>({width:w,height:h,data:new Uint8ClampedArray(w*h*4)});if(name==='createLinearGradient'||name==='createRadialGradient')return()=>gradient;return(...args)=>{if(name==='drawImage'){for(const n of args.slice(1))assert.ok(Number.isFinite(n),'drawImage numeric coordinate');draws++;}};},set(){return true;}});
 const get=key=>{if(!elements.has(key))elements.set(key,new Element());return elements.get(key);};
 const controls=['left','right','forward','back'].map(name=>{const e=new Element();e.dataset.move=name;return e;}),hotspots=[new Element(),new Element()];
 const document=new Element();document.body=new Element();document.documentElement=new Element();document.getElementById=get;document.querySelector=get;document.createElement=()=>new Element();document.hidden=false;get('opening').hidden=true;get('inspection').open=false;
 const browser=new Element(),sandbox={console,StationWorld:World,document,innerHeight:900,AbortController,Float32Array,Uint8ClampedArray,Math,Image:class{constructor(){this.complete=true;this.naturalWidth=1600;}},ResizeObserver:class{observe(){}disconnect(){}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},sessionStorage:{getItem:()=> 'seen'},matchMedia:()=>({matches:false,addEventListener(){}}),requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),addEventListener:browser.addEventListener.bind(browser)};sandbox.window=sandbox;
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require.resolve('../cinema.js'),'utf8'),sandbox);
 const advance=t=>{const pending=[...frames.entries()];frames.clear();for(const [,fn]of pending)fn(t);};
 return {api:sandbox.Cinema,get,hotspots,storage,document,advance,frames,drawCount:()=>draws,element:()=>new Element()};
}
test('cinematic lifecycle mounts, animates, pauses, resumes and cleans up frames',()=>{const h=harness(),el=h.element();h.api.mount(el,{place:'brief',inspect(){},onPlace(){}});assert.equal(h.get('.walk-canvas').hidden,true);h.advance(40);h.api.pause();h.advance(80);h.api.resume();h.advance(120);h.api.mount(null,{});assert.equal(h.frames.size,0);});
test('walk mode executes textured wall, floor and billboard rendering and opens the existing inspection',()=>{const h=harness('walk'),inspected=[];h.api.mount(h.element(),{place:'brief',inspect:id=>inspected.push(id),onPlace(){}});h.advance(40);assert.ok(h.drawCount()>600,'textured columns and sprite strips were drawn');assert.equal(h.get('walk-interact').disabled,false);h.get('walk-interact').fire('click');assert.deepEqual(inspected,['dossier']);assert.ok(h.hotspots.every(x=>x.hidden));h.get('view-mode').fire('click');assert.equal(h.storage.get('blackline-view'),'cinematic');assert.ok(h.hotspots.every(x=>!x.hidden));h.api.mount(null,{});});
test('evidence collection remounts retain a usable first-person scene and the modal pauses movement',()=>{const h=harness('walk'),config={place:'logs',inspect(){},onPlace(){}};h.api.mount(h.element(),config);h.advance(40);h.api.pause();const drawn=h.drawCount();h.advance(80);assert.equal(h.drawCount(),drawn);h.api.mount(h.element(),config);h.api.resume();h.advance(120);assert.ok(h.drawCount()>drawn);h.api.mount(null,{});assert.equal(h.frames.size,0);});
