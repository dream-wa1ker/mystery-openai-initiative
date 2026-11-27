import fs from 'node:fs';import {spawnSync} from 'node:child_process';
for(const file of fs.readdirSync('tests/arg').filter(f=>f.endsWith('.test.mjs')).sort()){const result=spawnSync(process.execPath,['tests/arg/'+file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
