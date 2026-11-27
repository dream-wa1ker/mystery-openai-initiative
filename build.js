// Build the static hosting directory without dependencies.
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname,dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const name of ['index.html','style.css','app.js','game-engine.js','mystery-world.js','mystery-renderer.js','playground-ui.js','playground.css'])fs.copyFileSync(path.join(root,name),path.join(dist,name));
for(const name of ['cinema.js','cinema.css','station-world.js','immersive.css','navigation.js','navigation-shortcuts.js'])fs.rmSync(path.join(dist,name),{force:true});
fs.cpSync(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});
console.log('Built BLACKLINE in dist/');
