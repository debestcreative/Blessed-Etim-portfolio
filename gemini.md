# System Instructions: Personal Website — Blessed Anthony Etim

## Project Overview

Build a **clean, modern, and professional personal website** for **Blessed Anthony Etim**, 
a law student specializing in **Data Privacy & Regulatory Compliance**, **Cybercrime**, 
**Blockchain**, and **AI Governance**. This website serves as his **personal brand platform** 
where he publishes articles, shares research, and positions himself as a credible emerging 
voice in technology law.

---

## Site Goal

To establish **Blessed Anthony Etim** as a knowledgeable and forward-thinking legal mind 
at the intersection of **law and technology**. The website should feel **authoritative, 
intelligent, and polished** — the digital home of a serious legal professional in the making.

---

## Pages & Structure

### 1. Home Page

- Full-screen **hero section** with name: **Blessed Anthony Etim**
- Subtitle: **"Law Student | Data Privacy · Cybercrime · Blockchain · AI Governance"**
- A **2–3 line positioning statement**: who he is, what he focuses on, and why it matters
- Two CTA buttons: **"Read My Articles"** and **"Get In Touch"**
- **"Areas of Focus"** section — four cards with icons representing each specialization with a one-line description each
- **"Latest Articles"** preview section showing the 3 most recent article cards
- **Newsletter signup strip**: *"Get insights on technology law delivered to your inbox"* with an email input and subscribe button

---

### 2. About Page

- Professional **photo placeholder** (circular or squared with rounded corners)
- A personal **bio** covering academic background, what drives his interest in tech law, and his career vision
- A **"What I Focus On"** section breaking down each of the 4 specializations with a short paragraph each
- A **"Download CV"** button

---

### 3. Articles / Blog Page

- Clean **card-based layout** listing all articles
- Each card shows: **article title**, **category tag**, **publication date**, **short excerpt**, and a **"Read More"** link
- **Category filter tabs** at the top: All | Data Privacy | Cybercrime | Blockchain | AI Governance
- Individual article pages with:
  - Clean reading layout
  - Article title
  - Author name
  - Date
  - Estimated read time
  - Article body
  - Social share buttons: **Twitter/X**, **LinkedIn**, **Copy Link**

---

### 4. Research & Writing Page

- A structured **card or list grid** of formal academic papers, essays, and seminar submissions
- Each entry contains:
  - Title
  - Short abstract
  - Date
  - **"View"** or **"Download"** button
- Section intro line: *"A collection of academic work exploring the legal frontiers of technology, privacy, and digital governance"*

---

### 5. Resources Page

- A curated **reference library** of legislation, frameworks, treaties, and policy documents
- Organized into four categories:
  - **Data Privacy Laws**
  - **Cybercrime Frameworks**
  - **Blockchain Regulations**
  - **AI Policy Documents**
- Each resource entry has: title, a one-line description, and an **external link button**
- Section intro: *"A curated reference library for researchers, students, and practitioners in technology law"*

---

### 6. Contact Page

- Minimal **contact form** with fields:
  - Full Name
  - Email Address
  - Subject
  - Message
  - **"Send Message"** button
- Below the form: **email address**, **LinkedIn URL**, and **Twitter/X handle** displayed as clickable links

---

## Global Features

- **Sticky top navigation bar** with logo (name as wordmark) and links to all pages
- **Active link state** on navigation to show current page
- **Footer** with: navigation links, social media icons, newsletter signup, and copyright line
  - *"© 2025 Blessed Anthony Etim. All rights reserved."*
- **Dark mode toggle** in the navigation bar
- **Smooth scroll** behavior across all pages
- **Back to top button** on all long pages
- **Fully responsive** across desktop, tablet, and mobile
- **SEO-ready**: unique meta title and description for every page, Open Graph tags for social sharing
- Clean **URL structure**: `/about` `/articles` `/research` `/resources` `/contact`
- **Fast load performance**: optimized images, minimal bloat

---

## Content Placeholders

Do **not** use generic Lorem Ipsum. Use **realistic, contextually relevant placeholder content** 
drawn from Nigerian and international technology law. Use the following as placeholder article titles:

- *"Understanding Nigeria's Data Protection Act: What It Means for Businesses"*
- *"The Legal Gaps in Africa's Cybercrime Frameworks"*
- *"Regulating Blockchain: A Nigerian Perspective"*
- *"Breaking Down the EU AI Act and Its Global Implications"*
- *"AI Liability and the Question of Legal Personhood"*

---

## Tone & Voice

**Sharp, credible, analytical, and accessible.**

The site should feel like it belongs to a young but deeply serious legal mind — not a student 
portfolio, but a **professional platform built for the long term**.




---

# Hero Section Redesign — index.html

## Goal
Redesign the hero section of `index.html` to use a full-width background 
photo with text overlaid on the left side, exactly like the reference layout.

---

## Background
- Set the hero section to use **`Image-one.jpg`** as a full-width, 
  full-height background image
- Background size: **cover**
- Background position: **center**
- Add a **subtle dark gradient overlay** on the left side only, so the 
  text remains readable without covering the face on the right
- Gradient direction: `to right`, from `rgba(0,0,0,0.55)` on the left 
  to `rgba(0,0,0,0.0)` on the right

---

## Layout
- Text content sits in the **bottom-left** of the hero section
- Hero section minimum height: **100vh**
- Content max-width: **520px**
- Content padding from bottom: **80px**
- Content padding from left: **60px**

---

## Text Hierarchy (follow exactly)

### Line 1 — "Hey there!"
- Font: **Creato Display Light**
- Font weight: **300**
- Color: **#E6E6E6** (20% black)
- Font size: **52px**
- No margin bottom (sits tight above Line 2)

### Line 2 — "I'm Blessed..."
- Font: **Creato Display Regular**
- Font weight: **400**
- Color: **#FFFFFF**
- Font size: **64px**
- Font style: Normal
- Line height: **1.0**
- Margin bottom: **16px**

### Line 3 — "Law Student | Data Privacy & Compliance · Cybercrime · Blockchain · AI Governance"
- Font: **Creato Display Medium**
- Font weight: **500**
- Color: **#FFFFFF**
- Font size: **16px**
- Line height: **1.5**
- Margin bottom: **12px**

### Line 4 — "Explore the legal frontiers of emerging technologies, writing, researching, and advising on how the law adapts to an increasingly digital world."
- Font: **Creato Display Light**
- Font weight: **300**
- Color: **#E8E8E8** (10% black)
- Font size: **14px**
- Line height: **1.65**
- Margin bottom: **32px**
- Max width: **420px**

---

## Buttons
- Keep the **"Read My Articles"** and **"Get In Touch"** buttons 
  exactly as they are in the current design — same style, same 
  classes, same colors, no changes whatsoever
- Only change is they now sit at the **bottom of the left-aligned 
  text block** inside the hero

---

## Creato Display Font Loading
Since Creato Display is not on Google Fonts, load it using 
**@font-face** declarations pointing to the local font files if 
available, or use the following fallback stack:
`'Creato Display', 'DM Sans', sans-serif`

---

## What NOT to Change
- Do **not** change the navbar
- Do **not** change the Areas of Focus section
- Do **not** change the Latest Articles section
- Do **not** change the footer
- Do **not** change any other page
- Only modify the **hero section** inside `index.html`