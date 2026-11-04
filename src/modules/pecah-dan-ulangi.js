var MT=["Misi 1: Pecah Tugas","Misi 2: Cari Pola","Misi 3: Blok Ulangi","Misi 4: Jalur Hemat"];
var H=[
["Tiap tugas kecil punya dua langkah. Tempatkan kartu pada tugas dan urutan yang cocok.","Mulai dari tugas pertama. Apa yang perlu disiapkan sebelum mulai merakit?","Periksa lagi urutan di dalam setiap tugas kecil."],
["Perhatikan ubin dari kiri ke kanan. Bagian mana yang berulang?","Coba ucapkan pola yang kamu lihat dengan kata-kata.","Pilih ubin yang meneruskan pola, bukan yang hanya mirip."],
["Satu blok dapat mengerjakan langkah yang sama berulang kali. Berapa maju yang diperlukan sebelum belok?","Bandingkan banyaknya langkah maju dengan banyaknya kartu program.","Jalankan programmu. Lihat posisi robot setelah setiap blok."],
["Bandingkan jumlah kartu pada semua jalur.","Belokan juga memakai satu kartu. Hitung semua perintah.","Jalur mana yang sampai dengan kartu paling sedikit? Jelaskan alasanmu."]
];
function sw(x){return x.replace(/[LR]/g,function(c){return c=="L"?"R":"L"})}
function P(m,v){
if(m==0){var q=DATA.missions[v];return {kind:"split",s:q.story,groups:q.groups,items:q.order.map(function(i){return {text:q.steps[i],slot:i}})}}
if(m==1){var p=DATA.patterns[v];return {kind:"pattern",s:p.story,seq:p.sequence,opts:p.options,answer:p.answer}}
if(m==2){var t=tr(DATA.grid,v),a=at(t.g,"S");return {kind:"repeat",s:"Susun program dengan blok ulangi agar robot tiba di FINIS. Kartu program paling banyak 3.",t:t,st:[a[0],a[1],t.d],cap:3,solution:[{cmd:"F",repeat:4},v==1?"L":"R",{cmd:"F",repeat:4}]}}
var board=tr(DATA.grid,v),start=at(board.g,"S"),routes=DATA.routes.map(function(r,i){var code=v==1?sw(r):r;return {id:i,name:"Jalur "+["Merah","Biru","Hijau"][i],code:code,cards:code.length}});
routes=routes.slice(v).concat(routes.slice(0,v));
return {kind:"route",s:"Tiga jalur menuju FINIS punya jumlah kartu berbeda. Pilih jalur paling hemat dan alasanmu.",t:board,st:[start[0],start[1],board.d],routes:routes,why:DATA.reasons,answer:0}
}
function init(p){if(p.kind=="split")return {slots:p.items.map(function(){return -1}),pick:-1};
if(p.kind=="pattern")return {choice:-1};
if(p.kind=="repeat")return {prog:[],repeatCount:0,rb:null,bad:-1,run:0};
return {route:-1,why:-1}}
function view(p,s){
if(p.kind=="split"){var h='<p class="lb">Pilih kartu tugas, lalu pilih tempatnya.</p><div class="pg">'+p.items.map(function(x,i){var used=s.slots.indexOf(i)>-1;return '<button class="pc'+(s.pick==i?' sel':'')+(used?' em':'')+'" data-step="'+i+'">'+x.text+'</button>'}).join("")+'</div>';
h+='<div class="split-groups">'+p.groups.map(function(g,gi){return '<section class="split-group"><h3>'+g+'</h3>'+[0,1].map(function(n){var slot=gi*2+n,idx=s.slots[slot];return '<button class="split-slot'+(s.pick>-1?' ready':'')+'" data-slot="'+slot+'"><b>'+(n+1)+'.</b> '+(idx<0?'Pilih langkah':p.items[idx].text)+'</button>'}).join("")+'</section>'}).join("")+'</div>';
return h}
if(p.kind=="pattern")return '<p class="lb">Ketuk ubin yang melanjutkan pola.</p><div class="pattern-seq">'+p.seq.map(function(x){return '<span>'+x+'</span>'}).join("")+'<span>?</span></div><div class="pg">'+p.opts.map(function(x,i){return '<button class="pc'+(s.choice==i?' sel':'')+'" data-opt="'+i+'">'+x+'</button>'}).join("")+'</div>';
if(p.kind=="repeat"){var h=gh(p.t.g,s.rb||p.st)+'<p class="lb">Program ('+s.prog.length+' dari '+p.cap+' kartu). Ketuk kartu untuk menghapusnya.</p><div class="pg">'+(s.prog.length?s.prog.map(function(c,i){var label=typeof c=="string"?IC[c]:"Ulangi "+c.repeat+"× "+IC[c.cmd];return '<button class="pc" data-pi="'+i+'">'+(i+1)+'. '+label+'</button>'}).join(""):'<span class="mu">Belum ada kartu.</span>')+'</div><p class="lb">Tambah perintah biasa:</p><div class="pg">'+["F","L","R"].map(function(c){return '<button class="pc" data-add="'+c+'">'+IC[c]+'</button>'}).join("")+'</div><p class="lb">Blok ulangi: pilih jumlah, lalu gerakannya.</p><div class="pg">'+[2,3,4].map(function(n){return '<button class="pc'+(s.repeatCount==n?' sel':'')+'" data-count="'+n+'">'+n+' kali</button>'}).join("")+'</div><div class="pg">'+["F","L","R"].map(function(c){return '<button class="pc" data-loop="'+c+'"'+(s.repeatCount?'':' disabled')+'>Ulangi '+(s.repeatCount||"…")+'× '+IC[c]+'</button>'}).join("")+'</div>';return h}
var rh=gh(p.t.g,p.st)+'<p class="lb">Bandingkan urutan perintah pada tiap jalur. Pilih satu.</p><div class="pg">'+p.routes.map(function(r,i){return '<button class="route-option'+(s.route==i?' sel':'')+'" data-route="'+i+'"><b>'+r.name+'</b><span class="route-steps">'+r.code.split("").map(function(c){var icon=c=="F"?"↑":c=="L"?"↰":"↱";return '<span class="route-step" aria-label="'+IC[c]+'">'+icon+'</span>'}).join("")+'</span></button>'}).join("")+'</div><p class="lb">Apa alasanmu?</p><div class="pg">'+p.why.map(function(x,i){return '<button class="pc'+(s.why==i?' sel':'')+'" data-why="'+i+'">'+x+'</button>'}).join("")+'</div>';return rh
}
function tap(e,p,s){var b=e.target.closest("button");if(!b)return;var d=b.dataset;
if(p.kind=="split"){if(d.step!==undefined){var i=+d.step,old=s.slots.indexOf(i);if(old>-1){s.slots[old]=-1;s.pick=i}else s.pick=s.pick==i?-1:i;return 1}
if(d.slot!==undefined){var k=+d.slot;if(s.pick>-1){s.slots[k]=s.pick;s.pick=-1}else if(s.slots[k]>-1){s.pick=s.slots[k];s.slots[k]=-1}return 1}return}
if(p.kind=="pattern"&&d.opt!==undefined){s.choice=+d.opt;return 1}
if(p.kind=="repeat"){if(d.count!==undefined){s.repeatCount=+d.count;return 1}
if(d.loop&&s.repeatCount&&s.prog.length<p.cap){s.prog.push({cmd:d.loop,repeat:s.repeatCount});s.repeatCount=0;s.rb=null;return 1}
if(d.add&&s.prog.length<p.cap){s.prog.push(d.add);s.rb=null;return 1}
if(d.pi!==undefined){s.prog.splice(+d.pi,1);s.rb=null;return 1}return}
if(d.route!==undefined){s.route=+d.route;return 1}if(d.why!==undefined){s.why=+d.why;return 1}
}
function go(p,s,k){
if(p.kind=="split"){if(s.slots.indexOf(-1)>-1){fin(k,"Lengkapi semua tempat dulu. Mana tugas kecil yang belum selesai?","no",0);return}
if(s.slots.some(function(item,slot){return p.items[item].slot!=slot})){fin(k,"Ada langkah yang belum pas. Cek urutan tugas kecil satu per satu.","no",0);return}
fin(k,"","ok",1);return}
if(p.kind=="pattern"){if(s.choice<0){fin(k,"Pilih satu ubin untuk melanjutkan pola.","no",0);return}
if(s.choice!=p.answer){fin(k,"Belum cocok. Perhatikan susunan ubin dari awal.","no",0);return}
fin(k,"","ok",1);return}
if(p.kind=="repeat"){if(!s.prog.length){fin(k,"Tambahkan kartu program dulu.","no",0);return}
if(!s.prog.some(function(c){return typeof c=="object"})){fin(k,"Coba gunakan satu blok ulangi untuk langkah yang berulang.","no",0);return}
if(!sim(p.t.g,p.st,expand(s.prog)).ok){fin(k,"Robot belum tiba di FINIS. Periksa urutan blok dan arah belok.","no",0);return}
run(p,s,k);return}
if(s.route<0||s.why<0){fin(k,"Pilih satu jalur dan satu alasan.","no",0);return}
if(p.routes[s.route].id!=p.answer||s.why!=0){fin(k,"Bandingkan lagi jumlah kartu. Belokan juga memakai satu kartu.","no",0);return}
fin(k,"","ok",1)
}
function sum(p,s){
if(p.kind=="split")return p.groups.map(function(g,i){return '<div><b>'+g+'</b>: '+[s.slots[i*2],s.slots[i*2+1]].map(function(n){return p.items[n].text}).join(" → ")+'</div>'}).join("");
if(p.kind=="pattern")return '<div>Pola ubinmu lengkap. Apa yang berulang?</div>';
if(p.kind=="repeat")return '<div>Program: '+s.prog.map(function(c){return typeof c=="string"?IC[c]:"Ulangi "+c.repeat+"× "+IC[c.cmd]}).join(" → ")+'</div><div>Blok program: '+s.prog.length+'. Langkah setelah dibuka: '+expand(s.prog).length+'. Apa yang diulang robot?</div>';
var r=p.routes.filter(function(x){return x.id==p.answer})[0];return '<div>'+r.name+' memakai '+r.cards+' kartu, paling sedikit.</div><div>Belokan juga dihitung sebagai kartu. Apa yang kamu bandingkan?</div>'
}
