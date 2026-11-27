// Produce an offline-capable static ARG. Author solutions are deliberately excluded.
const fs=require('node:fs');const path=require('node:path');const root=__dirname,dist=path.join(root,'dist');fs.mkdirSync(dist,{recursive:true});
const previous=['style.css','app.js','game-engine.js','mystery-world.js','mystery-renderer.js','playground-ui.js','playground.css','cinema.js','cinema.css','station-world.js','immersive.css','navigation.js','navigation-shortcuts.js'];for(const name of previous)fs.rmSync(path.join(dist,name),{force:true});
fs.copyFileSync(path.join(root,'index.html'),path.join(dist,'index.html'));
for(const name of ['arg','vendor','websites']){fs.rmSync(path.join(dist,name),{recursive:true,force:true});fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true});}
fs.rmSync(path.join(dist,'assets'),{recursive:true,force:true});fs.mkdirSync(path.join(dist,'assets'),{recursive:true});fs.cpSync(path.join(root,'assets/ninth'),path.join(dist,'assets/ninth'),{recursive:true});fs.copyFileSync(path.join(root,'assets/film-grain.svg'),path.join(dist,'assets/film-grain.svg'));
let bytes=0;function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);item.isDirectory()?walk(p):bytes+=fs.statSync(p).size;}}walk(dist);console.log('The Ninth Record built in dist/ ('+(bytes/1024/1024).toFixed(2)+' MiB).');
