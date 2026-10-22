# Pixel Task Hero Beta 0.4 — Release Candidate QA

**Status: NOT APPROVED FOR MAIN.** This is the development preview, not a public release.

## Changes covered
- Original procedural pixel scenes for meadow, forest and dungeon, rendered at 320×160 and scaled with pixelated edges
- Pixel-drawn monster silhouettes matching the three scene biomes, with extra boss crown
- Existing combat state animations, class skill effects, boss overlays, inventory rarity and refreshed UI
- Existing game state and localStorage save key retained

## Automated checks
The `Check game` workflow runs `node check-game.js` for game structure, inline/external JavaScript syntax, save references and critical UI hooks.
The Preview workflow checks the remote CDN response. Those HTTP tests may be affected by CDN caching.

## Manual QA gate — required before merge
- [ ] Open pinned-commit preview and confirm **all three** worlds have real pixel scenery
- [ ] Switch warrior, archer and mage; sprite visible and ground aligned
- [ ] Fight 2 minutes; observe auto battle, HP and XP updates, attack/skill effects
- [ ] Summon boss; confirm banner, fight, rewards and return to normal encounter
- [ ] Test inventory, equipment, enhancement and tooltips
- [ ] Export backup, refresh, import and compare saved state; preserve prior Beta 0.3 saves
- [ ] Check phone viewport and desktop, monitor browser console and animation performance
- [ ] Review overall art consistency; improve anything still looking like a placeholder

Do not merge `ai-development` into `main` until checks complete and user approves.
