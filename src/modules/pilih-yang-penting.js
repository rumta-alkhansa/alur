var MT=["Misi 1: Pilih Informasi","Misi 2: Sederhanakan Peta","Misi 3: Susun Diagram","Misi 4: Ikuti Diagram"];
var H=[
["Mulai dari tujuan robot. Informasi mana yang membantu menuju tujuan?","Apakah warna dinding mengubah arah atau tujuan robot?","Pilih informasi yang membantu robot bergerak dengan aman."],
["Peta perlu menunjukkan awal dan tujuan. Apa lagi yang dapat menghalangi jalan?","Bayangkan robot melihat peta ini. Detail mana yang tidak membantu perjalanan?","Periksa kembali: apakah peta tetap berguna setelah detail itu dihapus?"],
["Diagram punya awal, langkah, dan pemeriksaan. Mana yang harus dimulai lebih dulu?","Pemeriksaan memberi dua cabang. Pasangkan tujuan dengan cabang yang sesuai.","Telusuri urutan dari Mulai sampai keputusan."],
["Baca kondisi pada diagram sebelum memilih hasil.","Apakah contoh ini memenuhi kondisi?","Ikuti cabang Ya atau Tidak sampai ke tujuan." ]
];
function P(m,v){var d;if(m==0){d=DATA.missions[v];return {kind:"info",s:d.story,options:d.options,answer:d.answer}}
if(m==1){d=DATA.maps[v];return {kind:"map",s:d.story,options:d.options,answer:d.answer}}
if(m==2){d=DATA.flows[v];return {kind:"build",s:d.story,blocks:d.blocks,order:d.order,yes:d.yes,no:d.no,actions:d.actions}}
d=DATA.tests[v];return {kind:"trace",s:d.story,condition:d.condition,yes:d.yes,no:d.no,cases:d.cases,options:d.options}
}
function init(p){return {chosen:[],slots:p.blocks?[-1,-1,-1]:[],pick:-1,yes:-1,no:-1,trace:p.cases?p.cases.map(function(){return -1}):[]}}
function selected(list,n){return list.indexOf(n)>-1}
function view(p,s){
if(p.kind=="info"||p.kind=="map")return '<p class="lb">'+(p.kind=="info"?"Pilih informasi yang penting.":"Pilih benda yang perlu ada pada peta.")+'</p><div class="ab-options">'+p.options.map(function(x,i){return '<button class="ab-option'+(selected(s.chosen,i)?' sel':'')+'" data-choice="'+i+'"><span class="ab-mark">'+(selected(s.chosen,i)?"✓":"+")+'</span>'+x+'</button>'}).join("")+'</div>';
if(p.kind=="build"){var h='<p class="lb">Pilih blok, lalu tempatkan pada diagram. Isi juga cabang Ya dan Tidak.</p><div class="pg">'+p.blocks.map(function(x,i){var used=s.slots.indexOf(i)>-1;return '<button class="pc'+(s.pick==i?' sel':'')+(used?' em':'')+'" data-block="'+i+'">'+x+'</button>'}).join("")+'</div><div class="flowchart">'+s.slots.map(function(x,i){return '<button class="flow-slot" data-flow-slot="'+i+'">'+(x<0?"Tempat blok "+(i+1):p.blocks[x])+'</button><span class="flow-arrow">↓</span>'}).join("")+'<div class="flow-branches"><div><b>Ya</b><div class="pg">'+p.actions.map(function(x,i){return '<button class="pc'+(s.yes==i?' sel':'')+'" data-branch="yes" data-action="'+i+'">'+x+'</button>'}).join("")+'</div></div><div><b>Tidak</b><div class="pg">'+p.actions.map(function(x,i){return '<button class="pc'+(s.no==i?' sel':'')+'" data-branch="no" data-action="'+i+'">'+x+'</button>'}).join("")+'</div></div></div><div class="flow-node">Selesai</div></div>';return h}
var h='<p class="lb">Diagram: Jika '+p.condition+' maka '+p.yes+'; jika tidak, '+p.no+'.</p><div class="flowchart"><div class="flow-node">Mulai</div><span class="flow-arrow">↓</span><div class="flow-node">Periksa: '+p.condition+'</div><div class="flow-branches"><div><b>Ya</b><span class="flow-arrow">↓</span><div class="flow-node">'+p.yes+'</div></div><div><b>Tidak</b><span class="flow-arrow">↓</span><div class="flow-node">'+p.no+'</div></div></div><div class="flow-node">Selesai</div></div><p class="lb">Ikuti diagram untuk tiap contoh.</p>';
h+='<div class="ab-cases">'+p.cases.map(function(c,ci){return '<section class="ab-case"><b>'+c.label+'</b><div class="pg">'+p.options.map(function(x,i){return '<button class="pc'+(s.trace[ci]==i?' sel':'')+'" data-case="'+ci+'" data-output="'+i+'">'+x+'</button>'}).join("")+'</div></section>'}).join("")+'</div>';return h
}
function tap(e,p,s){var b=e.target.closest("button");if(!b)return;var d=b.dataset;
if(d.choice!==undefined){var c=+d.choice,i=s.chosen.indexOf(c);if(i>-1)s.chosen.splice(i,1);else s.chosen.push(c);return 1}
if(d.block!==undefined){var n=+d.block,old=s.slots.indexOf(n);if(old>-1){s.slots[old]=-1;s.pick=n}else s.pick=s.pick==n?-1:n;return 1}
if(d.flowSlot!==undefined){var slot=+d.flowSlot;if(s.pick>-1){var prev=s.slots.indexOf(s.pick);if(prev>-1)s.slots[prev]=-1;s.slots[slot]=s.pick;s.pick=-1}else if(s.slots[slot]>-1){s.pick=s.slots[slot];s.slots[slot]=-1}return 1}
if(d.action!==undefined){if(d.branch=="yes")s.yes=+d.action;else s.no=+d.action;return 1}
if(d.case!==undefined){s.trace[+d.case]=+d.output;return 1}
}
function sameSet(a,b){return a.length==b.length&&a.every(function(x){return b.indexOf(x)>-1})}
function go(p,s,k){
if(p.kind=="info"||p.kind=="map"){if(!s.chosen.length){fin(k,"Pilih dulu informasi yang menurutmu berguna.","no",0);return}
if(!sameSet(s.chosen,p.answer)){fin(k,"Belum pas. Pikirkan lagi tujuan dan detail yang benar-benar membantu.","no",0);return}
fin(k,"","ok",1);return}
if(p.kind=="build"){if(s.slots.indexOf(-1)>-1||s.yes<0||s.no<0){fin(k,"Lengkapi semua blok dan cabang diagram dulu.","no",0);return}
if(s.slots.some(function(x,i){return x!=p.order[i]})||p.actions[s.yes]!=p.yes||p.actions[s.no]!=p.no){fin(k,"Ada bagian yang belum cocok. Telusuri diagram dari Mulai ke tiap cabang.","no",0);return}
fin(k,"","ok",1);return}
if(s.trace.indexOf(-1)>-1){fin(k,"Pilih hasil untuk setiap contoh dulu.","no",0);return}
if(s.trace.some(function(x,i){return p.options[x]!=(p.cases[i].condition?p.yes:p.no)})){fin(k,"Ada contoh yang mengikuti cabang berbeda. Periksa kondisi pada diagram.","no",0);return}
fin(k,"","ok",1)
}
function sum(p,s){
if(p.kind=="info"||p.kind=="map")return '<div>Informasi yang kamu pilih:</div><div>'+s.chosen.map(function(i){return p.options[i]}).join(" · ")+'</div><div>Detail penting membantu menyelesaikan tujuan. Detail lain bisa diabaikan.</div>';
if(p.kind=="build")return '<div>Diagrammu mulai, memeriksa kondisi, lalu memilih cabang Ya atau Tidak.</div><div>Apa yang berubah jika kondisinya berbeda?</div>';
return '<div>Kamu mengikuti diagram pada '+s.trace.length+' contoh.</div><div>Ketika kondisi berubah, hasilnya mengikuti cabang yang berbeda.</div>'
}
