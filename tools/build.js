// Merakit src/ menjadi dist/index.html (satu berkas) dan menyalin public/ ke dist/.
const fs=require('fs'),path=require('path');
const R=p=>path.join(__dirname,'..',p),rd=p=>fs.readFileSync(R(p),'utf8');
const wrap=(code,names)=>'(function(){'+code+'\nreturn {'+names+'}})()';
const API='MT:MT,H:H,P:P,init:init,view:view,tap:tap,go:go,sum:sum';
const mods='var SL='+wrap(rd('src/modules/susun-langkah.js'),API)+',PB='+wrap(rd('src/modules/pemburu-bug.js'),API)+',DT='+wrap(rd('src/modules/detektif-logika.js'),API)+';\n';
const how=JSON.stringify(JSON.parse(rd('src/how.json')));
const html=rd('src/template.html')
 .replace('@@CSS@@',()=>rd('src/styles.css'))
 .replace('@@ENGINE@@',()=>rd('src/engine.js'))
 .replace('@@MODS@@',()=>mods)
 .replace('@@SHELL@@',()=>rd('src/shell.js').replace('@@HOW@@',()=>how));
fs.mkdirSync(R('dist'),{recursive:true});
fs.writeFileSync(R('dist/index.html'),html);
fs.cpSync(R('public'),R('dist'),{recursive:true});
console.log('dist/index.html dibuat:',html.length,'karakter');
