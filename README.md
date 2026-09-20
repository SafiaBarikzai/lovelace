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

Pushing to the deployment branch runs `.github/workflows/deploy-pages.yml`,
which uploads the repository as-is and publishes it to GitHub Pages at
<https://safiabarikzai.github.io/lovelace/>.

Because the site is served from the `/lovelace/` sub-path rather than a domain
root, internal links must stay relative (`2027/`, `../students/`) — a leading
slash such as `/students/` would resolve to the wrong place.

`.nojekyll` tells Pages to publish the files unchanged instead of running them
through Jekyll.
