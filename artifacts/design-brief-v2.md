# Portfolio Redesign Brief — v2
_Created: 2026-03-29_

## What We're Keeping
- Particle dot animation (Hero background) — distinctive, memorable, keep as-is

---

## Top 6 Projects (Confirmed)

### Selected & Why

| # | Project | Signal | Why It's In |
|---|---------|--------|-------------|
| 1 | **GPU Flight** | Developer tools · Full stack ownership · Vibe coding | Most current work (2026). Shows design + frontend in one loop. Strong differentiator. |
| 2 | **Surface IT Toolkit** (Microsoft) | Enterprise · Systems thinking · Sole designer | Strongest seniority signal. 7-month ship, full Figma component system, led alone. |
| 3 | **Blue Connect Mobile App** (Blue Cross NC) | Measurable impact · Rigorous testing | Best metric: 65→96 satisfaction score. 50 unmoderated tests. Hard to dismiss. |
| 4 | **Blue Cross Cost Estimator** | Speed · Stakeholder alignment | 4-week delivery, 4/4 usability, unblocked 6 months of stalled discussions. |
| 5 | **Home Depot Protection Plan** | E-commerce · Award · System complexity | "Caught Orange Handed" award, 5 user scenarios, design system adoption. |
| 6 | **Pantry Note** | Consumer mobile · Self-initiated · Full process | Shows intrinsic motivation. 29 interviews, Framer prototype. Pairs well with GPUFlight. |

### ⚠️ GPUFlight image placeholder
- Case study written and added to projects.js
- `image` and `thumbnail` fields set to `null` — owner to provide screenshots when ready

### Retired
- **Teams Anywhere** — Concept only, no shipped product.
- **Samsung / Ergo Daum** — 2017–2018 work, Flash-era tools. Dates you.

---

## What to Change

### 1. Project Section Layout — High Priority
**Problem:** 3-column uniform grid treats all projects equally. Top work drowns in the grid.
**Fix:** Use an editorial layout — featured card (full-width or 2/3) for #1, then 2-up below, then 1-up for #4. This signals hierarchy and craft.

### 2. Project Cards — High Priority
**Problem:** Cards show no company, no role, no impact metric. Recruiter can't scan.
**Fix:** Add:
- Company name / logo or color-coded brand accent
- One-line metric (e.g., "65 → 96 satisfaction score")
- Role tag (Sole Designer vs. Team)

### 3. About Section — Medium Priority
**Problem:** Photo placeholder ("Add your photo here") is a trust killer. Stats feel generic.
**Fix:**
- Add a real photo — even a casual one is better than a placeholder
- Reframe stats: "2 Countries" is weak. Replace with something stronger like "4/4 Usability Tests Passed" or "Fortune 500 clients"
- Consider adding 2–3 short "I believe in..." principles instead of the skills tag cloud — it's more memorable

### 4. Hero Headline — Medium Priority
**Problem:** "Crafting experiences that feel effortless" is competent but forgettable. Dozens of portfolios say this.
**Fix:** Make it specific to you. Options:
- "I design enterprise software that doesn't feel like enterprise software."
- "From Microsoft to Blue Cross. Complexity, simplified."
- Keep the italic secondary line — that contrast works well.

### 5. Section Rhythm — Medium Priority
**Problem:** Every section has the same visual weight. Hero → About → Projects → Contact all feel like equal-level pages.
**Fix:** Vary section density and background differentiation more aggressively. Consider a full-bleed dark "statement" section between About and Projects with one bold pull-quote about your design philosophy.

### 6. Navigation — Low Priority
**Problem:** No scroll progress indicator. On a one-page portfolio, users lose their place.
**Fix:** Add a minimal dot-nav or progress bar on the right edge. Already have section IDs set up.

### 7. Contact Section — Low Priority
**Problem:** Generic form + email. Everyone has this.
**Fix:** Open with a more personal hook: "If you're building something complex and need design that ships — let's talk." Then the form. Adds personality.

---

## What NOT to Change
- Stone color palette — warm, sophisticated, not overdone
- Dark mode — well implemented
- Typography scale — the display/italic contrast reads well
- Header — clean, sticky behavior is good
- Particle canvas — keep exactly as-is

---

## v2 Build Status — Complete
Branch: `v2` | Build: ✓ clean

### What was built
- Dark editorial design — zinc-950 hero/footer/contact, ink-50 about, white projects
- Playfair Display for all headlines and italic moments (font was already loaded)
- Amber-400 accent — used sparingly on: available dot, progress bar, hover underlines, process step numbers, outcome checks, amber TL;DR badges
- Left-aligned hero — breaks convention, signals editorial confidence
- Philosophy interstitial section between About and Projects
- Editorial project grid: GPUFlight full-width featured card, 5 cards in 3-col grid below
- Framer Motion throughout: staggered hero reveal, scroll reveals, page transitions, reduced-motion respected
- Skip nav link, ARIA landmarks, accessible form with required fields + success state
- Scroll progress bar in header (amber)
- Active section tracking in nav
- Null image handled gracefully in both ProjectCard and ProjectDetail (gradient placeholder with title watermark)

### Next steps
1. Add your photo to About (replace the AC monogram placeholder)
2. Add GPUFlight screenshots (drop images in /public/images/, update projects.js thumbnail)
3. Update email/LinkedIn/Dribbble links in Contact.jsx
4. Run /design-team again for fine-tuning pass
