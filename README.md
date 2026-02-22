# Terique Greenfield Composer Website

Responsive multi-page portfolio site designed for GitHub Pages + Cloudflare.

## Pages
- `index.html` - Home with animated hero text, floating notes, and SVG motion graphic
- `about.html` - About and creative direction
- `listen.html` - SoundCloud embed + YouTube section
- `placements.html` - Slowly moving left-to-right placements carousel
- `contact.html` - Contact form UI
- `contact.php` - Optional PHP mail handler for PHP-capable hosting

## Add Your Home Backdrop
1. Place your provided home image at: `assets/images/home-backdrop.jpg`
2. Keep that filename to avoid changing CSS.

## Add Your Placement Images
1. Put new image files inside `assets/placements/`
2. Edit the `placementItems` array in `assets/js/main.js`
3. Update each item's `title`, `outlet`, and `image` path

## Set Contact Email
1. In `contact.html`, update `data-recipient="your@email.com"`
2. In `contact.php`, update `$to = 'your@email.com';`
3. In `contact.php`, update `From: no-reply@yourdomain.com` to your domain email

## Preview Locally on Mac
Run from this project folder:

```bash
cd /Users/terique/Documents/terique-composer-site
python3 -m http.server 8080
```

Then open:
- `http://localhost:8080`

## Publish to GitHub Pages
1. Create a GitHub repo and push this folder contents
2. In repo settings, open **Pages**
3. Set source to `Deploy from a branch`
4. Select branch `main` and folder `/ (root)`
5. Save and wait for publish

## Connect Cloudflare
1. In GitHub Pages, set custom domain (for example `www.yourdomain.com`)
2. In Cloudflare DNS, add `CNAME`:
   - `www` -> `<your-github-username>.github.io`
3. Optional redirect root domain to `www` using Cloudflare redirect rules
4. Keep Cloudflare SSL mode at `Full` or `Full (strict)` once certs are active

## Important Hosting Note
GitHub Pages does not run PHP. On GitHub Pages, the Contact form opens your email app (mailto fallback).
If you move to a PHP-capable host later, `contact.php` will process form submissions server-side.
