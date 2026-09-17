# Painted motion — local layered ink review

Review route: `/ink-motion`. Existing `/`, `/ink`, and the original portfolio remain unchanged. No deployment or commits.

## Latest — animated scroll guide restored; book intro draft only

The scroll guide existed but its one-shot 6.5-second fade ended at zero opacity. The same “Scroll to go faster” copy now stays visible after its entrance, paired with a circular directional cue whose arrow moves downward on a 2.4-second loop. Paused or reduced motion shows a static, visible arrow. The cue sits above the scene without overlapping copy or speech bubbles on desktop and phone widths. No carousel timing, floor assets, figures, or routing changed.

A separate Korean thread-bound book opening is an image-only proposal pending user approval, not an implemented route. Closed-book title: “Ahwon Cho”, “UX / Visual Designer”; proposed subcopy: “Making complex things feel clear.” The second frame shows the opening into the existing coffee theme. Draft, exact built-in image prompt and provenance: `../../asset-output/korean-book-intro-v1/`. The current landing remains intact.

## Latest — themed floors and calm park

The existing circular pad now displays one generated surface per scene: café terrazzo tile, pale-oak work flooring, muted green park grass, and terracotta garden brick. Four local WebP assets live in `public/images/painted-motion/floors-v1/`; exact built-in prompts, source originals and output links are archived in `../../asset-output/floor-textures-v1/`. Images are clipped to the unchanged top ellipse, foreshortened to its plane, and crossfade after the scene's 300ms exit. No new floor objects or scene links were added.

Park dogs are seated from arrival, fixed at x217/x576 and the same floor/size anchors as before. Only anatomy-following tail cutouts animate, with different gentle rhythms and pauses. There is no walking, body bob, paw motion, sit transition or head motion on the dogs. Ahwon's head and loose hair move subtly as if enjoying a breeze, instead of tracking dog paths; the faint cherry-blossom backdrop sways gently. Pause and reduced-motion behavior remain respected. Husband stays hidden. The earlier working-scene perspective issue was not redrawn in this floor-only request.

The page's previously lightened paper color remains `#f7f9fc`. No copy, logo, work pose, coffee palm or garden backdrop extent was changed in this update.

## Latest — seated mouse-working pose and taller coffee palm

The work scene now uses a newly drawn full-body figure seated on a fitted chair, with her right hand naturally gripping a small mouse and her other hand resting on her lap. Old detached hand/sleeve overlays and the standing-to-seated crossfade are removed. A subtle head glance remains. The desk sits behind the coherent figure; laptop, monitor and plant stay separate. Laptop and monitor positions leave the mouse visible. Exact built-in edit prompts, generated originals and locally alpha-cleaned artwork are in `../../asset-output/work-seated-mouse-v3/`; the interim seated typing drawing is retained in `../../asset-output/work-seated-v2/` but not used by the scene.

The coffee palm is now 250px high (was 172px), maintaining its original aspect ratio, center and floor contact. No other scenes, copy, colors or carousel controls changed. Verified transparent openings, opaque hand/mouse/chair, asset loading, no detached hand layers and no horizontal overflow at 1440px, 390px and 320px. Local build passed; nothing published.

## Latest — smaller round bichon ears, larger cocker

Both bichon poses now use versioned `dog-light-*-round-ears-v2.webp` cutouts, preserving the full fluffy crown and replacing the long-ear emphasis with smaller rounded ears. Two built-in edits; original outputs and exact prompts are in `../../asset-output/bichon-round-ears-v2/`. Local alpha cleanup followed the user's existing permission. Canvas dimensions and all motion anchors remain unchanged. The cocker is now 102px high walking (was 90) and 108px sitting (was 96), keeping its feet, paths and staggered motion unchanged. Husband remains hidden. Microsoft context line remains removed, and garden foreground retains its 32px left offset. Local only.

## Latest — scene proportions, quieter motion, green foliage

User-requested refinements: coffee gets its own potted palm rather than the desk plant; the work desk is 25% larger with its feet aligned to Ahwon's and its monitor/laptop repositioned on the taller surface. The full stage (circle, objects and bubbles) moves down by 16–26px. The bottom theme-name/arrow menu is removed; Skip to work remains. Scroll, swipe, keyboard arrows and the existing pause control remain available. Autoplay starts on its own and gives each scene its full dwell time after arrival, while respecting reduced motion and keyboard focus.

Dog motion now uses anatomical cutout masks instead of rectangular leg strips. Paw contacts counter the body's translation, with staggered four-beat steps, low paw lifts, restrained independent tail wags, and a planted pause before the front-facing seated pose. Bichon and Cocker have different start times, paths and cadences. No body flips or spinning. Husband stays temporarily hidden (`SHOW_PARK_HUSBAND = false`), with his asset and position retained; the accessible park description now matches the visible scene.

Title color is muted deep green `#435c53` (6.49:1 against the pale-blue paper ground). Existing copy is unchanged. Garden background uses contain instead of cover and padded sides to avoid viewport cropping. New foliage assets retain green leaf pigment with background-only blur and low opacity. Generated originals, exact built-in prompts and alpha-cleanup notes are archived in `../../asset-output/green-scenes-v1/`; old artwork remains available.

The garden's unused transparent bottom is trimmed (artwork preserved), placing its tree/bush base near the back of the circular set. Side/bottom masks soften its edges. Background opacities: coffee 0.38, work 0.36, garden 0.62, unchanged cherry blossom 0.6; all retain 3px blur. Foreground palm is full-opacity transparent artwork, 172px high. Build and no-capture checks passed across all four scenes at 1440, 390 and 320px, including full automatic wraparound, independent dog timing and pause/resume. Nothing published.

## Latest — pale-blue paper

The page ground is now pale blue `#edf3f8`, separate from the unchanged ivory circular platform. A generated fine hanji/mulberry-fiber texture sits behind all scenery and content, in a noninteractive pseudo-element at z-index -1, multiply blend and opacity 0.42. It covers the full page without repeating, avoiding visible tile seams. Existing alpha layers, 3px scenery blur, character motions and copy remain unchanged. Inactive scene labels and the scroll guide use the existing darker blue-gray body-text color for readability over the texture.

Texture: `public/textures/hanji-paper-v1.webp`, 1024 × 1024, 138,288 bytes. One built-in generation; original and exact prompt are in `../../asset-output/blue-paper-v1/`. Checked all themes at desktop and phone widths: texture loads below content, no overflow, scenery remains blurred and foreground sharp. Build passed. Local only.

## Latest — transparent backgrounds throughout

Follow-up: all four scenery images now use 3px background-only blur. Nature retains 0.6 opacity. Foreground people, dogs, objects and text remain sharp; alpha backgrounds, composition and motion are unchanged.

All 21 foreground assets were audited on contrasting backings. Their exterior backgrounds and structural openings already have alpha; white fur, shoes, furniture, pots and painted highlights are preserved as opaque artwork.

The four full-viewport scenery files still had opaque ivory paper. They now use locally extracted alpha versions in `public/images/painted-motion/transparent-backdrops-v1/`. Source illustrations remain unchanged in their original folders. Archive/provenance and diagnostic composites: `../../asset-output/transparent-backdrops-v1/`. No new image generation or redraw. Image wrappers explicitly use transparent backgrounds.

Verified encoded alpha and all four themes at 1440px, 390px and 320px without screenshots: empty background pixels have alpha zero; no failed assets, overflow or page errors. White object fills, copy, motions, dog breed updates, layer positions and nature-only softness remain intact. Build passed; local preview only.

## Dog identities — user correction, September 14

The white dog is a Bichon Frise: fluffy white coat, a noticeably larger rounded crown, and short ears blending into the round head. The black dog is a Cocker Spaniel: long, broad hanging ears, larger and longer than the Bichon's ears. Preserve these distinctions in both walking and front-sitting poses. Their existing separate movement timing, positions and paths should remain. Dog names have not been provided and must not be invented.

Implemented as four versioned `*-breeds-v1.webp` assets in `ink-motion-v4`, with updated manifest dimensions and a fresh manifest query key. Existing images are retained. Built-in generation returned opaque checkerboards; local background extraction produced separate transparent cutouts without repainting foreground colors. Prompts, original outputs and final PNGs are archived in `../../asset-output/dog-breeds-v1/`. The walking Bichon still has a small distinct ear; the seated head is fully rounded. Cocker ears are visibly longer in both poses.

Build and no-capture local animation checks passed: all four new poses load, Bichon and Cocker still walk at different times before sitting, pause works, and both fit at 390px/320px. No figure, background, copy or animation timing changes. Nothing published.

## Latest refinements — living room, pale blossoms, simple garden

Work now uses a faint living-room setting: window on the left, sofa on the right, and an open center. The previous enclosing ceiling/wall frame is retained only as a recovery asset. The illustration also includes subtle foliage outside the window and leaf shadows on the wall.

Nature keeps its upper-right branch composition, with pale dusty pink petals. Background-only opacity is 0.6 with 1.4px blur; foreground characters and dogs are not blurred or faded. Growing's background is reduced to one tree and low bushes, without fence, path or stones. Its standing gardener, watering can, tomato and zucchini pots remain unchanged.

Coffee reuses the existing separate `desk-plant` cutout beside the table, at scene x535, floor358, height116. It does not overlap the table, face or bubble at desktop and phone sizes. No new plant generation or raster recoloring was needed.

Three built-in image-generation calls produced versioned backgrounds; source PNGs and exact prompts are in `../../asset-output/ink-theme-backdrops-v3/`. Runtime WebPs are in `public/images/painted-motion/theme-backdrops-v3/`, totaling 112.8 KB. Coffee's v2 interior remains. Copy, motions, controls, original 3D routes and work links are unchanged. Local preview only.

Verified all four themes at 1440px, 390px and 320px, including image loading, background-to-circle alignment, foreground preservation, café plant clearance and background-only cherry blur/opacity. No overflow, failed requests or page errors. Build passed; preview returned HTTP 200. No screenshots, recording or publishing.

## Previous background direction — quiet, theme-specific settings

The user rejected the enormous tomato/vegetable backdrop, then clarified four backgrounds: a backyard for Growing, cherry blossoms entering from the top right for Nature, faint café interior structure for Coffee, and very light gray room ceiling/walls for Work. The briefly explored shared mountain silhouette is superseded, not used.

Each setting is a separate ink-drawn background. It occupies the viewport from the top down to the back edge of the circular floor, measured from the actual responsive base. Foreground people, dogs, furniture, devices and pots remain independent and unchanged. No enlarged hobby objects or duplicate edge paintings are used as background decoration. Copy, original 3D version, scene motion and Skip to work remain.

Direct theme labels may now interrupt a transition, so a fast selection isn't silently ignored. Keyboard focus stops autoplay but allows the selected scene's own action to run; explicit Pause and reduced motion still stop motion. This avoids the Work and Growing scenes appearing unfinished when selected by keyboard.

New background provenance is saved outside the Site in `../../asset-output/ink-theme-backdrops-v2/`. Runtime files are in `public/images/painted-motion/theme-backdrops-v2/`. Retain earlier background assets for recovery, but do not request them at runtime.

Verified all four settings/foreground scenes at 1440px, 390px and 320px: backdrop ends above the circular base, no overflow, all images load, and old oversized backgrounds are not requested. Fast direct theme selection and keyboard-driven Work animation passed. Build passed. Runtime backgrounds total 146 KB. No screenshots, recording, or publishing.

## Current combined drawing update — September 13

The user requested the four themes combined with motion and clarified that brush touch belongs in the dark ink outlines, not repeated paint marks across every surface. They explicitly approved removing the white paper backgrounds locally.

- `InkLayerScenes.jsx` and its CSS now replace the mounted `PaintedActors3D` renderer on this route only. The previous renderer is retained for recovery. This is layered 2D drawing with slight stage depth, not another shaded 3D rendering.
- 21 independent alpha cutouts: ten character/pose images, eight new props, and three reused coffee-v2 props. Characters, furniture, devices, dogs, can and pots can overlap cleanly. No full-theme flattened bitmap is used for actors.
- Coffee starts first, seated behind the table, with a small sipping gesture. Work switches from a standing idea pose to seated typing. The cream dog walks before the dark dog; both then sit facing forward. Gardening stays standing, with a can pivot anchored under the fingers and water following its spout. Heads, hands, dog legs/tails, and foliage use separately clipped parts of the original art.
- The logo stays skipped. Copy, bubbles, circular floor, outdoor-only viewport scenery, work link, scene order, autoplay/manual controls, pause, keyboard support and reduced-motion behavior remain. The coffee/garden bubbles were brought nearer to the new figure positions.
- Scene changes use a short horizontal exit/entrance, with no skew or spinning characters. The motion clock pauses instead of resetting. Reduced motion presents static seated/settled poses and permits manual scene selection.
- Runtime cutouts total approximately 1.55 MB in alpha WebP; no new dependency or remote runtime service. Original extracted PNGs and exact built-in prompts are saved in `../../asset-output/ink-motion-v4/`.

Verification: build passed; all assets decoded; all four scenes and wraparound, independently timed dog phases, pause/resume and reduced-motion were checked in an isolated browser without screenshots/recording. No horizontal overflow or cut-off object bounds at 390px and 320px. Local dark-background asset inspections confirmed transparency and intact light interiors.

Review limitation: character fills still retain some color-wash variation and dog coats are more textured than the restrained ink reference. This is a moving draft for visual review, not final authored character animation. See the asset README for full prompt provenance and caveats.

## Previous full-body model update — superseded

- Background cleanup: Coffee and Work now have plain backgrounds, with only their existing animated people/objects on the circular stage. Their decorative windows, city views, lamps, boards and counters are neither displayed nor preloaded. Nature and Growing retain the requested outdoor scenery. Removed backgrounds are kept as files for recovery, not deleted. Transitions to a plain scene explicitly clear the previous outdoor background.

- Ink-led reference correction: the four viewport backgrounds now use the darker `background-ink-*.webp` versions, based on the user's supplied grape painting. Strong black brush contours and pooled ink carry the image; diffused muted color is secondary. Full prompt set and saved artwork links are in `design-notes/ink-led-backdrops.md`. Original pastel assets remain available. The existing character rigs now use deeper black contours/hair and soft internal pigment variation without reducing opacity; the opening mark is charcoal-black only on this route.

- Viewport correction: the scenery is now fixed to all four viewport edges, with a complete full-viewport painting behind the copy and stage. Removed the lower mobile offsets and opaque copy panel. Portrait screens preserve the illustrated outer edges at full viewport height; scrolling enlarged text does not move the backdrop into a bottom panel.

- The cropped raster actors described in the historical notes below have been replaced by `PaintedActors3D`: the original complete, articulated character and object models. The approved painting remains a local visual reference, not a displayed crop.
- Solid muted celadon, rose, tan and ivory fills keep the Korean drawing direction. Opaque, pressure-varying contour strokes provide the brush touch; body opacity is not used as a pigment effect. A restrained form-value change adds depth without cast shadows or gloss.
- Coffee uses the original attached-hand sip. Work starts standing with an idea, then turns, sits and types. Gardening remains standing, tipping the watering can with attached arms and falling water. The park reuses independently timed dog walks, sits and tail wags, with both people tracking the dogs before facing forward.
- Cherry tree and path geometry are removed from the park actor set. The cherry blossoms and other environmental scenery belong exclusively to the full-page background. Only the bench, full-body couple and two dogs occupy the circular floor.
- The low front-view camera projects into the same coordinates as the persistent circular base. Framing is calculated over complete motion envelopes, not a single cropped pose, so heads and feet stay inside the canvas throughout every action.
- The page keeps its exact headline, introduction, personal-mark opening, bubble sentences, circular floor, local work link and carousel controls. One renderer is reused across all scenes; no new dependencies or remote services were added.
- Pause freezes the character clock rather than resetting the pose. Manual scene navigation remains available while paused. Reduced motion uses still poses and no autoplay. Keyboard focus and hidden tabs pause the clock.

Verification: local build; isolated no-capture browser checks for all four scenes and wraparound; head/foot framing sampled through each motion; independent dog timing; no cherry geometry in the stage; solid material opacity; full-page backdrop separation; mobile alignment; pause and manual navigation. No screenshots or recordings.

## Historical artwork direction and provenance

The final preview reuses the approved image from the preceding conversation **without repainting or changing its pixels**. Saved locally at `public/images/painted-motion/approved-artwork.png` (887 × 1774).

Original source: `/Users/ahwoncho/.codex/generated_images/01a059d8-f224-7081-aefb-10d041a287d6/exec-7ce0974c-5258-4486-b034-542f82a653cf.png`.

That reference was made with built-in image generation from Ahwon's earlier character references: original rounded 3D character faces, hair, outfits and objects, translated to a Korean brush-painted finish, keeping four scenes and the existing text. This turn did not change those approved designs.

Four additional built-in layer-sheet requests were attempted. They returned baked-in checkerboards rather than alpha and were rejected. They are not copied into the project or used by the app. Their exact prompts and validation remain outside the Site at `/private/tmp/painted-layer-sheet-prompts.md` and `/private/tmp/painted-layer-sheet-validation.md`.

## Previous flat-layer implementation (superseded)

- Ordinary SVG image viewports select illustrated regions of the approved raster. Logo geometry reuses the existing personal-mark data; no new illustrated SVG assets were drawn.
- CSS depth planes, a small pointer-driven perspective change and restrained camera drift create 2.5D depth. No new renderer, service, package or recurring cost.
- Local transforms add breathing, a slight coffee/work/watering lean, branch movement, and separately timed dog movement. These are illustrated-layer motions, not fully rigged characters, articulated walking or actual cup-to-mouth animation.
- Coffee opens first. Scenes advance automatically, or with wheel gestures over the artwork, horizontal swipes, arrow keys, previous/next buttons and scene labels.
- Clicking the artwork or Skip to work uses the existing local `5175/work2` handoff in development and `/work` in production.
- Pause stops local motion and automatic changes. Reduced-motion preference removes entrance/camera/local motion and autoplay. Keyboard focus temporarily pauses autoplay. Hidden tabs suspend animation via the page state.
- The original headline, introduction, Microsoft context and four bubble sentences are preserved.
- The opening personal mark now uses solid, pressure-varying brush-contour ribbons along the existing master paths. Drawing masks reveal the ink; they do not fade its color. Its rings and connectors are unchanged.
- A persistent circular base sits beneath every scene and remains in place during carousel changes. Its low-angle ellipse follows the earlier circular-stage concept.
- Browser-applied layer-edge fading, multiply blending and the page-wide texture overlay were removed. Illustrated layers render at full opacity; the brush treatment on the opening logo is in its contours.
- Related scenery now belongs to a full-page background layer, outside the circular set: café window/counter, studio window/pinboard, trees/cherry blossoms, and garden foliage/trellis. The center stays clear for the existing copy and actors. The park's old on-stage branch is omitted once its page background loads.
- Backgrounds are pinned to both viewport edges, including on mobile, instead of being clipped to the 940px stage or center-cropped out of view. They change with the active theme and use full opacity.

## Full-page background assets

Four built-in image-generation requests, one per theme, with no retries. The owner inspected all four outputs before integration; exact prompts and their small visual deviations are in `design-notes/painted-backdrop-prompts.md`. All are opaque, 1586 × 992. Original outputs were staged at `/private/tmp/painted-backdrops.QOx69u/`. WebP conversion only; no creative pixel edits.

Project assets:

- `public/images/painted-motion/background-coffee.webp` — 34,764 bytes.
- `public/images/painted-motion/background-work.webp` — 31,500 bytes.
- `public/images/painted-motion/background-nature.webp` — 23,764 bytes.
- `public/images/painted-motion/background-garden.webp` — 52,342 bytes.

The images are local static assets, preloaded once and cached by the browser. No new dependency or external runtime service is required. No source artwork, headline, personal mark, people, dogs, or circular-base geometry was changed in this update.

## Verification

Build and no-capture browser checks cover asset loading, all four scenes plus wraparound, wheel advance, initial copy/mark, mobile width, 200% root text enlargement, movement, pause and runtime errors. No screenshots or screen recordings are used.

## Previous flat-layer limitation (resolved by full-body models)

This is a lightweight moving direction study, not a final 3D character animation. The approved artwork's pale paper remains part of the source raster; no feathered transparency is used as a brush effect. Production-grade articulation would benefit from deliberately authored transparent body/arm/head layers; none of the failed transparency outputs are used as a substitute.
