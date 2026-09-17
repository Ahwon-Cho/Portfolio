# Painted object layers — direction locked, September 13

## Current clarification — ink outlines, not all-over paint marks

The user clarified that the v3 surface treatment still reads as watercolor/gouache. Keep the selected illustration's rounded character identity and outfits, but do not copy repeated paint dabs across every surface. Use pressure-varied dark ink contours and quieter muted color. The user explicitly approved local white-background removal on September 13.

`/ink-motion` now mounts `InkLayerScenes`, using 21 genuinely transparent independent objects. The old `PaintedActors3D` file is retained but is no longer mounted here. All four themes are combined and moving; `/drawing-study.html` is preserved as the earlier static comparison. Logo remains skipped. See `../../asset-output/ink-motion-v4/README.md` for assets, exact prompts, verification and remaining art limitations. No deployment.

## Previous clarification — selected illustration overrides earlier style interpretation

The user supplied `codex-clipboard-fad82d32-3f9a-40b8-b132-35e87e9e6edf.png` after saying "this one." Use that specific rounded, dry-brush illustrated portfolio as the controlling character/style reference, not the more realistic coffee-v2 drawings. Keep its green hoodie, tan trousers, gentle oval-eyed faces, soft painted volume and dense brush-edge texture. Continue separating objects for eventual independent movement. Opening logo remains skipped. See `../../drawing-studies/coffee-v3/README.md` for this new drawing pass.

The historical notes below describe the earlier direction and unresolved layering work; where their visual interpretation conflicts with the newly selected illustration, the new attachment takes precedence.

User correction: each object must be a separate painted layer. Keep Korean drawing as the visual medium. Borrow depth, content and choreography from the original 3D, not its rendered models. Do not flatten a theme into one picture or reinterpret it as shaded 3D.

## Art references

- Characters/objects: supplied Korean genre painting and animal/bird painting. Fine dark ink contours, hand-painted irregularity, flat muted pigment, simplified expressive shapes. Not generic watercolor/anime or clay rendering.
- Viewport: supplied grayscale mountain/foliage painting, used lightly with open space. No unrelated room props. Preserve the circular base separately.
- Preserve copy, four themes, controls and original routes.

## Layer and motion requirements

- Coffee: chair, seated body, head, upper arm, forearm/hand, red mug, table, steam. Mug must stay attached to the hand through the sip.
- Work: character with seated/standing poses, head, articulated arms/hands; separate desk, chair, monitor, laptop, plant. Use drawn pose changes, not distortion of one static figure.
- Park: bench, each person separately, independently moving heads; each dog with body, head, tail, walk poses and seated pose. Stagger their actions; never slide two identical sprites together. Cherry tree belongs outside the circle at viewport level.
- Garden: standing body, head, arm/hand, can, water; separate tomato and zucchini pots, foliage and front rims. Feet remain planted and water follows the spout.
- Reset motion while a scene is hidden. Honor pause and reduced-motion. Keep one selected theme visible and use slight depth/layer offsets rather than dramatic skew.

## Historical pilot result — superseded by approved local extraction

One single-character pilot was generated with the built-in image tool. It produced a 1024 × 1536 RGB PNG with a baked checkerboard, no alpha channel. It also leaned too far toward contemporary watercolor illustration. Rejected: not copied to public assets and not mounted in the page. Do not generate a full batch from this pilot.

Original rejected output: `/Users/ahwoncho/.codex/generated_images/01a09e4f-95fb-71a2-97db-3fdbc09f01c7/exec-8b545146-b716-4ad9-ab6a-ffd176f79b53.png`

Exact pilot prompt and validation: `/private/tmp/ahwon-painted-character-pilot-prompt.md`

No preview renderer change was made in this turn. `PaintedActors3D` still needs replacement, but must not be replaced with fake-transparent or flattened assets. Next: obtain permission to use a local background-removal workflow for individual cutouts, establish the reference-faithful painted style, then build independently articulated layers.
