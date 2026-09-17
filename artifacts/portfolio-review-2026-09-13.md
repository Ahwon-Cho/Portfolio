# Portfolio review and landing2 handoff

Reviewed September 13, 2026.

## Scope and status

Reviewed the six selected projects in the original portfolio at `/Users/ahwoncho/Documents/React learning/Claude Code/portfolio`: their source content, page structure, project-card presentation, and thumbnail assets. Inspected the running project grid and Surface case-study opening in the browser. This is a design/content review, not independent verification of employment, research results, production outcomes, or a full accessibility audit.

The existing homepage is unchanged. The current 3D prototype has been copied into a separate `/landing2` route in this original project. It has its own scene and stylesheet, is loaded separately, and is not linked from the existing navigation. Its existing Skip interaction goes to this portfolio's `/work` page. It remains a motion prototype, not a final character-art deliverable. Nothing was published.

Case-study content and thumbnails have not been edited. The recommendations below are proposals; claims needing confirmation should not be silently rewritten as facts.

## Main recommendation

Position the portfolio around **visual craft supported by clear product decisions**. You already have credible material for that story: enterprise workflow design, custom icons and product imagery, a mobile visual redesign, interaction decisions across complicated retail flows, and an AI-assisted design-system project.

The presentation currently makes readers do too much work to connect those strengths. Some pages show many artifacts without identifying the decision each artifact proves. Others describe visual work but show almost none of the alternatives or details. The grid gives all six projects equal emphasis, while Blue Connect—the explicitly visual-design project—is last.

I would prepare Surface, Blue Connect, and Home Depot as the three strongest complementary case studies. Keep GPU Flight, Pantry Note, and the Cost Estimator accessible as supporting stories. For a design-engineering application, move GPU Flight higher. This is an editorial recommendation, not a claim about recruiter behavior or an instruction to remove projects.

## Project-by-project changes

### 1. Surface IT Toolkit — make visual craft part of the main story

**Keep:** sole-designer scope, the three workflows, collaboration under time constraints, light/dark work, custom icons, and your product imagery.

**Change:** the opening fills the inspected desktop viewport with title, description, TL;DR, and metadata before any work is visible. Tighten the description and metadata so a substantial product image appears earlier. The custom-icon chapter is near the end, after final-design galleries, legacy screens, wireframes, and a flowchart. Bring a small sample of that craft into the opening, then explain it in a focused chapter.

Organize the main story around three decisions:

1. How you reorganized one difficult admin task: an annotated before/after with a specific entry point, decision, and completion state.
2. How the reusable components and theme variables worked: show one component in relevant states and both themes; distinguish existing system foundations from the components you created or extended.
3. How you created the icons and imagery: show a sketch, a rejected metaphor if available, the final icon, and its use in the interface.

Replace the nine-screen wall as the main proof with three readable examples; keep the rest in an optional gallery. Label counts such as “three workflows” as scope, not business impact. Retain positive feedback only with accurate wording and context. Describe the legacy constraints respectfully rather than repeatedly framing engineers as the problem.

**Confirm:** the card says seven months, the page says under eight months and also displays “8 mo.” Use a consistent date range until the duration is confirmed. Clarify “existing system components” versus a library built “from the ground up.”

### 2. Blue Connect — your clearest opportunity to demonstrate visual judgment

**Keep:** the limited-palette constraint, navigation and hierarchy problem, three explored directions, and research-backed selection.

**Change:** the generic case-study page currently gives the project a hero image and text-based process, challenges, and outcomes. The three visual directions described in the content are not presented as a comparative visual chapter. Add the actual alternatives, explain the tradeoff in each, and show why the chosen direction worked better for the relevant tasks.

Use one annotated before/after for the home screen, then two enlarged details: quick-access actions and benefits/coverage information. Explain typography, spacing, grouping, status presentation, icon consistency, and how you used color within the brand constraints. Show what was retained, not only what changed.

**Confirm before publishing the score:** what 65 and 96 measured, sample sizes for each, whether the same instrument was used, and what the 50 assessments covered. The current headline can read as a live-product improvement, but the challenges say the design was not implemented. Label it clearly as a tested redesign proposal, not a shipped satisfaction gain. Keep the outcome only with the correct measurement context.

### 3. Home Depot Protection Plan — your strongest decision-and-learning narrative

**Keep:** the concrete post-purchase customer problem, the realization that one scenario did not generalize, the move to a complete flow map, and the checkbox-versus-CTA decision. These are more revealing than a generic process diagram.

**Change:** define GM (General Merchandise) and MA (Major Appliances) once. Replace repeated explanations of complexity with one compact scenario matrix: entry point, item type, available choices, and final state. Show the three initial options with the selection rationale, then a before/after of the interaction that changed. Use a cropped portion of the flowchart to explain one edge case before offering the complete diagram.

Separate design delivery, testing, handoff, eventual launch, and recognition. The TL;DR says “shipped GM items in week one,” while the body says the first design was delivered in a week and that you left before final launch. That needs clarification. “Easier than expected” is useful qualitative evidence, but identify the task, participant context, and subsequent design decision; it does not establish a quantified reduction in confusion or a revenue increase.

Place the award after the user/design evidence, with accurate attribution. Do not make recognition the only headline outcome.

### 4. GPU Flight — lead with the design problem, not being a beginner

**Keep:** your AI-assisted prototyping, collaboration with the engineer, and Verdant 2 as a way to maintain an intentional visual language across generated screens.

**Change:** the card currently ends with “My first vibe-coding project,” and the subtitle is too long for its two-line clamp. Lead with the product/design contribution. Suggested direction: “A consistent visual language for GPU observability.” Keep learning an unfamiliar domain as context, not the main value proposition.

The design-system chapter has useful foundations/component/template examples, but the text repeats the same consistency argument several times. Condense it and add one concrete visual chain: inconsistent screens → the specific token/component decision → a real product screen using it. Include one telemetry reading task and explain hierarchy, density, and chart choices. Keep AI's role and your own decisions distinct.

**Confirm:** component counts and accessibility claims against the actual system; technical comparisons with profiling tools with your engineer; and the statement about six active Microsoft products. Color separation alone should not be treated as proof of accessible charts—show labels, line styles, or other redundant cues if implemented.

The data marks GPU Flight as work in progress, but `Projects.jsx` does not pass `wip` to the cards, so the available WIP badge is absent from the grid. Correct that before presenting the grid as a complete record of shipped work.

### 5. Pantry Note — show the tested interaction change and preserve the theme

**Keep:** the blue/white visual identity visible in the current cover, the household problem, the research counts with context, and the concern about input effort.

**Change:** the most valuable potential story is the “plus button” iteration, but it currently relies on a broad assertion. Show the exact old screen, the observed hesitation, the new entry point, and what happened in a follow-up test if one occurred. Do not imply that plus buttons are universally bad or that more input methods automatically mean less effort.

Move from a long research-artifact tour to three useful decisions: starting an inventory, updating/using an item, and deciding what to use before expiry. Keep only the research finding that informs each decision. Put the full persona, journey, and 13 wireframes behind optional expansion or a gallery. Use a short, controllable interaction clip with a static alternative; the two GIF assets together are about 13 MB before other imagery.

The current thumbnail says “machine learning,” and shows a plus-based input control, while the narrative stresses moving away from that interaction. Reconcile the cover with the version actually demonstrated. The data also describes a green/yellow/orange palette while the visible cover is blue/purple; update the description to the selected design rather than changing your theme to match old text.

**Confirm:** whether 29 refers to the survey, interviews, or both; how many people tested the input change; and which behaviors were functional versus simulated in the prototype. Label notifications, sharing, and waste reduction as designed capabilities or intended benefits unless implementation/results are documented.

Keep the historical case study separate from the future local-only app. A future chapter can explain on-device storage, optional local photos, no account, and any scope decisions. Do not imply that cloud-free family sync or machine learning already exists.

### 6. Blue Cross NC Cost Estimator — foreground alignment through visualization

**Keep:** the four-week constraint, rapid prototypes, scenario work, and stakeholder alignment. This supports your “visualize early” approach well.

**Change:** show the specific disagreement that delayed a decision, the two options you visualized, and how the prototype helped the group choose. Include a readable estimate/detail screen and one provider/internal-user flow with task-level annotations. The existing generic template describes the process but does not show those decision artifacts.

Keep the user groups precise: the content names three internal CSP users and one external provider as test participants. That is not the same as testing with members/patients. “4/4 found it intuitive” needs its actual question/task and should not imply broad validation. Treat the month of alignment as a project event, not proof that one month of design replaced six equivalent months of design work. Clarify prototype delivery versus regulatory/product launch; do not use compliance language without the appropriate project evidence.

## Thumbnail direction

The current images are not bad; the main issue is that the device mockups and embedded project titles compete with the actual design. GPU Flight and the Cost Estimator both use a very similar iMac-on-pale-background treatment, despite representing different skills. Home Depot's multi-phone composition makes the important controls small. Blue Connect devotes substantial space to a title repeated directly below the image.

Use a shared **16:10 frame**, consistent margins, and a restrained surface. Make the real interface the dominant element. Keep title, one-sentence contribution, role, and status as live text outside the image. Avoid embedded paragraphs or metrics. Test the image at the actual small card size, not only at export size. The current fixed 320px image height with `object-cover` changes the crop substantially on narrow screens; use a deliberate aspect ratio and per-image focal point.

| Project | Proposed focal image | Distinctive supporting detail |
| --- | --- | --- |
| Surface IT Toolkit | One large, readable toolkit screen with minimal device framing | Three or four custom icons you actually designed; a subtle light/dark pairing if legible |
| Blue Connect | One dominant mobile home screen plus a cropped benefits detail | Existing navy/blue/orange product language; enough scale to see the hierarchy, without a duplicate large title |
| Home Depot | One close-up of the post-purchase protection-plan drawer | The orange CTA and plan-to-item relationship; a small contextual order fragment rather than four tiny phones |
| GPU Flight | A close-up of an actual dashboard chart/table or real template | Existing graphite/sage system details; let information density distinguish it, not a generic desktop monitor |
| Pantry Note | One primary inventory screen and one small input interaction | Preserve the chosen blue/white theme; show the correct iteration and remove unsupported machine-learning copy |
| Cost Estimator | A readable estimate or task-focused form/result detail | Highlight the cost breakdown or decision point; avoid repeating GPU Flight's iMac composition |

Use only assets you are permitted to display publicly; check names, account data, internal comments, and unreleased material before exporting new crops. Proposed annotations should explain real decisions, not invent screenshots or results.

## Shared page improvements

- Replace “Six selected projects” with a content-led heading such as “Selected work,” if you want the work rather than the count to lead.
- Remove or qualify “always shipped close to engineering”; the selected set includes work in progress, a personal prototype, and an unimplemented redesign.
- Replace the auto-extracted first sentence of each TL;DR with a short, deliberately written card takeaway. It currently produces clipped claims and “My first vibe-coding project” instead of a meaningful contribution.
- Move one strong visual into the first view. Use a short role/status line and one clear product problem, then let the design lead.
- Tell three decision stories per flagship: what you observed → what you considered → what you chose → evidence/limits. Avoid making every project follow an identical research/process gallery.
- Darken small supporting text and make important captions larger. Keep images understandable without requiring the lightbox for every detail. This review is not a contrast-compliance audit.
- Add concise section navigation to long case studies; keep full artifacts as secondary detail. The existing “All Work” button calls browser Back, which can return to a landing page or external site rather than the work grid; make the label and destination agree.
- Distinguish shipped product, delivered design, tested proposal, prototype, and work in progress consistently across cards and pages.

## Recommended sequence

1. Confirm the score, research-method, launch, timeline, and scope questions. Fix misleading status/copy and the missing WIP label first.
2. Develop Surface and Blue Connect thumbnails as the shared-system test: one desktop/enterprise example and one mobile/visual example. Review at desktop and phone sizes before extending to all six.
3. Rework Surface, Blue Connect, and Home Depot around specific annotated decisions. Add only evidence you have; mark gaps for follow-up rather than inventing results.
4. Condense GPU Flight, clarify the Cost Estimator participants, and separate Pantry Note's historical prototype from its future local-only build.
5. Refine `/landing2` character quality, transitions, mobile composition, and motion accessibility independently. Link or replace the homepage only after your review and explicit publishing approval.

## Source notes

- Routes and original-home preservation: `src/App.jsx`; new prototype: `src/pages/Landing2.jsx`, `src/pages/PlanetLanding.css`, `src/components/PlanetScene3D.jsx`.
- Project order, role/status, score claims, and generic case-study content: `src/data/projects.js` (`FEATURED_SLUGS` at the end).
- Missing WIP propagation and grid introduction: `src/components/Projects.jsx`.
- Fixed thumbnail height, image cropping, automatic TL;DR takeaway, text clamps: `src/components/ProjectCard.jsx`.
- Surface narrative, 8-month stat, final gallery, and late visual-craft chapter: `src/pages/SurfaceITCaseStudy.jsx`.
- Home Depot first-week wording, interaction choices, testing, and departure-before-launch statement: `src/pages/HomeDepotCaseStudy.jsx`.
- Pantry research labeling, input-change narrative, GIFs, and wireframe gallery: `src/pages/PantryNoteCaseStudy.jsx`.
- Generic page structure and optional visual chapters: `src/pages/ProjectDetail.jsx`.
- Actual thumbnail assets: `src/img/surface-it-toolkit.png`, `thumb-gpu.png`, `blueconnect-redesign.png`, `homedepot-protection-plan.png`, `pantry-note.png`, and `bluecross-cost-estimator.png`.
