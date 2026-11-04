var MT=["Misi 1: Buat Peta","Misi 2: Tambah Penghalang","Misi 3: Uji Jalur","Misi 4: Tantangan Siap"];
var H=[
["Ketuk petak kosong untuk menaruh penghalang. Petak mana yang aman untuk dihalangi?","Peta harus tetap punya jalan dari START ke FINIS.","Coba petak yang berbeda jika robot tidak punya jalan."],
["Penghalang membuat jalur perlu direncanakan. Di mana kamu akan menaruhnya?","Hitung jumlah penghalang, lalu periksa jalur robot.","Apakah semua penghalang berada di petak kosong?"],
["Susun program sedikit demi sedikit. Menghadap ke arah mana robot mulai?","Uji program dan perhatikan perubahan arah robot.","Jika robot berhenti, bagian mana yang perlu diperbaiki?"],
["Peta perlu memenuhi jumlah penghalang dan punya jalan yang bisa dilalui.","Uji program dari START sampai FINIS.","Bisakah kamu menjelaskan cara menguji tantangan ini?"]
];
var BASE=["....F",".....",".....",".....","S...."];
function P(m,v){var t=tr(BASE,v),a=at(t.g,"S");return {s:["Rancang peta dengan tepat 1 penghalang.","Rancang peta dengan tepat 2 penghalang.","Rancang peta dengan tepat 3 penghalang.","Rancang peta dengan tepat 4 penghalang."][m],t:t,st:[a[0],a[1],t.d],walls:m+1,cap:20}}
function init(p){return {g:p.t.g.map(function(r){return r.slice()}),prog:[],rb:null,bad:-1,run:0}}
function view(p,s){
var h='<p class="lb">Ketuk petak kosong untuk menambah atau menghapus penghalang. START dan FINIS tidak dapat diubah.</p><div class="designer-grid" role="group" aria-label="Peta rancangan">';
s.g.forEach(function(row,r){row.forEach(function(ch,c){var fixed=ch=="S"||ch=="F",robot=s.rb&&s.rb[0]==r&&s.rb[1]==c,face=robot?'<span class="designer-robot">🤖<i style="transform:rotate('+(s.rb[2]*90)+'deg)">▲</i></span>':ch=="S"?"START":ch=="F"?"FINIS":ch=="#"?"■":"·";
var label=robot?"Robot, "+(ch=="F"?"FINIS":"petak kosong"):ch=="S"?"START":ch=="F"?"FINIS":ch=="#"?"Penghalang":"Petak kosong";
h+='<button type="button" class="designer-cell'+(ch=="#"?' blocked':'')+(fixed?' fixed':'')+(robot?' occupied':'')+'" data-cell="'+r+'-'+c+'" aria-label="'+label+'"'+(fixed||s.run?' disabled':'')+'>'+face+'</button>'})});
h+='</div><div class="designer-count">Penghalang: '+s.g.map(function(r){return r.filter(function(c){return c=="#"}).length}).reduce(function(a,b){return a+b},0)+' dari '+p.walls+'</div><p class="lb">Program ('+s.prog.length+' dari '+p.cap+' kartu):</p><div class="pg">'+(s.prog.length?s.prog.map(function(c,i){return '<button type="button" class="pc" data-program="'+i+'">'+(i+1)+'. '+IC[c]+' · hapus</button>'}).join(""):'<span class="mu">Belum ada kartu.</span>')+'</div><div class="pg">'+["F","L","R"].map(function(c){return '<button type="button" class="pc" data-command="'+c+'"'+(s.prog.length>=p.cap||s.run?' disabled':'')+'>'+IC[c]+'</button>'}).join("")+'</div>';
return h
}
function tap(e,p,s){var b=e.target.closest("button");if(!b)return;var d=b.dataset;
if(d.cell!==undefined){var a=d.cell.split("-"),r=+a[0],c=+a[1];if(s.g[r][c]=="S"||s.g[r][c]=="F")return;s.g[r][c]=s.g[r][c]=="#" ? "." : "#";s.rb=null;s.bad=-1;return 1}
if(d.command){if(s.prog.length<p.cap){s.prog.push(d.command);s.rb=null;s.bad=-1}return 1}
if(d.program!==undefined){s.prog.splice(+d.program,1);s.rb=null;s.bad=-1;return 1}
}
function wallCount(g){return g.reduce(function(n,r){return n+r.filter(function(c){return c=="#"}).length},0)}
function go(p,s,k){
var n=wallCount(s.g);if(n!=p.walls){fin(k,"Peta ini perlu tepat "+p.walls+" penghalang. Hitung lagi petaknya.","no",0);return}
if(bfs(s.g,p.st)<0){fin(k,"Robot belum punya jalan ke FINIS. Pindahkan satu penghalang.","no",0);return}
if(!s.prog.length){fin(k,"Peta sudah punya jalan. Susun program untuk mengujinya.","no",0);return}
run({t:{g:s.g},st:p.st},s,k)
}
function sum(p,s){
var h='<div><b>Peta tantanganmu</b></div><table class="challenge-map" aria-label="Ringkasan peta">'+s.g.map(function(row){return '<tr>'+row.map(function(c){return '<td>'+(c=="S"?"S":c=="F"?"F":c=="#"?"■":"·")+'</td>'}).join("")+'</tr>'}).join("")+'</table>';
return h+'<div>Penghalang: '+wallCount(s.g)+'. Program: '+s.prog.map(function(c){return IC[c]}).join(" → ")+'.</div><div>Robot berhasil diuji dari START ke FINIS. Bisakah kamu menjelaskan bagaimana teman dapat menguji peta ini?</div>'
}
