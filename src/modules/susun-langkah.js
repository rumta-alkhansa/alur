var MT=["Misi 1: Urutan Benda","Misi 2: Urutan Lebih Panjang","Misi 3: Robot di Lantai Berpetak","Misi 4: Kartu Paling Hemat"];
var H=[["Mulai dari pertanyaan: apa yang harus ada lebih dulu sebelum robot bisa dipakai?","Cari langkah yang pasti pertama dan yang pasti terakhir, lalu isi bagian tengahnya.","Kalau satu langkah dipindah, apakah langkah sesudahnya masih bisa dikerjakan?"],
["Cari langkah yang pasti pertama dan yang pasti terakhir, lalu isi bagian tengahnya.","Tanyakan: apa yang harus sudah selesai sebelum langkah ini?","Kalau urutanmu berbeda dari teman, jelaskan alasannya satu per satu."],
["Hitung dulu: robot menghadap ke mana, dan berapa petak sampai belokan?","Kiri dan Kanan dihitung dari sudut pandang robot, bukan sudut pandangmu.","Jalankan sebagian program dulu, lihat robot berhenti di mana, lalu lanjutkan."],
["Cari jalur dengan belokan paling sedikit.","Hitung jumlah petak lurus, bukan hanya jumlah belokan.","Bandingkan dua jalur: mana yang kartunya lebih sedikit?"]];
var O=[[{s:"Tujuan: menyalakan lampu robot.",a:["Pasang baterai ke robot","Tutup penutup baterai","Tekan tombol hidup","Lihat lampu menyala"],p:[2,0,3,1]},
{s:"Tujuan: memasang roda robot.",a:["Pasang poros ke badan robot","Pasang roda pada poros","Kencangkan baut roda","Putar roda untuk memeriksa"],p:[1,3,0,2]},
{s:"Tujuan: membaca jarak dengan sensor.",a:["Pasang sensor di depan robot","Sambungkan kabel sensor","Nyalakan robot","Baca angka jarak di layar"],p:[3,0,2,1]}],
[{s:"Tujuan: menyiapkan robot sebelum lomba.",a:["Periksa kabel dan roda","Pasang baterai penuh","Letakkan robot di garis start","Tekan tombol hidup","Tunggu lampu hijau menyala","Lepaskan tangan dari robot"],p:[3,5,1,0,4,2]},
{s:"Tujuan: mencatat cahaya dengan sensor.",a:["Pasang sensor cahaya","Sambungkan sensor ke papan","Unggah program ke papan","Nyalakan robot","Arahkan sensor ke lampu","Catat angka yang tampil"],p:[4,0,5,2,1,3]},
{s:"Tujuan: menyiapkan robot penyapu.",a:["Rakit badan robot","Pasang motor","Pasang sikat di depan","Sambungkan baterai","Uji putaran motor","Letakkan robot di lantai"],p:[2,5,0,4,1,3]}]];
var G3=["..F.",".#..",".#..","S..."],G4=["....F",".###.","..#..",".#...","S..#."];
function P(m,v){if(m<2)return O[m][v];var t=tr(m==2?G3:G4,v),a=at(t.g,"S"),st=[a[0],a[1],t.d],mn=bfs(t.g,st),cap=mn+(m==2?4:2);
return {s:m==2?"Bawa robot dari START ke FINIS dengan kartu perintah. Hindari kardus. Kiri dan Kanan dihitung dari sudut pandang robot.":"Kartunya terbatas: hanya "+cap+" kartu. Cari urutan yang paling hemat!",t:t,st:st,mn:mn,cap:cap}}
function init(p){return p.a?{sl:p.a.map(function(){return -1}),bad:[]}:{prog:[],rb:null,run:0,bad:-1}}
function view(p,s){
if(p.a)return '<p class="lb">Susun langkahnya. Ketuk kartu di bawah untuk mengisi, ketuk kotak untuk mengosongkan.</p><ol class="sl">'+p.a.map(function(_,i){var c=s.sl[i];return '<li><button data-sl="'+i+'" class="'+(s.bad.indexOf(i)>-1?'bad':'')+'"><b>'+(i+1)+'</b><span>'+(c<0?'Langkah '+(i+1)+' ...':p.a[c])+'</span></button></li>'}).join("")+'</ol><p class="lb">Kartu langkah:</p><div class="bk">'+p.p.filter(function(c){return s.sl.indexOf(c)<0}).map(function(c){return '<button data-bk="'+c+'">'+p.a[c]+'</button>'}).join("")+'</div>';
return gh(p.t.g,s.rb||p.st)+'<p class="lb">Programmu ('+s.prog.length+' dari '+p.cap+' kartu). Ketuk kartu untuk menghapusnya.</p><div class="pg">'+(s.prog.length?s.prog.map(function(c,i){return '<button class="pc'+(s.bad==i?' bad':'')+'" data-pi="'+i+'">'+(i+1)+'. '+IC[c]+'</button>'}).join(""):'<span class="mu">Belum ada kartu.</span>')+'</div><p class="lb">Tambah kartu:</p><div class="pg">'+["F","L","R"].map(function(c){return '<button class="pc" data-ch="'+c+'">'+IC[c]+'</button>'}).join("")+'</div>'}
function tap(e,p,s){var b=e.target.closest("button");if(!b)return;var d=b.dataset;
if(p.a){if(d.sl!==undefined&&s.sl[+d.sl]>-1){s.sl[+d.sl]=-1;s.bad=[];return 1}if(d.bk!==undefined){var i=s.sl.indexOf(-1);if(i>-1){s.sl[i]=+d.bk;s.bad=[];return 1}}return}
if(d.ch&&s.prog.length<p.cap){s.prog.push(d.ch);s.rb=null;s.bad=-1;return 1}
if(d.pi!==undefined){s.prog.splice(+d.pi,1);s.rb=null;s.bad=-1;return 1}}
function go(p,s,k){
if(p.a){if(s.sl.indexOf(-1)>-1){fin(k,"Isi semua langkah dulu. Masih ada kotak kosong.","no",0);return}
s.bad=[];s.sl.forEach(function(c,i){if(c!=i)s.bad.push(i)});
if(s.bad.length)fin(k,"Langkah nomor "+(s.bad[0]+1)+" belum tepat. Tanyakan: apa yang harus sudah selesai sebelum langkah ini?","no",0);else fin(k,"","ok",1);return}
if(!s.prog.length){fin(k,"Susun dulu kartu programmu.","no",0);return}run(p,s,k)}
function sum(p,s){if(p.a)return p.a.map(function(t,i){return '<div>'+(i+1)+'. '+t+'</div>'}).join("")+'<div>Coba tukar dua langkah. Apa yang terjadi?</div>';
return '<div>'+s.prog.map(function(c){return IC[c]}).join(" → ")+'</div><div>Kartu terpakai: '+s.prog.length+'. Terpendek: '+p.mn+(s.prog.length==p.mn?'. Sempurna!':'. Bisakah lebih hemat?')+'</div>'}
