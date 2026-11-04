const http=require('http');
const fs=require('fs');
const path=require('path');
const {spawn}=require('child_process');

const root=path.resolve(__dirname,'../dist');
const port=Number(process.env.PORT)||8000;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};

const server=http.createServer((req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){
    res.writeHead(405,{'Allow':'GET, HEAD'}).end();
    return;
  }
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch(e){
    res.writeHead(400).end('Bad request');
    return;
  }
  const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,'');
  const file=path.resolve(root,relative);
  const fromRoot=path.relative(root,file);
  if(fromRoot==='..'||fromRoot.startsWith('..'+path.sep)||path.isAbsolute(fromRoot)){
    res.writeHead(403).end('Forbidden');
    return;
  }
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile()){
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});
    if(req.method==='HEAD'){res.end();return}
    fs.createReadStream(file).pipe(res);
  });
});

server.on('error',error=>{
  console.error('Server gagal dijalankan:',error.message);
  process.exitCode=1;
});

server.listen(port,'127.0.0.1',()=>{
  const url='http://127.0.0.1:'+port+'/';
  console.log('Alur tersedia di '+url+' (Ctrl+C untuk berhenti)');
  const command=process.platform==='win32'?'cmd':process.platform==='darwin'?'open':'xdg-open';
  const args=process.platform==='win32'?['/c','start','',url]:[url];
  const browser=spawn(command,args,{detached:true,stdio:'ignore'});
  browser.on('error',error=>console.warn('Tidak dapat membuka browser otomatis:',error.message));
  browser.unref();
});
