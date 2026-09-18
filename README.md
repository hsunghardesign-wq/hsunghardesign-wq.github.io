# Hamza Sunghar — Portfolio

A static portfolio site. No build step, no dependencies — plain HTML, CSS and a little JavaScript.

## Files

- `index.html` — homepage (hero, case study index, about, contact)
- `case-airwrap.html` — Airwrap Bluetooth Customisation
- `case-supersonic-r.html` — Supersonic r™ Campaign
- `case-ontrac.html` — OnTrac™ Customisation
- `case-diagnostic-tool.html` — Diagnostic Tool (Purifier)
- `styles.css` — shared design system for all pages (the motion layer's CSS lives at the bottom)
- `motion.js` — shared animation layer for the case-study pages (no dependencies)
- `motion.html` — Motion Lab: a demo page showing every animation, where it comes from, and how to apply it

## Preview locally

Just double-click `index.html` — it opens in your browser. Everything works from the file system.

## Deploy to GitHub Pages (free)

1. Create a GitHub account at github.com if you don't have one.
2. Click **+** (top right) → **New repository**. Name it `portfolio` (or `YOURUSERNAME.github.io` to get the cleanest URL). Keep it **Public**. Click **Create repository**.
3. On the new repo page, click **uploading an existing file**, drag all six files from this folder in, and click **Commit changes**.
4. Go to **Settings → Pages** (left sidebar).
5. Under **Build and deployment → Source**, choose **Deploy from a branch**. Set branch to `main` and folder to `/ (root)`. Click **Save**.
6. Wait 1–2 minutes. Your site is live at:
   - `https://YOURUSERNAME.github.io/portfolio/` — or
   - `https://YOURUSERNAME.github.io/` if you named the repo `YOURUSERNAME.github.io`

To update the site later, edit a file in the repo (or re-upload) and commit — it redeploys automatically.

## Motion

Animation reference for this site: **[originkit.dev](https://www.originkit.dev/templates)**. Anything animated should start from one of their components and be re-implemented here in plain CSS/JS (no build step, no dependencies), then tuned to the dark-green editorial system. Open `motion.html` to see every effect live.

| Effect (this site) | OriginKit reference | Where it runs by default |
|---|---|---|
| Word-level smoky reveal | Smoky Text | `h2` inside `.reveal`, `.sec-title` |
| Scramble decode on page titles | Scramble Text | `.cs-hero h1`, `.hero h1` |
| Twinkling grid backdrop with cursor halo | Blinking Squares | `.cs-hero`, `.hero` |
| Pixel-grid image reveal | Pixel Reveal | `.cs-cover`, `.full-img`, `.gallery img` |
| Cursor spotlight on cards | Spotlight Text | `.stat`, `.persona`, `.kqs-card`, `.cs-meta > div`, `.callout` |
| Direction-aware link hover | Direction Hover | nav + footer links |
| Variable-font weight follows cursor | Dynamic Weight | `.next-project h2` |
| Press tilt on covers | Blur Carousel | `.cs-cover`, `.full-img` |
| Text sheen on kickers, button sheen | Shiny Pill | `.kicker`, `.sec-kicker`, `.btn`, `.btn-ghost`, `.nav-cta` |
| Magnetic buttons, count-up stats, aurora drift | — | `.btn*`, `.stat b`, every page |

Rules the layer follows:

- Opt in on any element with `data-motion="name name…"` (names: `words scramble grid pixel spot dh weight tilt magnetic count`). Opt out of a whole subtree with `data-motion="off"`.
- `prefers-reduced-motion` gets the final state of everything instantly. Touch devices skip cursor-driven effects.
- Canvases pause off-screen and in hidden tabs, and cap at 1.5× device pixel ratio.
- The Noto Sans link on each page requests the variable range `wght@400..900` so the weight effect has something to morph.

**Homepage note.** `index.html` is StatiCrypt-encrypted, so only the CSS-only effects (sheens, aurora, scroll-hint pulse, tile hover) reach it automatically. To get the JS effects there too, add `<script src="motion.js" defer></script>` before `</body>` in the homepage source and re-encrypt it.

## Custom domain (optional)

Buy a domain (e.g. hamzasunghar.com), then in **Settings → Pages → Custom domain** enter it and follow GitHub's DNS instructions (add a CNAME record at your registrar pointing to `YOURUSERNAME.github.io`).

## Notes

- Images and the campaign video are currently loaded from Framer's CDN (`framerusercontent.com`), where your existing site hosts them. This works fine, but if you ever delete the Framer site, download the images first and put them in an `images/` folder, then update the `src` paths.
- Colours, fonts and spacing all live in the `:root` block at the top of `styles.css` — change `--accent` there to re-theme the whole site.
