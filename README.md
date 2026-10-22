# Pixel Task Hero

Single-player browser idle RPG. Start by opening `index.html` in Chrome or Edge.

## Automated check

Every push and pull request runs `node scripts/check-game.js` through GitHub Actions. The check validates HTML markers and JavaScript syntax; it does not play the game, validate graphics, guarantee bug freedom, or publish a site.

## Release safety

Keep the repository private while developing. Export your in-game save before moving between `file://` and a hosted URL: browser localStorage is scoped per origin, so saves will not move automatically. Do not upload personal tokens, passwords, or secret configuration.

For GitHub Pages on a Free plan, public repo is generally needed, and the published website is public. Switch only when comfortable sharing the game code.
