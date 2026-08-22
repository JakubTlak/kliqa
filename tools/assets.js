const fs=require('fs'), zlib=require('zlib');

// --- mały enkoder PNG (bez filtrów, filter 0 na wiersz) ---
function crc32(buf){let c,t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}
 let crc=0xffffffff;for(const b of buf)crc=t[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
function chunk(type,data){const len=Buffer.alloc(4);len.writeUInt32BE(data.length,0);
 const td=Buffer.concat([Buffer.from(type,'ascii'),data]);const c=Buffer.alloc(4);c.writeUInt32BE(crc32(td),0);
 return Buffer.concat([len,td,c]);}
function png(w,h,colorType,raw){ // raw = rows already interleaved with filter bytes
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=colorType;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),
   chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);}

// --- 1. ziarno tła: szarość ~128 (neutralna dla trybu overlay) z lekkim rozrzutem ---
{
 const S=128, rows=[];
 let seed=1337; const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<S;y++){const row=Buffer.alloc(S+1);row[0]=0;
  for(let x=0;x<S;x++) row[x+1]=Math.max(0,Math.min(255,Math.round(128+(rnd()-0.5)*66)));
  rows.push(row);}
 const buf=png(S,S,0,Buffer.concat(rows));
 fs.writeFileSync('noise.b64.txt', buf.toString('base64'));
 console.log('ziarno:', (buf.length/1024).toFixed(1),'KB ->', (buf.toString('base64').length/1024).toFixed(1),'KB b64');
}

// --- 2. logo jako maska alfa: dekoduj PNG, przeskaluj, zapisz 8-bit grayscale+alpha ---
function decodePNG(buf){
 let off=8,w=0,h=0,ct=0;const idat=[];
 while(off<buf.length){const len=buf.readUInt32BE(off);const type=buf.toString('ascii',off+4,off+8);
  const data=buf.subarray(off+8,off+8+len);
  if(type==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);ct=data[9];}
  else if(type==='IDAT')idat.push(data); else if(type==='IEND')break; off+=12+len;}
 const raw=zlib.inflateSync(Buffer.concat(idat));
 const bpp={0:1,2:3,4:2,6:4}[ct]; if(!bpp) throw new Error('ct '+ct);
 const stride=w*bpp,out=Buffer.alloc(h*stride);let pos=0;
 for(let y=0;y<h;y++){const f=raw[pos++];const line=raw.subarray(pos,pos+stride);pos+=stride;
  const cur=out.subarray(y*stride,(y+1)*stride);const prev=y>0?out.subarray((y-1)*stride,y*stride):null;
  for(let x=0;x<stride;x++){const a=x>=bpp?cur[x-bpp]:0,b=prev?prev[x]:0,c=prev&&x>=bpp?prev[x-bpp]:0;let v=line[x];
   if(f===1)v+=a;else if(f===2)v+=b;else if(f===3)v+=(a+b)>>1;
   else if(f===4){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);v+=(pa<=pb&&pa<=pc)?a:(pb<=pc?b:c);}
   cur[x]=v&255;}}
 return {w,h,bpp,data:out};
}
{
 const src=decodePNG(fs.readFileSync('D:/projects/kliqa/materiały/logo.png'));
 const TH=88, TW=Math.round(src.w/src.h*TH);
 const rows=[];
 for(let y=0;y<TH;y++){
  const row=Buffer.alloc(TW*2+1);row[0]=0;
  for(let x=0;x<TW;x++){
   // uśrednienie po prostokącie źródłowym (box filter) -> jasność staje się kanałem alfa
   const x0=Math.floor(x*src.w/TW), x1=Math.max(x0+1,Math.floor((x+1)*src.w/TW));
   const y0=Math.floor(y*src.h/TH), y1=Math.max(y0+1,Math.floor((y+1)*src.h/TH));
   let sum=0,n=0;
   for(let sy=y0;sy<y1;sy++)for(let sx=x0;sx<x1;sx++){
    const i=(sy*src.w+sx)*src.bpp;
    sum += src.bpp>=3 ? (src.data[i]*0.299+src.data[i+1]*0.587+src.data[i+2]*0.114) : src.data[i];
    n++;}
   let a=sum/n;
   a = Math.max(0, Math.min(255, Math.round((a-26)*1.35))); // odcięcie ciemnego tła znaku
   row[1+x*2]=255; row[2+x*2]=a;
  }
  rows.push(row);
 }
 const buf=png(TW,TH,4,Buffer.concat(rows));
 fs.writeFileSync('logo.b64.txt', buf.toString('base64'));
 console.log('logo:', src.w+'x'+src.h, '->', TW+'x'+TH, (buf.length/1024).toFixed(1),'KB ->', (buf.toString('base64').length/1024).toFixed(1),'KB b64');
}
