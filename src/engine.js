var DR=[[-1,0],[0,1],[1,0],[0,-1]],IC={F:"⬆ Maju",L:"↰ Kiri",R:"↱ Kanan"};
function tr(g,v){var R=g.map(function(x){return x.split("")});if(v==1)R=R.map(function(r){return r.slice().reverse()});if(v==2)R=R.slice().reverse().map(function(r){return r.slice().reverse()});return {g:R,d:v==2?2:0}}
function at(g,c){for(var r=0;r<g.length;r++)for(var k=0;k<g[r].length;k++)if(g[r][k]==c)return [r,k]}
function mv(g,p,ch){var r=p[0],c=p[1],d=p[2];if(ch=="L")return [r,c,(d+3)%4];if(ch=="R")return [r,c,(d+1)%4];var nr=r+DR[d][0],nc=c+DR[d][1];if(nr<0||nc<0||nr>=g.length||nc>=g[0].length||g[nr][nc]=="#")return null;return [nr,nc,d]}
function expand(prog){var out=[];prog.forEach(function(a){if(typeof a=="string"){if(["F","L","R"].indexOf(a)<0)throw new Error("Perintah program tidak valid.");out.push(a);return}
if(!a||["F","L","R"].indexOf(a.cmd)<0||typeof a.repeat!="number"||a.repeat%1||a.repeat<2||a.repeat>9)throw new Error("Blok ulangi tidak valid.");
for(var i=0;i<a.repeat;i++)out.push(a.cmd)});return out}
function sim(g,p,prog){var x=p;for(var i=0;i<prog.length;i++){x=mv(g,x,prog[i]);if(!x)return {ok:0,at:i}}var f=at(g,"F");return {ok:x[0]==f[0]&&x[1]==f[1]?1:0,at:prog.length}}
function bfs(g,p){var f=at(g,"F"),q=[[p[0],p[1],p[2],0]],seen={};seen[p.join()]=1;while(q.length){var x=q.shift();if(x[0]==f[0]&&x[1]==f[1])return x[3];["F","L","R"].forEach(function(ch){var y=mv(g,x,ch);if(y&&!seen[y.join()]){seen[y.join()]=1;q.push([y[0],y[1],y[2],x[3]+1])}})}return -1}
function gh(g,rb){var h='<div class="sc"><table class="gr">';g.forEach(function(row,r){h+='<tr>';row.forEach(function(ch,c){var x='',k='';if(ch=="#"){k="ob";x="📦"}else if(ch=="F"){k="fn";x="🏁"}else if(ch=="S")x="<small>START</small>";if(rb[0]==r&&rb[1]==c)x='<span class="rb">🤖<i style="transform:rotate('+(rb[2]*90)+'deg)">▲</i></span>';h+='<td class="'+k+'">'+x+'</td>'});h+='</tr>'});return h+'</table></div>'}
function run(p,s,k){if(s.run)return;var g=p.t.g,prog=expand(s.prog),i=0;s.rb=p.st.slice();s.run=1;s.bad=-1;rd();var tm=setInterval(function(){if(s.stop){clearInterval(tm);return}
if(i>=prog.length){clearInterval(tm);s.run=0;var f=at(g,"F"),w=s.rb[0]==f[0]&&s.rb[1]==f[1];fin(k,w?"Robot sampai di FINIS. Kasus selesai!":"Robot berhenti sebelum FINIS. Periksa langkah terakhirnya.",w?"ok":"no",w);return}
var y=mv(g,s.rb,prog[i]);if(!y){clearInterval(tm);s.run=0;s.bad=i;fin(k,"Robot menabrak atau keluar petak pada langkah "+(i+1)+". Itu tempat bug-nya!","no",0);return}s.rb=y;i++;rd()},500)}
