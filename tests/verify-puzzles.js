// Memverifikasi semua soal: jawaban benar dan tunggal, versi kembar setara. Keluar dengan kode 1 jika ada masalah.
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
const pre=js.slice(0,js.indexOf('var V=["A","B","C"],$='));
let levelDone=false;
const M=new Function('rd','fin','isDone','key',pre+';return {SL:SL,PB:PB,PU:PU,DT:DT,AB:AB,RA:RA,at:at,sim:sim,bfs:bfs,expand:expand,tr:tr}')(()=>{},()=>{},()=>levelDone,()=>0);
let bad=0;const fail=(m)=>{bad++;console.log('GAGAL:',m)};
const perms=n=>n==1?[[0]]:perms(n-1).flatMap(p=>Array.from({length:n},(_,i)=>{const q=p.slice();q.splice(i,0,n-1);return q}));
for(const [id,mod] of Object.entries({SL:M.SL,PB:M.PB,PU:M.PU,DT:M.DT,AB:M.AB,RA:M.RA})){
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
// Latihan aturan hanya muncul setelah teka-teki selesai dan menguji kondisi benar/salah.
for(let m=0;m<4;m++)for(let v=0;v<3;v++){const p=M.DT.P(m,v),s=M.DT.init(p);
  if(p.rule.choices.length!=3||new Set(p.rule.choices).size!=3||p.rule.yesAction==p.rule.noAction||!p.rule.choices.includes(p.rule.yesAction)||!p.rule.choices.includes(p.rule.noAction)||p.rule.tests.map(t=>t.condition).join()!=[1,0,1].join())fail('DT aturan '+m+'/'+v+': latihan aturan tidak lengkap atau tidak setara');
  levelDone=false;if(M.DT.view(p,s).includes('Latihan singkat: Jika'))fail('DT aturan '+m+'/'+v+': latihan muncul sebelum misi selesai');
  levelDone=true;if(!M.DT.view(p,s).includes('Latihan singkat: Jika'))fail('DT aturan '+m+'/'+v+': latihan tidak muncul setelah misi selesai');
  p.rule.tests.forEach((test,i)=>{const expected=test.condition?p.rule.yesAction:p.rule.noAction;s.ruleYes=p.rule.choices.indexOf(p.rule.yesAction);s.ruleNo=p.rule.choices.indexOf(p.rule.noAction);
    const event={target:{closest:function(selector){return selector=="[data-rule-test]"?{dataset:{ruleTest:String(i)}}:null}}};M.DT.tap(event,p,s);
    if(!s.ruleResults[i]||!s.ruleResults[i].ok||!s.ruleResults[i].text.includes(expected))fail('DT aturan '+m+'/'+v+': simulasi kasus '+i+' tidak sesuai')});
  s.ruleYes=p.rule.choices.indexOf(p.rule.noAction);s.ruleNo=p.rule.choices.indexOf(p.rule.yesAction);
  M.DT.tap({target:{closest:function(selector){return selector=="[data-rule-test]"?{dataset:{ruleTest:'0'}}:null}}},p,s);
  if(!s.ruleResults[0]||s.ruleResults[0].ok)fail('DT aturan '+m+'/'+v+': simulasi tidak mengenali aksi yang keliru')}
// Pecah dan Ulangi: penempatan sub-tugas tunggal dan lengkap.
for(let v=0;v<3;v++){const p=M.PU.P(0,v),slots=p.items.map(x=>x.slot);
  if(p.groups.length!=3||p.items.length!=6||new Set(slots).size!=6||slots.some(x=>x<0||x>5))fail('PU misi 1 versi '+v+': slot tugas harus unik dan lengkap')}
// Pola ubin harus memiliki tepat satu pilihan yang cocok.
for(let v=0;v<3;v++){const p=M.PU.P(1,v),expected=p.seq[p.seq.length%3];
  if(p.seq.length!=7||p.seq.slice(3).some((x,i)=>x!=p.seq[i])||p.opts.length!=3||new Set(p.opts).size!=3||p.opts.filter(x=>x==expected).length!=1||p.opts[p.answer]!=expected)fail('PU misi 2 versi '+v+': pola ubin tidak punya satu jawaban yang cocok')}
// Blok ulangi diekspansi menjadi perintah dasar yang mencapai FINIS.
const repeatDifficulty=[];
for(let v=0;v<3;v++){const p=M.PU.P(2,v),expanded=M.expand(p.solution);repeatDifficulty.push([p.solution.length,expanded.length].join('/'));
  if(p.solution.length>p.cap||!p.solution.some(x=>typeof x=='object')||expanded.length!=9||!M.sim(p.t.g,p.st,expanded).ok)fail('PU misi 3 versi '+v+': program ulangi tidak valid')}
if(new Set(repeatDifficulty).size!=1)fail('PU misi 3: tingkat kesulitan versi kembar berbeda')
// Tiga jalur harus dapat dijalankan dan memiliki satu jalur dengan jumlah kartu minimum.
const routeDifficulty=[];
for(let v=0;v<3;v++){const p=M.PU.P(3,v),counts=p.routes.map(r=>r.cards),best=Math.min.apply(null,counts);routeDifficulty.push(counts.slice().sort((a,b)=>a-b).join(','));
  p.routes.forEach(r=>{if(r.cards!=r.code.length||!M.sim(p.t.g,p.st,r.code.split('')).ok)fail('PU misi 4 versi '+v+': jalur '+r.id+' tidak valid')});
  const preview=(M.PU.view(p,M.PU.init(p)).match(/class="route-step"/g)||[]).length;
  if(counts.filter(n=>n==best).length!=1||p.routes.filter(r=>r.id==p.answer)[0].cards!=best||M.bfs(p.t.g,p.st)!=best||new Set(counts).size!=3||preview!=counts.reduce((sum,n)=>sum+n,0))fail('PU misi 4 versi '+v+': jalur hemat tidak tunggal atau urutan kartu tidak tampil')}
if(new Set(routeDifficulty).size!=1)fail('PU misi 4: tingkat kesulitan versi kembar berbeda')
// Pilih yang Penting: tiga detail penting dari enam pilihan pada tiap variasi.
for(let m=0;m<2;m++){const answers=[];
  for(let v=0;v<3;v++){const p=M.AB.P(m,v);answers.push(p.answer.slice().sort((a,b)=>a-b).join(','));
    if(p.options.length!=6||new Set(p.options).size!=6||p.answer.length!=3||new Set(p.answer).size!=3||p.answer.some(i=>i<0||i>=p.options.length))fail('AB misi '+(m+1)+' versi '+v+': pilihan penting harus unik dan tiga dari enam')}
  if(new Set(answers).size!=3)fail('AB misi '+(m+1)+': posisi jawaban versi kembar harus berbeda')}
// Diagram rakitan harus memakai semua blok sekali, dengan dua cabang berbeda.
const flowOrder=[],flowPositions=[];
for(let v=0;v<3;v++){const p=M.AB.P(2,v);flowOrder.push(p.order.join(','));
  flowPositions.push([p.actions.indexOf(p.yes),p.actions.indexOf(p.no)].join('/'));
  if(p.blocks.length!=3||new Set(p.order).size!=3||p.order.some(i=>i<0||i>=p.blocks.length)||p.blocks[p.order[0]]!='Mulai'||p.blocks[p.order[2]].indexOf('Cek:')!=0||p.yes==p.no||p.actions.length!=3||new Set(p.actions).size!=3||!p.actions.includes(p.yes)||!p.actions.includes(p.no))fail('AB misi 3 versi '+v+': diagram atau cabang tidak valid')}
if(new Set(flowOrder).size!=3)fail('AB misi 3: urutan blok versi kembar harus berbeda')
if(new Set(flowPositions).size!=3)fail('AB misi 3: posisi cabang versi kembar harus berbeda')
// Diagram kasus memakai kondisi Ya/Tidak dengan tiga contoh setara.
const tracePositions=[];
for(let v=0;v<3;v++){const p=M.AB.P(3,v),pattern=p.cases.map(c=>c.condition).join(',');
  tracePositions.push([p.options.indexOf(p.yes),p.options.indexOf(p.no)].join('/'));
  if(p.cases.length!=3||pattern!='true,false,true'||p.options.length!=3||new Set(p.options).size!=3||p.yes==p.no||!p.options.includes(p.yes)||!p.options.includes(p.no))fail('AB misi 4 versi '+v+': kasus uji atau cabang tidak valid')}
if(new Set(tracePositions).size!=3)fail('AB misi 4: posisi jawaban versi kembar harus berbeda')
// Perancang: setiap peta awal punya 25 petak, START/FINIS tetap, dan tantangan
// bisa dibuat dengan jumlah penghalang tepat sambil mempertahankan jalur.
const wallSpots=[[1,1],[2,1],[3,1],[1,3]],routes=["FFFFRFFFF","FFFFLFFFF","FFFFRFFFF"];
for(let m=0;m<4;m++)for(let v=0;v<3;v++){const p=M.RA.P(m,v),s=M.RA.init(p),spots=wallSpots.slice(0,p.walls).map(function(a){return v==1?[a[0],4-a[1]]:v==2?[4-a[0],4-a[1]]:a});
  if(p.walls!=m+1||s.g.length!=5||s.g.some(r=>r.length!=5)||!M.at(p.t.g,"S")||!M.at(p.t.g,"F")||new Set(p.t.g.map(r=>r.join("")).join("")).size<3)fail('RA '+m+'/'+v+': peta awal atau jumlah penghalang tidak valid');
  spots.forEach(function(a){s.g[a[0]][a[1]]="#"});
  if(s.g.reduce((n,r)=>n+r.filter(c=>c=="#").length,0)!=p.walls||M.bfs(s.g,p.st)<0||!M.sim(s.g,p.st,routes[v]).ok)fail('RA '+m+'/'+v+': peta rancangan contoh tidak bisa diuji sampai FINIS')}
console.log(bad?'ADA MASALAH: '+bad:'verify-puzzles: semua soal valid (6 modul, 60 soal tetap + editor Level 6)');process.exit(bad?1:0);
