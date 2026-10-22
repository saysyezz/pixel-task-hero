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
let current=-1;let lastMonsterKey='';
function update(){const field=document.getElementById('field');if(!field)return;const type=field.classList.contains('env-dungeon')?2:field.classList.contains('env-forest')?1:0;
 if(type!==current){current=type;field.style.backgroundImage='url("'+generated[type]+'")';field.style.backgroundSize='100% 100%';field.style.backgroundRepeat='no-repeat';}
 const mountains=field.querySelectorAll('.mountain');mountains.forEach(el=>el.style.display='none');field.querySelectorAll('.bg-layer').forEach(el=>el.style.display='none');
}
// Monster families: meadow slime, horned hare, boar; forest mushroom, treant, wisp; dungeon skull, crystal golem, void eye.
function monster(biome,variant,boss){
 const cv=document.createElement('canvas');cv.width=64;cv.height=64;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 const p=[['#163e40','#49b999','#b8fbd8'],['#272f44','#6a9e79','#d0f5ac'],['#241e42','#8e77bd','#f4b9f9']][biome];
 function b(x,y,w,h,color){block(c,x,y,w,h,color)}
 function eye(x,y){b(x,y,6,7,'#182334');b(x+1,y+1,3,3,'#fffcef')}
 if(variant===0){ // soft rounded creature / spectral slime
 b(12,35,40,17,p[0]);b(17,23,30,29,p[1]);b(23,16,18,8,p[2]);b(11,46,43,6,p[0]);eye(22,34);eye(36,34);
 b(27,45,10,3,p[0]);b(18,25,5,7,p[2]);
 }else if(variant===1){ // big ears, arms and fantasy animal body
 b(12,41,40,12,p[0]);b(18,25,29,24,p[1]);b(20,8,8,24,p[0]);b(21,10,5,20,p[2]);b(39,6,8,26,p[0]);b(40,9,5,20,p[2]);
 b(9,37,11,9,p[1]);b(44,37,12,9,p[1]);eye(24,32);eye(38,32);b(30,41,5,3,'#ffb7aa');
 }else{ // armored creature with angular silhouette
 b(16,20,32,35,p[0]);b(21,16,22,32,p[1]);b(11,29,13,17,p[0]);b(40,29,13,17,p[0]);b(17,49,10,10,p[0]);b(37,49,10,10,p[0]);
 b(26,21,13,8,p[2]);eye(24,32);eye(38,32);b(30,44,5,5,p[2]);
 }
 // Biome-specific silhouette details
 if(biome===1){b(12,14,12,7,'#b7d8a3');b(40,13,11,7,'#b7d8a3');b(19,10,27,7,'#526b4d')}
 if(biome===2){b(23,12,5,7,'#b59cfa');b(37,11,5,9,'#b59cfa');b(28,41,9,4,'#a38bde')}
 if(boss){b(12,4,40,7,'#6e492f');b(16,0,8,12,'#ffc76b');b(29,2,8,9,'#ffeaa0');b(43,0,7,12,'#ffc76b');b(9,17,5,27,'#ffcc7488');b(50,17,5,27,'#ffcc7488')}
 return cv.toDataURL('image/png');
}
const sprites=[0,1,2].map(biome=>[0,1,2].map(variant=>[false,true].map(boss=>monster(biome,variant,boss))));
let lastMonsterKey='';
function updateMonster(){
 const el=document.getElementById('enemysprite'),field=document.getElementById('field'),label=document.getElementById('enemyname');
 if(!el||!field||!label)return;
 const biome=field.classList.contains('env-dungeon')?2:field.classList.contains('env-forest')?1:0;
 const boss=field.classList.contains('mvp-active');
 const name=label.textContent.split(' · HP')[0].replace(/^👑 /,'');
 let hash=0;for(let i=0;i<name.length;i++)hash=(hash*31+name.charCodeAt(i))>>>0;
 const variant=hash%3,key=biome+':'+variant+':'+boss+':'+name;
 if(lastMonsterKey===key && !el.textContent.trim())return;
 lastMonsterKey=key;el.textContent='';
 el.style.background='url("'+sprites[biome][variant][boss?1:0]+'") center/contain no-repeat';
 el.style.imageRendering='pixelated';
 el.style.width=boss?'132px':'99px';el.style.height=boss?'132px':'99px';
 el.style.transformOrigin='50% 90%';
}
function loop(){update();updateMonster();requestAnimationFrame(loop)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loop,{once:true});else loop();
})();
