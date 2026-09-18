# Portfolio site — working notes

Static site, no build step. Plain HTML + `styles.css` + `motion.js`.

## Animation
- Reference for anything animated: https://www.originkit.dev/templates — pull the idea from one of their components, re-implement it in dependency-free CSS/JS, and tune it to the dark-green editorial system. Never add a framework or npm dependency for motion.
- All motion lives in `motion.js` (JS) and the "Motion layer" block at the bottom of `styles.css` (CSS). `motion.html` demos every effect; update it when adding one.
- Every effect must honour `prefers-reduced-motion`, pause off-screen, and stay quiet on touch devices where it is cursor-driven.
- `index.html` is StatiCrypt-encrypted: CSS-only effects reach it, JS effects do not unless the source is re-encrypted with `motion.js` included.
