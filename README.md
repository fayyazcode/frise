# FRISE

A responsive fries-themed memecoin landing page, built with Vite and vanilla HTML, CSS, and JavaScript. Includes an original generated mascot, locally bundled fonts, contract copying, and Jupiter / Dexscreener links.

## Develop

Use Node.js 22 or newer. In this checkout:

```sh
npm ci --cache /tmp/frise-npm-cache
npm run dev -- --port 5173
```

## Production

```sh
npm run build
npm run preview -- --port 4173
```

Deploy the generated `dist/` directory to a static host. No secrets or backend services are required. The contract is configured in `main.js` and displayed in `index.html`; update both together. Trading links use the supplied contract; token liquidity and availability are not asserted by this site.

## Arcade

Dodge the Rug is a fictional crypto arcade game. Rounds last 30 seconds: fries add 10 points, SOL adds 25, and RUG hazards subtract 30. Every five consecutive catches boosts the multiplier up to 3×. A missed pickup or a rug resets the combo. Use arrows or A/D while focused, touch dragging, or hold the on-screen controls. Best scores are saved locally; leaving the tab ends the round. Decorative animations respect reduced-motion preferences. No live market data, wallet connection, or real rewards are involved.
