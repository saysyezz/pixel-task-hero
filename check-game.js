'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
assert.ok(Buffer.byteLength(html, 'utf8') > 10_000, 'index.html is missing or too small to contain the game');
assert.match(html, /<!doctype html>/i, 'Missing HTML doctype');
assert.match(html, /<\/html\s*>/i, 'HTML document appears incomplete');
assert.match(html, /PIXEL TASK HERO/i, 'Game title missing');

for (const name of ['warrior', 'archer', 'mage']) {
  assert.ok(html.includes(name), 'Missing character class: ' + name);
}
for (const id of ['fighter','avatar','bossbtn','classpick','rightcontent','hpbar','enemybar','savefile']) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing required UI element: ' + id);
}
for (const id of ['bossbtn','classpick','fighter','avatar']) {
  const found = [...html.matchAll(new RegExp('\\bid="' + id + '"', 'g'))];
  assert.equal(found.length, 1, 'UI element must have one unique ID: ' + id);
}
assert.ok(html.includes('localStorage'), 'Save-game storage missing');
assert.ok(html.includes('requestAnimationFrame'), 'Main animation/game loop missing');
assert.ok(html.includes('bossbtn'), 'MVP boss control missing');
assert.ok(/forge|upgrade|ตีบวก/i.test(html), 'Equipment enhancement system missing');
assert.ok(/export|savefile/i.test(html), 'Save export/import system missing');
assert.ok(/<img\b/i.test(html), 'Pixel-art character image element missing');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1]).filter(Boolean);
assert.ok(scripts.length, 'No inline JavaScript found');
scripts.forEach((source, i) => new vm.Script(source, { filename: 'game-inline-' + i + '.js' }));

for (const marker of ['stage-v04-inline','stage-theme-indicator','updateStageEnvironment()',
                       'env-forest','env-dungeon','spawnHeroVfx(action)',
                       'monster-v04-styles','monsterPose(type)','monster-attack']) {
  assert.ok(html.includes(marker), 'Missing v0.4 visual/game integration: ' + marker);
}
assert.ok(html.includes("localStorage.setItem(KEY,JSON.stringify(state))"), 'Save implementation changed');
assert.ok(html.includes('localStorage.getItem(KEY)'), 'Save loader changed');
assert.ok(html.includes('id="field"'), 'Battlefield missing');


assert.ok(html.includes('assets/pixel-world-v04.js'), 'Pixel-world scene renderer not connected');
const pixelWorld = fs.readFileSync('assets/pixel-world-v04.js','utf8');
new vm.Script(pixelWorld,{filename:'assets/pixel-world-v04.js'});
for(const marker of ['generate(biome)','monster(kind,boss)','requestAnimationFrame(loop)','imageRendering']) assert.ok(pixelWorld.includes(marker),'Missing pixel world feature: '+marker);


assert.ok(html.includes('id="sellCommon"'),'Bulk common-item sell control missing');
assert.ok(html.includes("it.rarity!=='common'"),'Rare-item protection missing');
assert.ok(html.includes("Object.values(state.equip).includes(it.id)"),'Equipped-item protection missing');
assert.ok(html.includes('identity-v04'),'Hero identity stylesheet missing');
assert.ok(pixelWorld.includes('monster(biome,variant,boss)'),'Monster family silhouettes missing');

for (const marker of ['signature-skills-v04','CROSS SLASH','BLADE STORM','AZURE FINISHER','TRIPLE SHOT','PIERCING ARROW','ARROW RAIN','RUNE BURST','STARFALL NOVA','ARCANE ORB']) assert.ok(html.includes(marker),'Signature effect missing: '+marker);
console.log('PASS: file completeness, UI, classes, animation, gameplay references, save system, JS syntax');
console.log('NOTE: This does not replace interactive browser gameplay and visual regression testing.');
