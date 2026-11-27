(function(root){
'use strict';
const keys={0:'field',1:'room:brief',2:'room:archive',3:'room:logs',4:'room:desk',b:'board',j:'journal',g:'travel',p:'people',i:'briefing',h:'help','?':'help',f:'fullscreen',v:'camera',u:'hud',m:'sound',Escape:'back'};
function action(event,context={}){if(event.ctrlKey||event.metaKey||event.altKey||event.repeat||context.typing||context.modal||context.opening)return null;return keys[event.key==='Escape'?'Escape':event.key.toLowerCase()]||null;}
const api={action};if(typeof module!=='undefined')module.exports=api;root.NavigationShortcuts=api;
})(typeof window==='undefined'?globalThis:window);
