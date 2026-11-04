// Memverifikasi semua soal: jawaban benar dan tunggal, versi kembar setara. Keluar dengan kode 1 jika ada masalah.
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
const pre=js.slice(0,js.indexOf('var V=["A","B","C"],$='));
const M=new Function('rd','fin','isDone','key',pre+';return {SL:SL,PB:PB,DT:DT,at:at,sim:sim,bfs:bfs}')(()=>{},()=>{},()=>0,()=>0);
let bad=0;const fail=(m)=>{bad++;console.log('GAGAL:',m)};
const perms=n=>n==1?[[0]]:perms(n-1).flatMap(p=>Array.from({length:n},(_,i)=>{const q=p.slice();q.splice(i,0,n-1);return q}));
for(const [id,mod] of Object.entries({SL:M.SL,PB:M.PB,DT:M.DT})){
  if(mod.MT.length!=4||mod.H.length!=4)fail(id+': harus 4 misi dan 4 daftar petunjuk');
  ['P','init','view','tap','go','sum'].forEach(f=>{if(typeof mod[f]!='function')fail(id+': API tidak lengkap, kurang '+f)});
}
// Susun Langkah
for(let m=0;m<4;m++){const mins=[];
  for(let v=0;v<3;v++){const p=M.SL.P(m,v);
    if(p.a){const sorted=p.p.slice().sort((a,b)=>a-b).join()==p.a.map((_,i)=>i).join();if(!sorted||!p.p.some((x,i)=>x!=i))fail('SL misi '+(m+1)+' versi '+v+': urutan acak tidak valid')}
    else{if(!M.at(p.t.g,'S')||!M.at(p.t.g,'F')||p.mn<1)fail('SL grid '+m+'/'+v);mins.push(p.mn)}}
  if(mins.length&&new Set(mins).size!=1)fail('SL misi '+(m+1)+': jalur terpendek antar versi tidak sama '+mins)}
// Pemburu Bug
for(let m=0;m<4;m++)for(let v=0;v<3;v++){const p=M.PB.P(m,v);
  if(!M.sim(p.t.g,p.st,p.ok.split('')).ok)fail('PB '+m+'/'+v+': program benar tidak sampai FINIS');
  if(M.sim(p.t.g,p.st,p.bad.split('')).ok)fail('PB '+m+'/'+v+': program bug ternyata berhasil')}
// Detektif Logika: jawaban unik
for(let m=0;m<4;m++)for(let v=0;v<3;v++){const p=M.DT.P(m,v),all=p.g.map(g=>perms(g.r.length));let n=0;
  (function rec(i,pick){if(i==p.g.length){const ok=p.k.every(k=>{const [g,r,c]=k.f[0];const t=pick[g][r]==c;return k.v[1]=='✓'?t:!t});
    const comp=p.g.length<3||pick[0].every((c,r)=>pick[1][c]==pick[2][r]);if(ok&&comp)n++;return}
    for(const pm of all[i])rec(i+1,pick.concat([pm]))})(0,[]);
  if(n!=1)fail('DT '+m+'/'+v+': jumlah solusi '+n+' (harus 1)');
  p.g.forEach((g,gi)=>{if(!p.k.every(k=>{const [a,r,c]=k.f[0];const t=p.g[a].a[r]==c;return k.v[1]=='✓'?t:!t}))fail('DT '+m+'/'+v+': jawaban tersimpan melanggar petunjuk')})}
console.log(bad?'ADA MASALAH: '+bad:'verify-puzzles: semua soal valid (3 modul, 36 soal)');process.exit(bad?1:0);
