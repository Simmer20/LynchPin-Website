# LynchPin Advisory — Official Website

**Brand:** LynchPin Advisory  
**Tagline:** Connecting Strategic Partnerships Across Africa  
**Founder:** Hanisa Weru  
**Purpose:** Professional advisory firm website for LinkedIn profile link and client engagement

---

## ✅ Completed Features

- **Full single-page website** with dark navy/gold luxury brand aesthetic
- **Sticky navigation** with scroll-triggered transparency and mobile hamburger menu
- **Hero section** with animated Africa SVG map, network nodes, and stats
- **About section** with mission/vision cards and company pillars
- **Services section** — 6 core service cards (Green Energy, Partnerships, ESG, Tech, Gov/NGO, Women's Empowerment)
- **Impact section** — animated counters (18+ years, 30+ countries, $500M+, 200+ partnerships)
- **Team section** — Hanisa Weru profile with LinkedIn link and expertise tags
- **Insights section** — 4 thought leadership article previews
- **Contact form** — with backend table storage via RESTful API
- **Footer** with services, company links, and social links
- **Scroll animations** (fade-up) on all major elements
- **Responsive design** — optimized for desktop, tablet, and mobile
- **Google Fonts:** Cormorant Garamond (headings) + Inter (body)

---

## 🔗 Key URIs / Entry Points

| Path | Description |
|------|-------------|
| `/index.html` | Main landing page (root) |
| `#about` | About / company overview section |
| `#services` | 6 core service offerings |
| `#team` | Hanisa Weru team profile |
| `#insights` | Thought leadership articles |
| `#contact` | Contact form powered by `api/contact.php` |

---

## 📊 Data Model

### Contact Form Backend

The contact form posts to `api/contact.php`, a lightweight PHP endpoint that:

- validates required fields
- blocks simple bot submissions with a honeypot field
- stores leads in `data/contact_submissions.jsonl`
- can email a lead when `CONTACT_TO_EMAIL` is configured
- can forward leads to a CRM or automation tool when `CONTACT_WEBHOOK_URL` is configured

Good lightweight CRM destinations for the webhook are HubSpot Forms, Airtable, Google Sheets via Apps Script, Make, or Zapier.
This keeps the website form simple while still allowing a CRM handoff behind the scenes.

### Lead Record: `contact_submissions`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Auto-generated UUID |
| first_name | text | Visitor first name |
| last_name | text | Visitor last name |
| email | text | Visitor email |
| organization | text | Company/organization |
| interest | text | Service area of interest |
| message | rich_text | Full message |
| submitted_at | datetime | ISO timestamp |

---

## 🎨 Brand Guidelines Applied

- **Primary Navy:** `#0D1B2A` / `#17263A`
- **Gold Accent:** `#C8A46A` / `#E5C97C`
- **Background:** `#FDFAF4` (light cream) / `#0D1B2A` (dark sections)
- **Headings Font:** Cormorant Garamond (serif — premium feel)
- **Body Font:** Inter (clean, modern)
- **Logo:** LP monogram in double-line square frame

---

## 🔧 Recommended Next Steps

1. **Add professional photo** of Hanisa Weru to replace placeholder icon in team section
2. **Add real company email** — update `mailto:info@lynchpinadvisory.com` in footer and contact section
3. **Update LinkedIn URL** — confirm correct LinkedIn profile URL for Hanisa Weru
4. **Add case studies/portfolio** page with real project examples
5. **Blog/Insights page** — expand thought leadership content with full articles
6. **Google Analytics** integration for tracking LinkedIn click-through traffic
7. **Add company logo image** file to replace CSS-generated logo mark
8. **SEO optimization** — add Open Graph meta tags for LinkedIn link previews

---

## 📁 File Structure

```
index.html          — Main page
css/
  style.css         — All styles (3200+ lines, fully responsive)
js/
  main.js           — Animations, form, nav, scroll effects
README.md           — This file
```
