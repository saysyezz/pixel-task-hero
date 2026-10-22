'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const file = 'index.html';
let html = fs.readFileSync(file,'utf8');
assert.ok(html.length > 10000, 'Game HTML missing or truncated');
assert.ok(html.includes('id="fighter"') && html.includes('id="avatar"'),'Missing hero UI');
assert.ok(html.includes('function updateHeroVisual(t){if(!state)return;'),'Unsupported game source: updateHeroVisual not found');
if (html.includes('assets/hero-visuals-v04.css')) {
  console.log('Hero visual upgrade already applied');
  process.exit(0);
}
assert.ok(html.includes('</style></head>'),'Expected inline stylesheet not found');
html=html.replace('</style></head>','</style><link rel="stylesheet" href="assets/hero-visuals-v04.css"></head>');
assert.ok(html.includes('class="fighter"'),'Hero stage wrapper not found');
html=html.replace('class="fighter"','class="fighter hero-pixel-stage hero-warrior pose-idle"');
assert.ok(html.includes('class="avatar-wrap"'),'Avatar wrapper not found');
html=html.replace('class="avatar-wrap"','class="avatar-wrap hero-pixel-stage hero-warrior"');
html=html.replace('function updateHeroVisual(t){if(!state)return;',`function updateHeroVisual(t){if(!state)return;
const fighterStage=document.querySelector('.fighter.hero-pixel-stage');
const avatarStage=document.querySelector('.avatar-wrap.hero-pixel-stage');
const classStyle='hero-'+state.class;
const poseStyle=(t<heroPoseUntil ? heroPose : (paused ? 'idle' : 'walk'));
for (const el of [fighterStage,avatarStage]) { if (!el) continue;
  el.classList.remove('hero-warrior','hero-archer','hero-mage'); el.classList.add(classStyle);
}
if(fighterStage) { fighterStage.classList.remove('pose-idle','pose-walk','pose-attack','pose-skill','pose-hit','pose-victory'); fighterStage.classList.add('pose-'+poseStyle); }`);
fs.writeFileSync(file,html);
console.log('Applied anime pixel visual themes for warrior, archer, mage.');
