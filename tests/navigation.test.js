const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const Shortcuts=require('../navigation-shortcuts');
const event=key=>({key});
test('all view shortcuts and numbered travel destinations map to the documented actions',()=>{for(const [key,name] of Object.entries({'0':'field','1':'room:brief','2':'room:archive','3':'room:logs','4':'room:desk',B:'board',J:'journal',G:'travel',P:'people',I:'briefing',H:'help','?':'help',F:'fullscreen',V:'camera',U:'hud',M:'sound',Escape:'back'}))assert.equal(Shortcuts.action(event(key)),name);});
test('typing, open inspections and the opening screen protect their own keyboard input',()=>{for(const key of ['1','b','j','h','Escape'])for(const flag of ['typing','modal','opening'])assert.equal(Shortcuts.action(event(key),{[flag]:true}),null);});
test('browser shortcuts and held keys cannot trigger repeated navigation',()=>{for(const flag of ['ctrlKey','metaKey','altKey','repeat'])assert.equal(Shortcuts.action({...event('b'),[flag]:true}),null);});
test('movement and normal keyboard focus keys are left to the first-person view and browser',()=>{for(const key of ['w','a','s','d','e','ArrowLeft','ArrowRight','Tab','Enter',' '])assert.equal(Shortcuts.action(event(key)),null);});
function harness(){
 const elements=new Map(),calls=[],state={place:'brief',view:'field',clues:[],ending:null};
 class Node {
  constructor(){this.events={};this.dataset={};this.hidden=false;this.open=false;this.tagName='DIV';this.innerHTML='';this.textContent='';const classes=new Set();this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,force){const value=force===undefined?!classes.has(x):force;value?classes.add(x):classes.delete(x);return value;}};}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  fire(type,e={}){for(const fn of this.events[type]||[])fn({preventDefault(){},...e});}
  querySelectorAll(){return [];}setAttribute(){}focus(){}click(){this.onclick?.();}
 }
 const get=id=>{if(!elements.has(id))elements.set(id,new Node());return elements.get(id);};
 const document=new Node();document.body=new Node();document.getElementById=get;document.querySelector=get;document.querySelectorAll=()=>[];
 get('opening').hidden=true;get('lead').textContent='Compare both revisions.';get('news-title').textContent='Rumor reaches the trading floor';get('save-status').textContent='Progress saved locally';get('.sidebar').innerHTML='<section class="mission"><p>Follow the evidence.</p><button id="assessment">File your assessment</button><button id="hint">Hint</button><button id="restart">Restart</button></section>';
 const locations=Object.fromEntries(['brief','archive','logs','desk'].map(id=>[id,{name:id,meta:'Station',spots:[['dossier','Leaked dossier',1,1,'revision']]}]));
 const GameUI={getState:()=>state,locations,view(v){state.view=v;calls.push(['view',v]);},travel(v){state.view='field';state.place=v;calls.push(['travel',v]);},open(title,body,kicker){get('inspection').open=true;calls.push(['open',title,body,kicker]);},close(){get('inspection').open=false;},inspect(){},person(){},assessment(){},hint(){}};
 const Cinema={getMode:()=> 'cinematic',heading:()=>0,focus:()=>false,toggleMode(){calls.push(['camera']);}};
 const sandbox={GameUI,Cinema,NavigationShortcuts:Shortcuts,document,console,setTimeout:()=>1,clearTimeout(){},setInterval(){}};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require.resolve('../navigation.js'),'utf8'),sandbox);
 const press=(key,extra={})=>document.fire('keydown',{key,target:{tagName:'DIV'},...extra});
 return {document,get,calls,state,press};
}
test('global shortcuts open the original workspaces, travel directly and show the field manual',()=>{const h=harness();h.press('b');assert.equal(h.state.view,'board');h.press('3');assert.equal(h.state.place,'logs');h.press('h');const last=h.calls.at(-1);assert.equal(last[0],'open');assert.equal(last[1],'Field manual');assert.match(last[2],/Controls &amp; shortcuts|Controls & shortcuts/);assert.match(last[2],/First-person movement/);});
test('clean frame is reversible with Escape without unexpectedly opening the pause menu',()=>{const h=harness();h.press('u');assert.ok(h.document.body.classList.contains('hud-hidden'));assert.equal(h.get('restore-hud').hidden,false);const count=h.calls.length;h.press('Escape');assert.equal(h.document.body.classList.contains('hud-hidden'),false);assert.equal(h.calls.length,count);h.press('Escape');assert.equal(h.calls.at(-1)[1],'Investigation paused');});
test('navigation modal contains all rooms and quick inspection destinations',()=>{const h=harness();h.press('g');const markup=h.calls.at(-1)[2];for(const id of ['brief','archive','logs','desk'])assert.ok(markup.includes('data-travel="'+id+'"'));assert.match(markup,/data-quick-inspect="dossier"/);assert.match(markup,/station-blueprint/);});
test('global navigation leaves note entry and active puzzle panels untouched',()=>{const h=harness();h.press('b',{target:{tagName:'TEXTAREA'}});assert.equal(h.calls.length,0);h.get('inspection').open=true;h.press('1');h.press('h');assert.equal(h.calls.length,0);});
