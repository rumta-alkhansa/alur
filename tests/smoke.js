// Uji asap: simulasi klik di jsdom untuk alur utama (peta level, 3 modul, Mode Kelas, Mode Mandiri, penyimpanan).
const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/index.html'),'utf8').replace(/<link[^>]*googleapis[^>]*>/,'');
const errs=[];let exportBlob=null,downloadName='',confirmResult=true,confirmCalls=0;
const dom=new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/',pretendToBeVisual:true,beforeParse(w){w.addEventListener('error',e=>errs.push(e.message));w.scrollTo=()=>{};w.Element.prototype.scrollIntoView=()=>{};w.URL.createObjectURL=b=>(exportBlob=b,'blob:alur');w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){downloadName=this.download};w.confirm=()=>{confirmCalls++;return confirmResult}}});
const w=dom.window,d=w.document;const $=i=>d.getElementById(i);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const blobText=blob=>new Promise((resolve,reject)=>{const r=new w.FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsText(blob)});
const upload=async text=>{const input=$('profile-file'),file=new w.File([text],'profil.json',{type:'application/json'});Object.defineProperty(input,'files',{configurable:true,value:[file]});input.dispatchEvent(new w.Event('change',{bubbles:true}));await sleep(30)};
let ok=0,bad=0;const T=(n,c)=>{c?ok++:(bad++,console.log('GAGAL:',n))};
(async()=>{
 T('build tanpa tautan Google Fonts',!/<link[^>]*googleapis/.test(html));
 T('font lokal dan lisensi ikut terbangun',['baloo2-variable.ttf','nunito-variable.ttf','OFL-Baloo2.txt','OFL-Nunito.txt'].every(f=>fs.existsSync(require('path').join(__dirname,'../dist/fonts',f))));
 const manifest=JSON.parse(fs.readFileSync(require('path').join(__dirname,'../dist/manifest.webmanifest'),'utf8'));
 const icon=fs.readFileSync(require('path').join(__dirname,'../dist/alur-icon.svg'),'utf8');
 const iconDoc=new JSDOM(icon,{contentType:'image/svg+xml'}).window.document;
 T('ikon SVG valid dan dipakai di halaman serta manifest',iconDoc.documentElement.localName=='svg'&&html.includes('href="alur-icon.svg"')&&manifest.icons.length==1&&manifest.icons[0].src=='alur-icon.svg');
 const sw=fs.readFileSync(require('path').join(__dirname,'../dist/sw.js'),'utf8');
 T('service worker menyimpan ikon, font, dan lisensi saat offline',sw.includes('alur-v4')&&['alur-icon.svg','baloo2-variable.ttf','nunito-variable.ttf','OFL-Baloo2.txt','OFL-Nunito.txt'].every(f=>sw.includes(f)));
 T('peta level 6 kartu',d.querySelectorAll('.lv').length==6);
 T('3 level tersedia',d.querySelectorAll('.lv:not(:disabled)').length==3);
 // Kelas: Susun Langkah misi 1
 click(d.querySelector('[data-lv=sl]'));
 T('masuk modul',!$('play').hidden&&$('home').hidden);
 const p=w.pz();
 // isi benar: ketuk kartu menurut urutan benar
 for(let i=0;i<p.a.length;i++){click(d.querySelector('[data-bk="'+i+'"]'))}
 click($('bc'));
 T('misi 1 SL menang',$('wn').classList.contains('on'));
 T('tombol giliran berikutnya',/Anak 2/.test($('bn').textContent));
 click($('bn'));T('pindah ke versi B',w.v==1);
 // Misi grid: tab misi 3 di versi A -> program benar via BFS
 w.v=0;w.cur=2;w.draw();
 const q=w.pz();const prog='FFFRFF';
 // program benar untuk G3 versi A (dibalik jika bukan A)
 for(const c of prog)click(d.querySelector('[data-ch="'+c+'"]'));
 click($('bc'));await sleep((prog.length+2)*520+300);
 T('misi 3 SL: robot sampai',w.isDone(w.key()));
 // Pemburu Bug misi 1: perbaiki L->R
 click($('bk'));T('kembali ke peta',!$('home').hidden);
 click(d.querySelector('[data-lv=pb]'));
 click(d.querySelector('[data-pi="3"]'));click(d.querySelector('[data-rp="R"]'));
 click($('bc'));await sleep(8*520+300);
 T('PB misi 1 selesai',w.isDone(w.key()));
 // Detektif misi 1: jawaban benar
 click($('bk'));click(d.querySelector('[data-lv=dt]'));
 const dp=w.pz();dp.g[0].a.forEach((c,r)=>click(d.querySelector('.cell[data-g="0"][data-r="'+r+'"][data-c="'+c+'"]')));
 T('DT misi 1 menang otomatis',$('wn').classList.contains('on'));
 // Mandiri
 click($('bk'));click(d.querySelector('[data-md=mandiri]'));
 T('mandiri: semua terkunci tanpa siswa',d.querySelectorAll('.lv:not(:disabled)').length==0);
 $('pn').value='Aisha';click($('pa'));
 T('profil tersimpan',JSON.parse(w.localStorage.getItem('alur.v1')).profiles.length==1);
 T('level 1 terbuka, level 2 terkunci',!d.querySelector('[data-lv=sl]').disabled&&d.querySelector('[data-lv=pb]').disabled);
 click(d.querySelector('[data-lv=sl]'));
 T('mandiri: tab versi tersembunyi',$('vt').hidden);
 T('mandiri: misi 2 terkunci',d.querySelector('#tabs [data-i="1"]').disabled);
 const p2=w.pz();for(let i=0;i<p2.a.length;i++)click(d.querySelector('[data-bk="'+i+'"]'));click($('bc'));
 T('mandiri: misi 1 selesai tersimpan',JSON.parse(w.localStorage.getItem('alur.v1')).profiles[0].done.sl.includes(0));
 T('misi 2 terbuka',!d.querySelector('#tabs [data-i="1"]').disabled);
 click($('pe'));
 T('ekspor menghasilkan berkas JSON',!!exportBlob&&downloadName=='alur-profil.json');
 const exported=JSON.parse(await blobText(exportBlob));
 T('ekspor mencakup profil dan progres',exported.format=='alur-profiles'&&exported.version==1&&exported.profiles[0].done.sl.includes(0));
 w.ST={mode:'mandiri',profiles:[],active:null};w.localStorage.removeItem('alur.v1');w.home();
 await upload(JSON.stringify(exported));
 T('impor memulihkan profil dan progres',w.ST.profiles[0].nama=='Aisha'&&w.ST.profiles[0].done.sl.includes(0));
 const beforeBad=w.localStorage.getItem('alur.v1');
 await upload('{rusak');
 T('berkas rusak tidak mengubah data',w.localStorage.getItem('alur.v1')==beforeBad&&$('profile-msg').textContent.indexOf('tidak valid')>-1);
 const invalid=JSON.parse(JSON.stringify(exported));invalid.profiles[0].done.sl=[9];
 await upload(JSON.stringify(invalid));
 T('data dengan progres di luar rentang ditolak',w.localStorage.getItem('alur.v1')==beforeBad&&$('profile-msg').textContent.indexOf('Format')>-1);
 const changed=JSON.parse(JSON.stringify(exported));changed.profiles[0].nama='Nara';confirmResult=false;
 await upload(JSON.stringify(changed));
 T('impor pengganti meminta konfirmasi',confirmCalls==1&&w.ST.profiles[0].nama=='Aisha');
 confirmResult=true;await upload(JSON.stringify(changed));
 T('konfirmasi mengizinkan penggantian profil',confirmCalls==2&&w.ST.profiles[0].nama=='Nara'&&w.ST.profiles[0].done.sl.includes(0));
 console.log('error runtime:',errs.length?errs:'tidak ada');
 console.log('lulus',ok,'gagal',bad);process.exit(bad?1:0)})();
