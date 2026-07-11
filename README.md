# Hamza Sunghar — Portfolio

A static portfolio site. No build step, no dependencies — plain HTML, CSS and a little JavaScript.

## Files

- `index.html` — homepage (hero, case study index, about, contact)
- `case-airwrap.html` — Airwrap Bluetooth Customisation
- `case-supersonic-r.html` — Supersonic r™ Campaign
- `case-ontrac.html` — OnTrac™ Customisation
- `case-diagnostic-tool.html` — Diagnostic Tool (Purifier)
- `styles.css` — shared design system for all pages

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

## Custom domain (optional)

Buy a domain (e.g. hamzasunghar.com), then in **Settings → Pages → Custom domain** enter it and follow GitHub's DNS instructions (add a CNAME record at your registrar pointing to `YOURUSERNAME.github.io`).

## Notes

- Images and the campaign video are currently loaded from Framer's CDN (`framerusercontent.com`), where your existing site hosts them. This works fine, but if you ever delete the Framer site, download the images first and put them in an `images/` folder, then update the `src` paths.
- Colours, fonts and spacing all live in the `:root` block at the top of `styles.css` — change `--accent` there to re-theme the whole site.
