(function(root){
'use strict';
const evidence={
 original:{title:'The original estimate',type:'TESTIMONY',text:'Imani’s original wording: “No independent confirmation of a blockade.”',source:'Analyst Imani'},
 revision:{title:'An altered confidence line',type:'DOCUMENT',text:'Revision 13 changes “unconfirmed” to “confirmed”. Its author field belongs to Kade.',source:'Archive / revision comparison'},
 annex:{title:'Hidden source identities',type:'SOURCE RISK',text:'The leaked PDF retains identifiers for three informants in its hidden text layer.',source:'Archive / Annex B'},
 cable:{title:'The maritime cable',type:'CORROBORATION',text:'The independent port cable records routine delays, with no signal of a blockade.',source:'Crisis room / harbor map'},
 export:{title:'The removable drive',type:'ACCESS LOG',text:'At 22:08, Kade’s registered drive exported Annex B from terminal PR-04.',source:'Security / device logs'},
 camera:{title:'A face at the terminal',type:'CCTV',text:'At 22:08, Kade is visible at PR-04. Vale and Imani are in the briefing room.',source:'Security / corridor camera'},
 upload:{title:'The matching upload',type:'NETWORK TRACE',text:'At 22:14, PR-04 uploaded a file with the same hash as the leaked PDF.',source:'Security / outbound traffic'},
 message:{title:'The reporter’s warning',type:'RECOVERED MESSAGE',text:'The reporter warned that the file named people. Kade said to publish the blockade line anyway.',source:'Liaison desk / deleted messages'}
};
const pairs=[['revision','export'],['export','camera'],['camera','upload']];
const fresh=()=>({version:2,place:'brief',view:'field',clues:[],links:[],actions:[],minutes:0,notes:'',ending:null});
const key=(a,b)=>[a,b].sort().join(':');
function spend(s,id,cost=18){if(!s.actions.includes(id)){s.actions.push(id);s.minutes=Math.min(379,s.minutes+cost);}}
function collect(s,id){if(!Object.hasOwn(evidence,id)||s.clues.includes(id)||s.ending)return false;s.clues.push(id);spend(s,id);return true;}
function connect(s,a,b){if(!s.clues.includes(a)||!s.clues.includes(b)||a===b)return 'invalid';const k=key(a,b);if(!pairs.some(p=>key(...p)===k))return 'unrelated';if(s.links.includes(k))return 'exists';s.links.push(k);return 'linked';}
function assess(s,suspect,release){const complete=['revision','annex','export','camera','upload'].every(x=>s.clues.includes(x));const verified=['original','cable'].every(x=>s.clues.includes(x));let code=suspect!=='Kade'||!complete?'unsupported':release==='raw'?'exposed':release==='silence'?'silence':!verified?'unverified':s.links.length<3?'unconnected':'success';s.ending={code,suspect,release};return s.ending;}
function restore(raw){try{const s=JSON.parse(raw);if(s.version!==2)return fresh();const f=fresh();f.place=['brief','archive','logs','desk'].includes(s.place)?s.place:'brief';f.view=['field','board','journal'].includes(s.view)?s.view:'field';f.clues=[...new Set((s.clues||[]).filter(x=>Object.hasOwn(evidence,x)))];f.links=[...new Set((s.links||[]).filter(x=>pairs.some(p=>key(...p)===x)&&x.split(':').every(c=>f.clues.includes(c))))];f.actions=Array.isArray(s.actions)?s.actions.filter(x=>typeof x==='string'):[];f.minutes=Math.max(0,Math.min(379,Number(s.minutes)||0));f.notes=typeof s.notes==='string'?s.notes.slice(0,6000):'';if(s.ending&&['Kade','Imani','Vale'].includes(s.ending.suspect)&&['raw','silence','verified'].includes(s.ending.release))assess(f,s.ending.suspect,s.ending.release);return f;}catch{return fresh();}}
const api={evidence,pairs,fresh,collect,connect,assess,restore,spend,key};if(typeof module!=='undefined')module.exports=api;root.Blackline=api;
})(typeof window==='undefined'?globalThis:window);
