const http=require("http"),fs=require("fs"),path=require("path");
const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".svg":"image/svg+xml",".ico":"image/x-icon"};
const root=path.join(__dirname,"..");
http.createServer((q,s)=>{let p=q.url.split("?")[0];if(p==="/")p="/index.html";const f=path.normalize(path.join(root,p));
 if(!f.startsWith(root)){s.writeHead(403);return s.end()}
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);return s.end("Not found")}s.writeHead(200,{"Content-Type":T[path.extname(f)]||"text/plain"});s.end(d)})
}).listen(process.env.PORT||3000,()=>console.log("http://localhost:"+(process.env.PORT||3000)));