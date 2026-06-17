# Precision Components — Website

A clean, static rebuild of the Precision Components LLC website, hand-written in HTML, CSS, and vanilla JavaScript (no framework, no build step).

## Pages

| File | Page |
|------|------|
| `index.html` | Home — hero, services, process, clients, testimonials |
| `about.html` | About — story / philosophy / expertise |
| `cv.html` | Our story / philosophy / expertise (long form) |
| `assets.html` | Expert roster |
| `clients.html` | Client list by category |
| `contact.html` | Booking & partnership inquiries |

## Structure

```
.
├── index.html, about.html, cv.html, assets.html, clients.html, contact.html
├── css/styles.css     # design system + all page styles
├── js/main.js         # nav, tabs, accordion, testimonials slider
└── images/            # logos, portraits, client marks
```

## Design system

- **Colors:** espresso `#363026`, cream `#faf6f5`, olive `#598849`
- **Type:** Bebas Neue (display) + Roboto Mono (body), via Google Fonts

## Run locally

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000/
```

Any static host works (GitHub Pages, Netlify, etc.) — `index.html` is at the repo root.
