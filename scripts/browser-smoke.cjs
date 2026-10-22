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
   await page.locator('#bossbtn').click();
   await page.waitForTimeout(120);
   assert.ok(await page.locator('#field').evaluate(el=>el.classList.contains('mvp-active')),'Boss visual missing');
   assert.ok(await page.evaluate(()=>!!localStorage.getItem('pixel_task_hero_v1')||!!document.querySelector('#fighter')),'Save environment missing');
   await page.screenshot({path:'qa-beta04.png',fullPage:true});
   assert.deepEqual(errors,[],'Browser JavaScript errors');
   console.log('PASS browser smoke: hero, 3 classes, boss, canvas and no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
