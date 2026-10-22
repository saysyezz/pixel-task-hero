const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
   await page.goto('file://'+path.resolve('index.html'),{waitUntil:'load'});
   await page.waitForTimeout(1200);
   assert.equal(await page.locator('#fighter').count(),1);
   assert.equal(await page.locator('#enemysprite').count(),1);
   assert.equal(await page.locator('#field').count(),1);
   assert.ok(await page.locator('#fighter').evaluate(el=>el.getBoundingClientRect().height>0),'Hero invisible');
   const field=await page.locator('#field').boundingBox();
   const hero=await page.locator('.fighter').boundingBox();
   assert.ok(hero.y>field.y && hero.y<field.y+field.height,'Hero not inside battlefield');
   for(const cls of ['warrior','archer','mage']){
     await page.locator('#classpick').selectOption(cls);
     await page.waitForTimeout(200);
     assert.ok(await page.locator('.fighter').evaluate((el,cls)=>el.classList.contains('hero-'+cls),cls),'Class visual not updated: '+cls);
   }
   // Exercise biome rendering rather than checking that CSS strings merely exist.
   for(const [stage,theme] of [[1,'env-meadow'],[6,'env-forest'],[11,'env-dungeon']]){
     await page.evaluate(stage=>{state.stage=stage;state.unlocked=Math.max(state.unlocked,stage);render();},stage);
     await page.waitForFunction(theme=>document.getElementById('field').classList.contains(theme),theme);
     await page.waitForFunction(()=>document.getElementById('field').style.backgroundImage.startsWith('url("data:image/png'),null,{timeout:5000});
     const sprite=await page.locator('#enemysprite').evaluate(el=>getComputedStyle(el).backgroundImage);
     assert.ok(sprite.includes('data:image/png'), 'Monster pixel sprite absent at stage '+stage);
     await page.screenshot({path:'qa-stage-'+stage+'.png'});
   }
   // Verify existing localStorage save format survives a browser reload.
   await page.evaluate(()=>{state.stage=6;state.gold=12345;save();});
   await page.reload({waitUntil:'load'});
   await page.waitForTimeout(400);
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('pixel_task_hero_v1')));
   assert.equal(stored.stage,6,'Stage lost across reload');
   assert.equal(stored.gold,12345,'Gold lost across reload');
   await page.locator('#bossbtn').click();
   await page.waitForTimeout(120);
   assert.ok(await page.locator('#field').evaluate(el=>el.classList.contains('mvp-active')),'Boss visual missing');
   assert.ok(await page.evaluate(()=>!!localStorage.getItem('pixel_task_hero_v1')),'Save data not persisted');
   await page.screenshot({path:'qa-beta04.png',fullPage:true});
   assert.deepEqual(errors,[],'Browser JavaScript errors');
   console.log('PASS browser smoke: hero, 3 classes, boss, canvas and no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
