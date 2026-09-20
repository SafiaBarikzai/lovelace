# BCSWomen Lovelace Colloquium — site

Static site for the BCSWomen Lovelace Colloquium. Plain HTML and CSS, no build step.

## Layout

```
index.html          Homepage (self-contained: styles and countdown script are inline)
2027/index.html     This year's event
students/index.html For students
academics/index.html For lecturers and departments
sponsor/index.html  For companies and donors
assets/site.css     Shared styles for the four sub-pages
assets/site.js      Shared countdown script
```

## Running it locally

The pages use relative links, so opening `index.html` straight from the file
system mostly works, but serving the folder matches how GitHub Pages behaves:

```
python3 -m http.server 8000
```

Then visit <http://localhost:8000/>.

## Deployment

Pushing to `main` runs `.github/workflows/deploy-pages.yml`,
which uploads the repository as-is and publishes it to GitHub Pages at
<https://safiabarikzai.github.io/lovelace/>.

Because the site is served from the `/lovelace/` sub-path rather than a domain
root, internal links must stay relative (`2027/`, `../students/`) — a leading
slash such as `/students/` would resolve to the wrong place.

`.nojekyll` tells Pages to publish the files unchanged instead of running them
through Jekyll.

## The splash screen

The site sits behind a shared username and password (`assets/gate.js`, loaded
from the `<head>` of every page). A `noindex` tag on each page and a
`robots.txt` that disallows everything keep the draft out of search results.

**This is a "do not disturb" sign, not a lock.** GitHub Pages serves static
files with no server behind them, so the check runs in the visitor's own
browser and they control it completely:

- The password hash is in `assets/gate.js`, which anyone can open. A short
  password falls to an offline dictionary attack in seconds.
- Turning JavaScript off skips the gate.
- The HTML reaches the browser before the gate runs. It hides the page, it
  does not withhold it.
- The repository is public, so the content is readable on GitHub anyway.

It is there to stop passers-by and search engines landing on an unfinished
site. Nothing confidential should go on these pages. If that changes, the
site needs hosting that can authenticate server-side — Cloudflare Access and
Netlify's password protection both do this properly.

The unlock is kept in `sessionStorage`, so closing the browser re-arms the
gate rather than leaving a shared machine open.

### Changing the credentials

Generate a new hash and paste it into `CREDENTIAL_HASH` in `assets/gate.js`:

```
python3 -c "import hashlib;print(hashlib.sha256('username:password'.encode()).hexdigest())"
```

The string hashed is the username and password joined by a single colon.

### Removing it for launch

Delete `assets/gate.js`, drop the `<script src=".../assets/gate.js">` line and
the `noindex` meta tag from all five pages, and replace `robots.txt` with one
that allows crawling.
