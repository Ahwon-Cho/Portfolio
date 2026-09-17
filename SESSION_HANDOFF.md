# Portfolio Session Handoff

Last updated: September 13, 2026

## Project

- Local project: `/Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game`
- Local preview: `http://127.0.0.1:5173/`
- Status: local only; do not publish without Ahwon's explicit approval.

## Creative direction

The portfolio landing page should feel like a small, personal 3D world rather than a typical portfolio template. It should emphasize Ahwon's visual-design strength immediately and let the detailed case studies demonstrate her UX process.

The visual language is minimal and editorial: mostly white and light-gray 3D forms, soft shadows, generous space, and one restrained color accent per scene. The experience should feel playful and game-like without becoming visually busy.

## Landing-page interaction

- A horizontal, looping 3D carousel presents four personal themes one at a time.
- The carousel advances automatically: coffee 8s, work 11s, nature 8s, garden 9s, then back to coffee. Scrolling/swiping advances sooner; reverse input goes back. Every manual advance resets the automatic interval for the new scene.
- A small Pause/Play control sits in the header. Keyboard focus pauses automatic changes; reduced-motion preferences default to manual navigation. Hidden tabs and active touch gestures suspend the timer without catching up through skipped scenes afterward.
- The page opens directly on the centered coffee scene, followed by workspace, nature, and garden as visitors scroll. The introductory headline stays visible above it.
- Scrolling advances to the next centered theme instead of freely moving the scene.
- The main scene stays centered while the themes rotate front-to-back.
- The 3D world is viewed primarily from the front, not from above.
- A short speech bubble appears only after the selected theme reaches the center.
- Bubble placement varies by scene so it uses nearby empty space.
- Clicking anywhere on the 3D scene, or clicking “Skip to work,” opens the work page.
- The introductory headline and copy remain visible at the top.

## Current scenes and copy

1. Coffee — seated directly behind a centered round table in a white/light-gray café chair, facing the viewer. A traditional red mug lifts from the tabletop for a gentle sipping loop. Bubble: “Coffee inspires me!”
2. Workspace — desk, laptop, monitor, and a colored plant. On selection, Ahwon stands beside the chair in front of the desk, pauses with a hand near her chin, has a brief blue idea cue, turns toward the screens, sits, and types. Bubble: “I visualize early, fail fast, and make ideas clear.”
3. Nature — a light park scene with a bench, cherry-blossom tree, Ahwon, her husband, and two dogs. Bubble: “Nature helps me solve problems.”
4. Garden — three simple white pots with light-gray rims: two tomato plants and one zucchini plant. The character stands beside the pots, holding a light-gray watering can and gently tipping it over a tomato pot; droplets appear only while pouring. Bubble: “Watching things grow brings me peace.”

Top headline: “A small world shaped by curiosity.”

## Most recent update

- Added automatic theme rotation while retaining faster manual scroll, swipe, and keyboard navigation. Kept the longer work interval so its stand/idea/sit/typing sequence has time to play. Added a small header pause control and changed the temporary guide to “Scroll to go faster.” Automatic updates do not trigger repeated screen-reader announcements.
- Verified the automatic full loop, manual timer reset and reverse navigation, pause/play, hidden-tab and touch suspension, and timer/listener cleanup with a controlled clock. Production build passed.
- Added the work-scene sequence: stand and think (0–1.4s), idea cue (about 1.4–3s), turn/sit (3–4.8s), then continuing typing. The sequence begins after the carousel settles and restarts when this theme is selected again. It uses one continuously posed character, connected arm/leg segments, and grounded feet rather than swapping standing/seated figures. The scene-linked bubble follows the same head.
- Reduced-motion mode shows the seated working pose without the idea animation. Other scenes keep their existing motions. Production build and targeted phase, replay, foot-contact, joint-continuity, and other-scene checks passed.
- Reduced the red coffee mug from scale 0.72 to 0.44 (about 39% smaller). Recalibrated the sipping arm and mug-to-hand attachment so the cup rests on the table and touches the mouth while staying below both eyes throughout the loop.
- Replaced fixed side-positioned bubbles with scene-linked bubbles: project Ahwon's mouth position into the page, place each circle in nearby space, and aim its pointer back toward her. Coffee/work prefer the left, park the right, garden the left; the side flips when needed to stay on screen. Preserve all bubble copy.
- Bubbles now pop from the character's position after the carousel rotation and scale have actually settled. Diameter is 144px on desktop and 128px on mobile. Resize and text-layout changes update placement; reduced-motion users get immediate scene changes without the pop animation.
- Standardized all four theme compositions with a shared perspective-aware frame: the main visual's longest edge is about 34% of viewport height, centered horizontally, with a common ground baseline at 86.5% of viewport height. A separate, uniformly scaled composition group preserves object proportions and all existing poses. The carousel still animates its outer anchors normally.
- Framing is calculated once from stationary artwork, excluding steam and water, so looping movements do not resize or recenter the scenes. Numeric projection checks passed at five desktop/tablet/mobile viewport sizes; all four animation callbacks, coffee contact, watering states, and the production build passed. Copy and individual bubble positions are unchanged.
- Created `src/img/ahwon-character-reference.png` from the existing `landing-work.png` and `landing-me.png` illustrations. Generation details and prompt are in `CHARACTER_REFERENCE.md`.
- Applied the illustrated woman's long dark hair, simple face, green hoodie, and brown trousers to the animated 3D character in all four scenes. The generated reference is not used as a flat replacement; the live figure remains simplified 3D geometry. Kept the husband's styling separate.
- Refined the coffee arm's sipping endpoint to meet the new face while preserving its seated position behind the table.
- Centered the coffee person and chair behind the table while keeping the front view. Adjusted the sipping arm to reach forward over the tabletop.
- Changed the gardening character to a standing pose and raised the can, with the arm recalculated to keep the hand connected while watering.
- Added a held watering can and a gentle tilt-and-pour loop, with droplets falling from the spout into a pot. Water stops and the can stays upright when the scene is inactive or reduced motion is enabled.
- Replaced the raised garden bed and shared trellis with three individual pots, keeping the tomato and zucchini plants and gentle gardening animation.
- Moved the bubble pointers to the lower diagonal edges, angled down-left or down-right toward each scene instead of pointing horizontally.
- Changed the speech bubbles to circular shapes with centered text and more padding, using smaller circles on mobile.
- Turned the coffee person and chair to face the viewer directly. Moved the table beside them and adjusted the arm to bring the mug from the side table to their face.
- Seated the coffee character on a minimal café chair facing the round table. Added a footrest and an articulated arm so the red mug stays in the hand while sipping.
- Made coffee the initial selected scene at its full focused scale, with its speech bubble and “01 / 04” counter. The first forward scroll now goes to workspace; backward scrolling wraps to garden.
- Aligned the workspace character, chair, keyboard, and monitor so the seated character faces the screen. Turned the full setup slightly sideways, corrected the laptop screen face, and placed the typing hands over the keyboard.
- Lowered each scene's speech bubble by 32px on desktop and 24px on mobile to sit closer to the 3D objects, keeping the individual side placement and delayed appearance.
- Lowered the centered introductory copy by 32px on desktop and 20px on mobile.
- Changed the landing-page headline, speech bubbles, and scene counter to Plus Jakarta Sans, matching the rest of the portfolio.
- The headline uses semibold, upright text; the blue emphasis on “curiosity” remains.
- Replaced cucumber plants with tomatoes using a restrained red accent.
- Reduced the garden-bed and trellis footprint.
- Kept the zucchini plants.
- Updated the garden description to say “tomatoes and zucchinis.”
- Verified the production build successfully.

## Important user preferences

- September 15, 2026 résumé corrections: Ahwon does not use UserZoom; remove Framer from tool claims. Say “AI-assisted prototyping,” not “Codex-assisted.” Motion is not a core specialty; retain the historical motion-design role only as employment history. Do not claim mentoring or senior/VP stakeholder presentations without confirmation. Microsoft ownership spans SMP, SSP, SKP, and Surface IT Toolkit; Toolkit is one example, not the whole role. Microsoft has an existing design system; Ahwon adapted it into flexible, collaborative local Figma libraries where child systems were not yet modernized. Do not claim one shared library across all products or unverified adoption. Preserve the stronger ownership wording and the approved two-page résumé styling. The new résumé remains a review artifact; the website's existing PDF link has not been replaced.
- September 15, 2026: Use direct, natural wording throughout the portfolio and résumé. Avoid em dashes and dash-led asides, generic slogans, inflated claims, repetitive contrasts, and invented personal anecdotes. Keep useful grammatical hyphens and official terms. Audit copy and grammar before handoff; do not replace user-approved book artwork or theme captions during a wording cleanup.
- Do not invent personal facts, names, metrics, or career claims.
- Ask when information is missing and a meaningful assumption would be risky.
- Keep the existing portfolio design tone and content.
- Use sans-serif typography for the portfolio (latest preference: September 12, 2026), with strong, accessible text contrast. The current family is Plus Jakarta Sans.
- Use blue-to-purple accents rather than orange.
- Keep the landing page visually distinctive, polished, and suitable for a visual designer.
- Do not deploy until Ahwon reviews and explicitly approves the local version.

## Suggested next review

Review the reference-based character locally in all four scenes, especially face visibility, hair silhouette, the coffee sip, and standing watering pose. Check the pots and speech bubbles at desktop and mobile sizes. The production build and geometry/animation checks do not replace a visual review.

## Future work

- Revisit and improve the Pantry Note case study later.
- Preserve the current Pantry Note page until Ahwon is ready to work on it.
