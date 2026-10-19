# Personal Website — [Your Name]

A minimal, professional personal site for a finance student, built to deploy on
GitHub Pages. Static HTML, one stylesheet, one small script. No build step, no
dependencies, no framework.

---

## Contents

1. [Technology choice](#1-technology-choice)
2. [Repository structure](#2-repository-structure)
3. [Local preview](#3-local-preview)
4. [Editing content](#4-editing-content)
5. [Adding a project](#5-adding-a-project)
6. [Deploying to GitHub Pages](#6-deploying-to-github-pages)
7. [Optional extras](#7-optional-extras)
8. [Assumptions made](#8-assumptions-made)
9. [Pre-launch checklist](#9-pre-launch-checklist)

---

## 1. Technology choice

| Choice | Reason |
| --- | --- |
| Plain HTML + CSS + vanilla JS | Instant deploys, nothing to break, editable in any text editor, fast on mobile networks. |
| No build step | GitHub Pages serves the files as-is. There is no toolchain to install, update, or debug. |
| No web fonts | System font stack (with Georgia for headings). No external requests, no font loading flash, no cookie/GDPR concern. |
| `data/projects.json` | One file to edit when adding a project to the list. Category filters are generated from it automatically. |
| No analytics by default | Deliberate. Add one later if you decide you need it (see [Optional extras](#7-optional-extras)). |

**When this is the wrong choice:** if you plan to publish dozens of long-form
articles, a static site generator (Jekyll or Astro) would serve you better. For
a portfolio plus occasional notes, plain static is simpler.

## 2. Repository structure

```
.
├── index.html                  Home / hero + introduction
├── about.html                  Education, interests, skills, coursework
├── cv.html                     Web CV + PDF download + print styles
├── projects.html               Project list (rendered from data/projects.json)
├── notes.html                  Notes stub — ready to grow later
├── contact.html                Email / LinkedIn / GitHub
├── 404.html                    Not-found page
├── robots.txt                  Crawler rules + sitemap pointer
├── sitemap.xml                 Page list for search engines
├── .nojekyll                   Tells GitHub Pages to serve files raw
│
├── assets/
│   ├── css/style.css           The whole design system + print styles
│   ├── js/main.js              Footer year + project list rendering
│   ├── img/favicon.svg         Placeholder logo (swap in your own)
│   └── cv/
│       ├── cv.pdf              ← REPLACE THIS with your real CV
│       └── README.md           Notes on the CV file
│
├── data/
│   ├── projects.json           ← THE FILE YOU EDIT to publish projects
│   └── projects.example.json   Reference copy showing every available field
│
├── projects/
│   └── template.html           ← DUPLICATE THIS for each project write-up
│
└── .github/workflows/pages.yml Optional Actions-based deploy (usually unneeded)
```

Every link in the site is **relative**, so the site works both at
`https://USERNAME.github.io/` and at `https://USERNAME.github.io/REPO/`
without any changes. Do not convert links to root-absolute form (starting
with `/`), or the project-repository deployment will break.

## 3. Local preview

Open `index.html` directly in a browser to check layout and text — that works
for everything except the project list, which loads JSON and therefore needs a
web server.

To run a local server (any one of these):

```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

Then open <http://localhost:8000> and check `projects.html` — it should show
the "Projects will be added soon." empty state while `data/projects.json` is
empty.

## 4. Editing content

### 4.1 Personal details

Every placeholder is wrapped in a highlighted span so it is visually obvious on
the page and easy to find in the code:

```html
<span class="ph">[Your Name]</span>
```

The fastest approach: open your editor and search across all files for `[`.
Replace every placeholder you find. The recurring ones are:

| Placeholder | Where it appears |
| --- | --- |
| `[Your Name]` | Page titles, header, footer, OG tags |
| `[your-email]` / `[your-email@example.com]` | Footer, contact page, CV |
| `[your-linkedin-url]` | Footer, contact page, CV |
| `[your-github-username]` | Footer, contact page, CV |
| `YOUR-USERNAME` / `REPO-NAME` | `robots.txt`, `sitemap.xml`, `<link rel="canonical">`, OG URLs |
| `[Degree programme]`, `[City]`, `[Languages]` | `index.html`, `about.html`, `cv.html` |

Headline and introduction text live at the top of `index.html` (the `<section
class="hero">` block) and in `about.html`.

### 4.2 Updating the CV

1. Export your CV as `cv.pdf` and overwrite `assets/cv/cv.pdf`. The download
   buttons on the CV and Contact pages already point at that exact path.
2. Update the web version in `cv.html`. Keep it in sync with the PDF —
   recruiters do check.
3. Update the "Last updated" field near the top of `cv.html`.
4. When you have real content, delete entire `<section class="cv-section">`
   blocks that you do not need (e.g. if you have no certifications yet). A
   shorter honest CV beats a padded one.

Printing `cv.html` produces a clean document: navigation, buttons, and footer
are hidden automatically by the print stylesheet in `style.css`. That is often
a better PDF than a manual export — use your browser's *Print → Save as PDF*.

### 4.3 Colour and typography

All design tokens sit at the top of `assets/css/style.css` under
`:root`. The palette is deliberately muted: off-white background (`--bg`),
navy headings (`--navy`), grey body text (`--muted`), and a single restrained
bronze accent (`--accent`) used for underlines and small labels.

## 5. Adding a project

Two files are involved: a **detail page** (the write-up) and a **JSON entry**
(the listing).

1. **Duplicate the template.**
   Copy `projects/template.html` to e.g.
   `projects/2027-03-company-x-valuation.html` — lowercase, hyphens only.

2. **Fill in the write-up.**
   The template has commented sections for: title, date, category, tags,
   summary, tools, links, problem statement, approach, key insights, outcome,
   what I learned, and an optional confidentiality note. Delete sections that
   do not apply. Remember to update the `<title>`, meta description, and
   canonical URL at the top of the file.

3. **Register it in `data/projects.json`.**
   Add an entry to the `projects` array (newest first):

   ```json
   {
     "title": "[Project title]",
     "slug": "[project-slug]",
     "date": "Mar 2027",
     "category": "Valuation",
     "tags": ["DCF", "Excel"],
     "summary": "[One-sentence summary.]",
     "url": "projects/2027-03-company-x-valuation.html",
     "links": {
       "pdf": "[link-to-pdf]",
       "repo": "[link-to-repo]"
     },
     "confidential": false
   }
   ```

   Field meanings are documented in `data/projects.example.json`. If you leave
   `url` empty, the title renders as plain text — useful for a project that is
   not written up yet.

4. **Categories.**
   Preferred values: `Financial Analysis`, `Stock Analysis`, `M&A`,
   `Valuation`, `Portfolio Analysis`, `Data Analysis`, `Fintech`, `Research`.
   Any string works; the filter buttons are generated from whatever you enter.

5. **Check it.**
   Run the local server and confirm the card appears on `projects.html`, the
   filter works, and the detail page opens with correct styling.

To feature a project on the home page, replace the notice block in the
"Selected work" section of `index.html` with the same kind of card markup used
in `projects/template.html`, or simply let the home page point at the projects
page as it does now.

## 6. Deploying to GitHub Pages

### Step 1 — create the repository

Push this folder to GitHub. Two options:

- **`USERNAME.github.io`** — the site will be at `https://USERNAME.github.io/`.
  Nothing to configure on paths.
- **Any other name** (recommended if this is one of several repos) — the site
  will be at `https://USERNAME.github.io/REPO-NAME/`. This is the case the
  project was built for; all links are relative and work as-is.

### Step 2 — publish

**Option A (simplest): deploy from a branch**

1. Repo **Settings → Pages**
2. *Source*: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → Save
4. Wait ~1 minute. The site appears at the URL shown on that page.

**Option B: GitHub Actions** (included at `.github/workflows/pages.yml`)

1. Repo **Settings → Pages** → *Source*: **GitHub Actions**
2. Commit and push to `main`. The workflow runs automatically.

You only need one of the two. If you use Option A, you can delete the
`.github/workflows/pages.yml` file.

### Step 3 — after going live

1. Visit the URL and click through every page and every download button.
2. Update `robots.txt` and `sitemap.xml` with the real URL, and each page's
   `<link rel="canonical">` and Open Graph URLs.
3. Optional: submit the sitemap at
   <https://search.google.com/search-console>.

### Custom domain (optional)

Buy a domain, then: **Settings → Pages → Custom domain** → enter it and follow
the DNS instructions. After it verifies, update the canonical/OG URLs,
`robots.txt`, and `sitemap.xml` to use your domain.

## 7. Optional extras

**Contact form.** Not included by design — the site has no backend, and a
`mailto:` button is more reliable and avoids spam and third-party data
handling. If you want a form later, use a static form service (e.g. Formspree):
add an HTML `<form>` pointing at their endpoint to `contact.html`. No server
code required.

**Analytics.** Not included. If you want it, a privacy-friendly option such as
Plausible or GoatCounter adds a single script tag — paste it before
`</body>` in each page. Avoid heavy tag managers.

**Dark mode.** Not included, to keep the site predictable for recruiters and
printing trivial. It can be added later with CSS variables and a toggle without
restructuring anything.

**OG share image.** The OG tags reference `assets/img/og-image.png`, which does
not exist yet. If you want link previews on LinkedIn to look sharp, add a
1200×630 PNG at that path. Otherwise the tags degrade gracefully.

**Notes section.** `notes.html` is a stub. When you have a real note, duplicate
`projects/template.html` into a `notes/` folder and list entries either in
`notes.html` directly or by extending `data/projects.json`.

## 8. Assumptions made

1. Deployed as a **project repository**, so all paths are relative. (Also works
   for a user site.)
2. **Light theme only** — chosen for simplicity and printing.
3. **No contact form** — mailto only.
4. **No analytics, no external fonts, no third-party scripts.**
5. The site is **English-language**.
6. Content you supply is **your own and verifiable**. The site contains no
   sample projects, invented experience, or fabricated financial analysis —
   every content field is an explicit placeholder.
7. "Year 2 Finance student at HKU" is taken as fact from your brief and used in
   the introduction and meta description. Adjust if inaccurate.
8. Placeholder topics on the Notes page and "Areas of interest" on the home
   page are *topic categories you named*, not claims of expertise. Edit them to
   match your genuine interests.
9. A minimal placeholder `assets/cv/cv.pdf` is included so the download button
   works before you upload your real CV.

## 9. Pre-launch checklist

Copy this list and tick through it before sharing the link.

**Content (the important part)**
- [ ] Real name replaces `[Your Name]` in every file (search across the repo)
- [ ] Real email, LinkedIn, GitHub URLs in footer, contact page, and CV
- [ ] Hero headline and introduction rewritten in your own words
- [ ] `about.html`: education details, interests, career focus filled in
- [ ] `cv.html`: all sections filled or deleted; "Last updated" set
- [ ] Real `cv.pdf` replaces the placeholder
- [ ] Skills and coursework reflect only what you can discuss in an interview
- [ ] At least one real project published via the template + JSON (optional but
      strongly recommended before applying)
- [ ] Every `.ph` placeholder removed — search the repo for `class="ph"`

**Technical**
- [ ] `YOUR-USERNAME` and `REPO-NAME` replaced in `robots.txt`, `sitemap.xml`,
      canonical and OG URLs
- [ ] Local preview checked on desktop and on a phone (or narrow browser window)
- [ ] Every nav link and the PDF download button tested on the live URL
- [ ] Print preview of `cv.html` checked (*Print → Preview*)
- [ ] Favicon replaced with your own initials or logo
- [ ] GitHub Pages enabled and the site loads at the expected URL

**Quality bar for anything you publish**
- [ ] No claims, numbers, or results you cannot stand behind in an interview
- [ ] Confidential work anonymised, with a confidentiality note where relevant
- [ ] Disclaimer present in the footer (already included)

---

## Accessibility & performance notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), a skip link, and
  labelled navigation sections.
- Visible focus outlines for keyboard users; filter buttons are real buttons
  with `aria-pressed` state.
- Text contrast meets WCAG AA against the off-white background.
- Honours `prefers-reduced-motion`; no animation is load-bearing.
- Responsive down to small screens; no horizontal scrolling.
- Total page weight is roughly one HTML file plus ~15 KB of CSS — no web fonts,
  no images beyond the favicon, no third-party requests.
- Works with JavaScript disabled, except the dynamic project list (a `<noscript>`
  fallback is included on that page).

## Questions this README assumes you will ask

**"Can I edit the site in a browser?"** Yes — GitHub's web editor is fine for
text changes. For the PDF and favicon you will need to upload files.

**"Do I need Node/npm?"** No. Never.

**"How do I roll back?"** Everything is in git. `git revert` the commit, or
restore a file from GitHub's history view.

**"It shows a 404 right after I push."** GitHub Pages takes up to a minute to
build, and the first deploy is slower. Check **Settings → Pages** for the live
URL and the Actions tab if you are using the workflow.
