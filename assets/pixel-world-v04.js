/* Pixel Task Hero v0.4 — original procedurally-drawn pixel world.
   No remote assets; save data untouched. */
(()=>{
'use strict';
const W=320,H=160;
function block(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)}
function poly(c,points,col){c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
function generate(biome){
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;
 const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 const palette=[
  {sky:'#7fc9de',far:'#779da2',mid:'#537e81',ground:'#507d4b',dirt:'#674d38',leaf:'#36835e',shine:'#d4edbd'},
  {sky:'#334f69',far:'#365d65',mid:'#274c48',ground:'#30533f',dirt:'#514439',leaf:'#24573d',shine:'#91c7a9'},
  {sky:'#242a49',far:'#343352',mid:'#464361',ground:'#544766',dirt:'#302c3c',leaf:'#7462a2',shine:'#ceb6ef'}
 ][biome];block(c,0,0,W,H,palette.sky);
 // Pixelated layered mountain ridges
 for(let layer=0;layer<2;layer++){let points=[[0,H]];for(let x=0;x<=W+24;x+=16){const ridge=42+layer*26+Math.round(12*Math.sin(x*.045+layer*2)+8*Math.sin(x*.12+layer));points.push([x,ridge])}points.push([W,H]);poly(c,points,layer?palette.mid:palette.far)}
 // Tiled ground with continuous upper platform
 block(c,0,119,W,41,palette.dirt);block(c,0,115,W,6,palette.ground);
 for(let x=0;x<W;x+=8){block(c,x,120+(x*7%13),5,2,x%3===0?palette.ground:'#80664d');block(c,x,147+(x*11%9),3,2,'#9b7950')}
 for(let k=0;k<29;k++){let x=(k*47)%W;let y=112+(k*7%5);block(c,x,y,2,6,palette.leaf);block(c,x-2,y+2,6,2,palette.shine)}
 // Props in the scene - layered hand-placed pixel clusters
 for(let k=0;k<6;k++){let x=8+k*57+(k%2)*9, y=105-(k%3)*9;
  if(biome===2){block(c,x,y-17,5,26,'#1c1c32');block(c,x-6,y-19,17,4,'#8270ad');block(c,x-2,y-26,8,6,palette.shine);block(c,x,y-13,4,12,'#7c679d')}
  else{block(c,x,y-20,5,25,'#584a3d');for(let j=0;j<3;j++){block(c,x-9+j*3,y-24-j*3,20-j*5,11,palette.leaf);block(c,x-5+j*4,y-22-j*3,5,3,palette.shine)}}}
 // Stars, motes, and flora
 for(let i=0;i<25;i++){let x=(i*97+17)%W,y=(i*41+13)%95;block(c,x,y,i%4===0?2:1,1,i%3===0?palette.shine:'#ffffff77')}
 return cv.toDataURL('image/png');
}
const generated=[0,1,2].map(generate);
let current=-1;
function update(){const field=document.getElementById('field');if(!field)return;const type=field.classList.contains('env-dungeon')?2:field.classList.contains('env-forest')?1:0;
 if(type!==current){current=type;field.style.backgroundImage='url("'+generated[type]+'")';field.style.backgroundSize='100% 100%';field.style.backgroundRepeat='no-repeat';}
 const mountains=field.querySelectorAll('.mountain');mountains.forEach(el=>el.style.display='none');
}
function monster(kind,boss){
 const c=document.createElement('canvas');c.width=48;c.height=48;const p=c.getContext('2d');p.imageSmoothingEnabled=false;
 const colors=[['#2e6b57','#73deb5','#cdfbea'],['#365d77','#91d3ec','#e6fbff'],['#4c3b69','#b495e6','#ead8ff']][kind];
 // Outline, body and highlights are pixel-block primitives rather than emoji.
 if(kind===0){block(p,9,21,30,20,'#192d39');block(p,12,15,24,25,colors[0]);block(p,15,11,18,9,colors[1]);block(p,16,17,5,6,colors[2]);block(p,28,17,5,6,colors[2])}
 if(kind===1){block(p,9,11,30,32,'#182d3e');block(p,12,16,24,21,colors[0]);block(p,16,7,7,13,colors[1]);block(p,28,7,7,13,colors[1]);block(p,18,23,12,9,colors[1])}
 if(kind===2){block(p,13,10,22,32,'#1b2035');block(p,17,13,14,22,colors[0]);block(p,11,8,26,6,colors[1]);block(p,19,25,10,7,colors[2]);block(p,8,35,32,7,colors[1])}
 block(p,19,22,4,4,'#ffffff');block(p,28,22,4,4,'#ffffff');block(p,21,24,2,2,'#142632');block(p,30,24,2,2,'#142632');
 if(boss){block(p,14,2,20,5,'#ffcf69');block(p,15,0,4,6,'#f9eaad');block(p,29,0,4,6,'#f9eaad')}
 return c.toDataURL('image/png');
}
const sprites=[0,1,2].map(i=>[false,true].map(boss=>monster(i,boss)));
function updateMonster(){const el=document.getElementById('enemysprite'),field=document.getElementById('field');if(!el||!field)return;
 const theme=field.classList.contains('env-dungeon')?2:field.classList.contains('env-forest')?1:0;
 const boss=!!field.classList.contains('mvp-active');
 const url=sprites[theme][boss?1:0];
 if(el.dataset.worldSprite===url)return;
 el.dataset.worldSprite=url;
 el.textContent='';
 el.style.width=boss?'112px':'92px';el.style.height=boss?'112px':'92px';
 el.style.background='url("'+url+'") center/contain no-repeat';
 el.style.imageRendering='pixelated';
}
function loop(){update();updateMonster();requestAnimationFrame(loop)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loop,{once:true});else loop();
})();
