var MT=["Misi 1: Belokan Salah","Misi 2: Langkah Hilang","Misi 3: Dua Bug","Misi 4: Tiga Bug"];
var H=[["Jalankan dulu dan lihat di mana robot berhenti. Itu petunjuk bug.","Tanyakan: robot menghadap ke mana saat salah, dan seharusnya ke mana?","Ubah satu kartu saja, lalu jalankan lagi."],
["Jalankan dan lihat robot berhenti di petak mana. Apakah ia kurang jalan?","Hitung petak yang harus dilalui, lalu bandingkan dengan jumlah kartu Maju.","Sisipkan kartu di tempat yang kurang."],
["Ada dua bug. Perbaiki satu per satu, jangan sekaligus.","Setelah satu bug diperbaiki, jalankan lagi. Robot akan gagal di tempat yang baru.","Catat setiap bug di jurnalmu."],
["Ada tiga bug dari tiga jenis: salah arah, kurang langkah, dan kelebihan langkah.","Perbaiki mulai dari bug yang paling awal mengenai robot.","Jalankan setelah setiap perbaikan dan lihat apa yang berubah."]];
var B=[[["..F.",".#..",".#..","S..."],"FFFRFF","FFFLFF"],[["...F","..#.",".#..","S..."],"FFFRFFF","FFFRFF"],[["....F",".##..","...#.",".#...","S...."],"FFFFRFFFF","FFFLFFFF"],[["..F..",".#.#.",".#...","...#.","S...."],"FFFFRFF","FFFLFFF"]];
var NB=["Ada 1 bug (salah arah).","Ada 1 bug (kurang langkah).","Ada 2 bug.","Ada 3 bug."];
function sw(x){return x.replace(/[LR]/g,function(c){return c=="L"?"R":"L"})}
function P(m,v){var b=B[m],t=tr(b[0],v),a=at(t.g,"S"),o=v==1?sw(b[1]):b[1],d=v==1?sw(b[2]):b[2];
return {s:"Program robot ini punya bug. Jalankan, cari kesalahannya, lalu perbaiki sampai robot tiba di FINIS. "+NB[m]+" Jenis bug: salah arah, kurang langkah, kelebihan langkah.",t:t,st:[a[0],a[1],t.d],ok:o,bad:d,cap:o.length+3}}
function init(p){return {prog:p.bad.split(""),rb:null,run:0,bad:-1,sel:-1,ed:0}}
function view(p,s){var n=s.prog.length,h=gh(p.t.g,s.rb||p.st)+'<p class="lb">Programmu ('+n+' kartu). Ketuk sebuah kartu untuk mengubahnya.</p><div class="pg">'+s.prog.map(function(c,i){return '<button class="pc'+(s.bad==i?' bad':'')+(s.sel==i?' sel':'')+'" data-pi="'+i+'">'+(i+1)+'. '+IC[c]+'</button>'}).join("")+'<button class="pc em'+(s.sel==n?' sel':'')+'" data-pi="'+n+'">+ akhir</button></div>';
if(s.sel>-1){var q=function(a){return ["F","L","R"].map(function(c){return '<button class="pc" data-'+a+'="'+c+'">'+IC[c]+'</button>'}).join("")};
h+='<p class="lb">Kartu terpilih: '+(s.sel<n?'nomor '+(s.sel+1):'posisi akhir')+'</p>'+(s.sel<n?'<div class="pg"><span class="lb">Ganti jadi</span>'+q("rp")+'</div>':'')+'<div class="pg"><span class="lb">Sisipkan sebelum</span>'+q("ins")+'</div>'+(s.sel<n?'<div class="pg"><button class="pc" data-dl="1">Hapus kartu ini</button></div>':'')}
return h}
function tap(e,p,s){var b=e.target.closest("button");if(!b)return;var d=b.dataset,n=s.prog.length,ed=0;
if(d.pi!==undefined){var i=+d.pi;s.sel=s.sel===i?-1:i;return 1}
if(d.rp&&s.sel>-1&&s.sel<n){s.prog[s.sel]=d.rp;ed=1}
else if(d.ins&&s.sel>-1&&n<p.cap){s.prog.splice(s.sel,0,d.ins);ed=1}
else if(d.dl&&s.sel>-1&&s.sel<n){s.prog.splice(s.sel,1);ed=1}
if(ed){s.ed++;s.sel=-1;s.rb=null;s.bad=-1;return 1}}
function go(p,s,k){if(!s.prog.length){fin(k,"Programnya kosong. Tambahkan kartu dulu.","no",0);return}s.sel=-1;run(p,s,k)}
function sum(p,s){return '<div>Salah satu program yang benar: '+p.ok.split("").map(function(c){return IC[c]}).join(" → ")+'</div><div>Jumlah perbaikan yang kamu buat: '+s.ed+'</div><div><b>Jurnal Bug</b> (tulis di buku): 1. Bug apa yang kamu temukan? 2. Apa penyebabnya? 3. Apa perbaikanmu?</div>'}
