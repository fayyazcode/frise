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

Dodge the Rug is a fictional crypto arcade game. Runs have no time limit and use a taller playfield, with steadily increasing drop speed and spawn frequency: fries add 10 points, SOL adds 25, and each RUG hazard costs one of three lives. The game ends at zero lives. Heart pickups spawn on an independent randomized 15–30 second schedule during active play; catching one adds a life, including above the initial three. Hearts do not change points or combos. Every five consecutive catches boosts the multiplier up to 3×. A missed pickup or a rug resets the combo. Use arrows or A/D while focused, touch dragging, or hold the on-screen controls. Best scores are saved locally; scrolling or leaving the tab pauses the run. Click the arcade section to start or resume, or use the Pause/Resume button. A paused run only resumes through player input. Cash out points to end a run, or restart at any time. Decorative animations respect reduced-motion preferences. No live market data, wallet connection, or real rewards are involved.
