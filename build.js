// Build the static hosting directory without dependencies.
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname,dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const name of ['index.html','style.css','app.js','game-engine.js','cinema.js','cinema.css','station-world.js','immersive.css','navigation.js','navigation-shortcuts.js'])fs.copyFileSync(path.join(root,name),path.join(dist,name));
fs.cpSync(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});
console.log('Built BLACKLINE in dist/');
