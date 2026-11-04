var V=["A","B","C"],$=function(i){return document.getElementById(i)};
var LV=[{n:1,t:"Urutan",s:"Urutan langkah dan memahami masalah",m:"sl"},{n:2,t:"Salah Itu Petunjuk",s:"Menguji dan memperbaiki",m:"pb"},{n:3,t:"Pecah dan Ulangi",s:"Dekomposisi, pola, perulangan"},{n:4,t:"Jika... Maka...",s:"Kondisi dan penalaran",m:"dt"},{n:5,t:"Pilih yang Penting",s:"Abstraksi dan efisiensi"},{n:6,t:"Perancang",s:"Membuat tantangan sendiri"}];
var ORD=["sl","pb","dt"],NM={sl:"Susun Langkah",pb:"Pemburu Bug",dt:"Detektif Logika"};
var MODS={sl:SL,pb:PB,dt:DT},HW=@@HOW@@;
var ST=load(),mod=null,v=0,cur=0,rot=0,S={},DN={},hi={},cache={};
function load(){var d;try{d=JSON.parse(localStorage.getItem("alur.v1"))}catch(e){}return d&&d.profiles?d:{mode:"kelas",profiles:[],active:null}}
function save(){try{localStorage.setItem("alur.v1",JSON.stringify(ST))}catch(e){}}
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function profileDataValid(d){if(!d||d.format!=="alur-profiles"||d.version!==1||!Array.isArray(d.profiles))return false;
var ids=Object.create(null),valid=true;
d.profiles.forEach(function(p){if(!p||typeof p.id!="string"||!p.id||p.id.length>64||ids[p.id]||typeof p.nama!="string"||!p.nama.trim()||p.nama!==p.nama.trim()||p.nama.length>20||typeof p.v!="number"||p.v%1||p.v<0||p.v>2||!p.done||typeof p.done!="object"||Array.isArray(p.done)){valid=false;return}
ids[p.id]=1;Object.keys(p.done).forEach(function(id){var a=p.done[id];if(ORD.indexOf(id)<0||!Array.isArray(a)||a.some(function(n,i){return typeof n!="number"||n%1||n<0||n>3||a.indexOf(n)!=i}))valid=false})});
return valid&&(d.active===null||typeof d.active=="string"&&!!ids[d.active])}
function profileStatus(t,c){var el=$("profile-msg");if(el){el.textContent=t;el.className="msg "+(c||"")}}
function exportProfiles(){var data={format:"alur-profiles",version:1,profiles:ST.profiles,active:ST.active},url;
try{url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
var a=document.createElement("a");a.href=url;a.download="alur-profil.json";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},0);profileStatus("Profil siap disimpan.","ok")}
catch(e){profileStatus("Ekspor gagal. Coba lagi di peramban ini.","no")}}
function importProfiles(file){var reader=new FileReader();
reader.onload=function(){var data;try{data=JSON.parse(reader.result)}catch(e){profileStatus("Berkas tidak valid. Profil tidak berubah.","no");return}
if(!profileDataValid(data)){profileStatus("Format berkas tidak sesuai. Profil tidak berubah.","no");return}
if(ST.profiles.length&&!window.confirm("Impor akan mengganti semua profil dan progres di perangkat ini. Lanjutkan?")){profileStatus("Impor dibatalkan. Profil tidak berubah.");return}
var profiles=data.profiles.map(function(p){var done={};Object.keys(p.done).forEach(function(id){done[id]=p.done[id].slice()});return{id:p.id,nama:p.nama,v:p.v,done:done}});
var next={mode:ST.mode,profiles:profiles,active:data.active};
try{localStorage.setItem("alur.v1",JSON.stringify(next))}catch(e){profileStatus("Profil tidak dapat disimpan. Ruang penyimpanan mungkin penuh.","no");return}
ST=next;home();profileStatus("Profil dan progres berhasil diimpor.","ok")};
reader.onerror=function(){profileStatus("Berkas tidak dapat dibaca. Profil tidak berubah.","no")};
reader.readAsText(file)}
function prof(){return ST.profiles.filter(function(p){return p.id==ST.active})[0]||null}
function full(id){var p=prof();return !!(p&&p.done[id]&&p.done[id].length>=4)}
function locked(id){if(ST.mode!="mandiri")return false;if(!prof())return true;var i=ORD.indexOf(id);return i>0&&!full(ORD[i-1])}
function key(){return v*4+cur}
function ch(i){return (i+rot)%3+1}
function isDone(k){return !!DN[mod.id+":"+k]}
function pz(){var k=mod.id+":"+key();return cache[k]||(cache[k]=mod.P(cur,v))}
function st(){var k=mod.id+":"+key();return S[k]||(S[k]=mod.init(pz()))}
function msg(t,c){$("mg").textContent=t;$("mg").className="msg "+(c||"")}
function rd(){if(mod)draw()}
function fin(k,t,c,w){if(k==key())msg(t,c);if(w){DN[mod.id+":"+k]=1;if(ST.mode=="mandiri"&&prof()){var a=prof().done[mod.id]=prof().done[mod.id]||[];if(a.indexOf(k%4)<0)a.push(k%4);save()}}draw();if(w&&k==key())$("wn").scrollIntoView({behavior:"smooth",block:"nearest"})}
function home(){var p=prof(),m=ST.mode,h='<div class="card"><h2>Mode</h2><div class="seg"><button class="btn'+(m=="kelas"?'':' s')+'" data-md="kelas">Mode Kelas</button><button class="btn'+(m=="mandiri"?'':' s')+'" data-md="mandiri">Mode Mandiri</button></div><p class="mu">'+(m=="kelas"?"Satu perangkat di proyektor, anak maju bergiliran dengan 3 versi soal. Semua level terbuka.":"Siswa mengerjakan jalurnya sendiri di dalam kelas. Level dan misi terbuka satu per satu.")+'</p>';
if(m=="mandiri"){h+='<p class="lb">Siapa yang bermain?</p><div class="seg">'+(ST.profiles.length?'<select id="pf" aria-label="Pilih siswa">'+ST.profiles.map(function(x){return '<option value="'+x.id+'"'+(x.id==ST.active?' selected':'')+'>'+esc(x.nama)+'</option>'}).join("")+'</select>':'')+'<input type="text" id="pn" maxlength="20" placeholder="Nama panggilan" aria-label="Nama panggilan"><button class="btn" id="pa">Tambah siswa</button></div>'+(p?'<p class="mu">Versi soal untuk siswa ini: <b>'+V[p.v]+'</b></p>':'<p class="mu">Tambahkan siswa dulu untuk mulai.</p>')+'<div class="seg"><button class="btn s" id="pe">Ekspor profil</button><button class="btn s" id="pi">Impor profil</button><input type="file" id="profile-file" accept="application/json,.json" hidden></div><p class="mu" id="profile-msg" aria-live="polite"></p>'}
h+='</div><div class="map">'+LV.map(function(l){var off=!l.m||locked(l.m),d=(l.m&&p&&m=="mandiri")?(p.done[l.m]||[]):[];
return '<button class="lv" data-lv="'+(l.m||"")+'"'+(off?' disabled':'')+'><span class="n">Level '+l.n+'</span><h3>'+l.t+'</h3><div>'+l.s+'</div><div class="st">'+(l.m?NM[l.m]+(locked(l.m)?' · terkunci':' · tersedia'):'Segera hadir')+'</div>'+(l.m?'<div class="dots" aria-label="Misi selesai">'+[0,1,2,3].map(function(i){return '<i class="'+(d.indexOf(i)>-1?'on':'')+'"></i>'}).join("")+'</div>':'')+'</button>'}).join("")+'</div>';
$("home").innerHTML=h;show(0)}
function show(p){$("home").hidden=!!p;$("play").hidden=!p;$("vt").hidden=!p||ST.mode!="kelas";$("tabs").hidden=!p;if(!p)mod=null}
function openMod(id){mod=MODS[id];mod.id=id;var p=prof();DN={};S={};hi={};cur=0;rot=0;
if(ST.mode=="mandiri"&&p){v=p.v;(p.done[id]||[]).forEach(function(m){DN[id+":"+(v*4+m)]=1});while(cur<3&&isDone(v*4+cur))cur++}else v=0;
$("how").innerHTML='<summary>Cara bermain</summary>'+HW[id]+(ST.mode=="kelas"?'<p class="mu"><b>Aturan penonton:</b> boleh membacakan dan menjelaskan, tetapi jangan menyebut jawabannya. Anak di depan baru mengetuk setelah penonton sepakat.</p>':'');
$("bc").textContent=id=="sl"?"Cek / Jalankan":id=="pb"?"Jalankan":"Cek jawaban";$("bt").hidden=ST.mode!="kelas";show(1);msg("");draw();window.scrollTo(0,0)}
function bars(){var k=ST.mode=="kelas";
$("vt").innerHTML=V.map(function(n,i){return '<button class="tab'+(i==v?' on':'')+(isDone(i*4+cur)?' dn':'')+'" role="tab" data-v="'+i+'">Anak '+ch(i)+' · Versi '+n+'</button>'}).join("");
$("tabs").innerHTML=mod.MT.map(function(n,i){var lk=!k&&i>0&&!isDone(v*4+i-1);return '<button class="tab'+(i==cur?' on':'')+(isDone(v*4+i)?' dn':'')+'" role="tab" data-i="'+i+'"'+(lk?' disabled':'')+'>Misi '+(i+1)+'</button>'}).join("");
$("tb").innerHTML='<span>'+(k?'Giliran: Anak '+ch(v)+' · Versi '+V[v]:(prof()?esc(prof().nama)+' · Versi '+V[v]:''))+' · '+NM[mod.id]+'</span><button class="btn s" id="bk">← Peta level</button>'}
function draw(){if(!mod)return;var p=pz(),s=st();$("pt").textContent=mod.MT[cur]+" (Versi "+V[v]+")";$("ps").textContent=p.s||"";$("bd").innerHTML=mod.view(p,s);
if(isDone(key())){$("an").innerHTML=mod.sum(p,s);var nb=$("bn");nb.style.display="";
if(ST.mode=="kelas"){if(v<2)nb.textContent="Giliran Anak "+ch(v+1)+" · Versi "+V[v+1];else if(cur<3)nb.textContent="Misi berikutnya · mulai Anak "+ch(0)+" · Versi A";else nb.style.display="none"}
else nb.textContent=cur<3?"Misi berikutnya":"Kembali ke peta level";
$("wn").classList.add("on")}else $("wn").classList.remove("on");bars()}
$("home").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
if(b.dataset.md){ST.mode=b.dataset.md;save();home();return}
if(b.id=="pa"){var n=$("pn").value.trim().slice(0,20);if(!n)return;var id=Date.now().toString(36);ST.profiles.push({id:id,nama:n,v:ST.profiles.length%3,done:{}});ST.active=id;save();home();return}
if(b.id=="pe"){exportProfiles();return}
if(b.id=="pi"){$("profile-file").click();return}
if(b.dataset.lv)openMod(b.dataset.lv)});
$("home").addEventListener("change",function(e){if(e.target.id=="pf"){ST.active=e.target.value;save();home()}});
$("home").addEventListener("change",function(e){if(e.target.id=="profile-file"&&e.target.files&&e.target.files[0])importProfiles(e.target.files[0])});
$("tb").addEventListener("click",function(e){if(e.target.closest("#bk"))home()});
$("bd").addEventListener("click",function(e){var p=pz(),s=st();if(s.run)return;if(mod.tap(e,p,s)){msg("");draw()}});
$("bd").addEventListener("keydown",function(e){if((e.key=="Enter"||e.key==" ")&&e.target.tagName=="LI"){e.preventDefault();e.target.click()}});
$("bc").onclick=function(){var s=st();if(s.run)return;mod.go(pz(),s,key())};
$("bh").onclick=function(){var h=mod.H[cur],k=mod.id+":"+key(),i=hi[k]||0;msg("💡 "+h[i%h.length]);hi[k]=i+1};
$("br").onclick=function(){var k=mod.id+":"+key();if(S[k])S[k].stop=1;S[k]=null;delete DN[k];draw();msg("")};
$("bt").onclick=function(){for(var k in S)if(S[k])S[k].stop=1;rot=(rot+1)%3;S={};DN={};hi={};v=0;cur=0;draw();msg("Putaran tukar: setiap anak kini mendapat versi yang berbeda dari sebelumnya.","ok")};
$("bn").onclick=function(){if(ST.mode=="mandiri"){if(cur<3){cur++;draw();msg("");window.scrollTo({top:0,behavior:"smooth"})}else home();return}if(v<2)v++;else{v=0;cur++}draw();msg("");window.scrollTo({top:0,behavior:"smooth"})};
$("tabs").addEventListener("click",function(e){var b=e.target.closest(".tab");if(b&&!b.disabled){cur=+b.dataset.i;draw();msg("")}});
$("vt").addEventListener("click",function(e){var b=e.target.closest(".tab");if(b){v=+b.dataset.v;draw();msg("")}});
home();
if("serviceWorker" in navigator&&location.protocol.indexOf("http")==0){navigator.serviceWorker.register("sw.js").catch(function(){})}
