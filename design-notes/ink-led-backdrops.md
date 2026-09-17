# Ink-led Korean drawing direction — local preview

Four built-in image-generation edits use the supplied grape painting as a style reference. The reference itself was not changed. No CLI/API fallback, no retries. Original pastel background assets are preserved.

Saved artwork (WebP format conversion only; no creative pixel edits):

- [coffee background](</Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-ink-coffee.webp>)
- [work background](</Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-ink-work.webp>)
- [nature background](</Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-ink-nature.webp>)
- [garden background](</Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-ink-garden.webp>)

Visual inspection: black pressure-variable strokes and dry-brush gaps are substantially stronger; color is restrained and softly feathered. Existing subject placements and a spacious center are retained. Nature is cleaner and more linear than the grape reference; garden has the closest pooled-ink foliage. Coffee and work retain their existing small distant building silhouettes, not a new personal location. No text, signatures, extra people, or stage were generated.

Local 3D treatment: deeper ink contours and hair, varied nib width, denser foliage ink accents, soft internal color diffusion, no lowered body opacity or page-wide blur. Mark geometry, full-body rigs, motion, copy and viewport layout remain unchanged. The opening mark is rendered in charcoal-black on this route only.

## Exact prompt set

# Ink-led viewport backdrop prompts

Mode: built-in image_gen. One edit request per scene; no retries or variants.

## Generated outputs

- Coffee (1585 × 992 PNG): /Users/ahwoncho/.codex/generated_images/01a09e44-f65f-7123-b6dd-d1f000a2f938/exec-13fa1388-6f9c-477f-b56a-62b1d00e0593.png
- Work (1586 × 992 PNG): /Users/ahwoncho/.codex/generated_images/01a09e44-f65f-7123-b6dd-d1f000a2f938/exec-634f4a16-9157-4c51-ab08-1d838afcc763.png
- Nature (1586 × 992 PNG): /Users/ahwoncho/.codex/generated_images/01a09e44-f65f-7123-b6dd-d1f000a2f938/exec-82b7885f-b490-4d28-90fd-ea6847c94748.png
- Garden (1586 × 992 PNG): /Users/ahwoncho/.codex/generated_images/01a09e44-f65f-7123-b6dd-d1f000a2f938/exec-14bd2e8f-3a4f-4250-8b08-3ca02cea728c.png

Assessment: All four now have visibly pressure-varying dark brushwork, dry-brush breaks and small feathered color areas, with original scene subjects retained. All have near-white open centers, cropped edge compositions and no text, signature, seals, people or UI. Coffee and work read as brush-painted architecture; garden most directly reflects the reference's pooled black foliage and soft green pigment. Some foliage/counter tips reach inward farther than the original target and the nominal center-65-percent guide, especially garden; all retain a large clean central stage area. No variants, retries, integration changes or Site checkout edits were made.

## coffee

Inputs in order:

1. Style reference: /var/folders/td/_w9cqhsx5mb5g4vddzgrtmp80000gn/T/codex-clipboard-b4bef6fd-49b8-4f16-acd2-4a98227c1efa.png
2. Edit target: /Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-coffee.webp

Exact prompt:

```text
Use case: style-transfer.
Asset type: one full-viewport landscape background painting for an interactive portfolio.
Input images: Image 1 is the Korean ink grape painting, used ONLY as the style reference for ink character, brush pressure, dry-brush breaks and diffused pigment. Do not copy its grapes, inscription, signature or seal. Image 2 is the EDIT TARGET: the existing coffee scene. Its subject content, wide framing and broad edge placements must remain recognizable.
Primary request: Restyle Image 2 as a sparse modern Korean ink drawing led by expressive BLACK BRUSH marks with small areas of softly diffused color, directly following Image 1's contrast between vivid dark ink and feathered pigment. The current generic pastel look must become an ink-led painting.
Scene and invariants: Preserve the cafe scene from Image 2: the tall cropped arched window and leafy plant along the far left, a cup and saucer on its lower-left sill; the hanging lamp, cropped blank menu board, plant, grinder and cup on the cropped counter at the far right. Use confident broken black brush strokes for the window and counter edges, and a few pooled black marks among the existing leaves. Keep all objects at their original broad edge placements. The menu board must contain no lettering or chalk marks.
Style/medium: Charcoal-black calligraphic strokes that visibly vary from thick to hairline; energetic but economical contours with dry crisp edges and visible broken-bristle gaps; select solid pooled black foliage or branch marks. Beside these, small muted celadon, indigo and faded-rose color blooms diffuse gently with feathered pigment edges. Black drawing carries the forms; soft color is a restrained accent. Keep silhouettes sparse and modern, with substantial unpainted paper between marks.
Composition/framing: Preserve the edit target's approximately 8:5 landscape proportions, ideally 1600 by 1000 pixels. Use the ENTIRE viewport, with existing subjects cropped naturally by the left and right outer canvas edges and distributed vertically as in Image 2. Keep the airy CENTER 65% entirely blank and near-white from top to bottom for separately added headline, full-body animated characters and circular stage. Do not draw those future overlays. Near-white ground, without an aged yellow cast, with at most extremely subtle paper grain.
Avoid: uniformly thin vector outlines, cartoon black stickers, uniformly faint pastel art, all-over watercolor wash, dense foliage filling the center, 3D modeling or shading, cast shadows, single-point perspective, horizon or floor lines crossing the center, any bottom panel or square or oval vignette, outer frame or border, text, handwriting, signatures, seals, people, dogs, circular platforms, page UI, new props or decorative grapes. Change only the painting style; preserve the specified subjects and spacious layout. Return one finished image.
```

## work

Inputs in order:

1. Style reference: /var/folders/td/_w9cqhsx5mb5g4vddzgrtmp80000gn/T/codex-clipboard-b4bef6fd-49b8-4f16-acd2-4a98227c1efa.png
2. Edit target: /Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-work.webp

Exact prompt:

```text
Use case: style-transfer.
Asset type: one full-viewport landscape background painting for an interactive portfolio.
Input images: Image 1 is the Korean ink grape painting, used ONLY as the style reference for ink character, brush pressure, dry-brush breaks and diffused pigment. Do not copy its grapes, inscription, signature or seal. Image 2 is the EDIT TARGET: the existing work scene. Its subject content, wide framing and broad edge placements must remain recognizable.
Primary request: Restyle Image 2 as a sparse modern Korean ink drawing led by expressive BLACK BRUSH marks with small areas of softly diffused color, directly following Image 1's contrast between vivid dark ink and feathered pigment. The current generic pastel look must become an ink-led painting.
Scene and invariants: Preserve the studio scene from Image 2: the tall cropped studio window with its leafy exterior view along the far left; the cropped pinboard with blank pinned papers in the upper right, and the existing foliage, stacked books and storage cabinet at the lower right. Repaint window, pinboard and cabinet edges as sparse confident broken black brush strokes. Include some pooled black foliage marks. Keep all objects at their original broad edge placements; pinned papers stay completely blank.
Style/medium: Charcoal-black calligraphic strokes that visibly vary from thick to hairline; energetic but economical contours with dry crisp edges and visible broken-bristle gaps; select solid pooled black foliage or branch marks. Beside these, small muted celadon, indigo and faded-rose color blooms diffuse gently with feathered pigment edges. Black drawing carries the forms; soft color is a restrained accent. Keep silhouettes sparse and modern, with substantial unpainted paper between marks.
Composition/framing: Preserve the edit target's approximately 8:5 landscape proportions, ideally 1600 by 1000 pixels. Use the ENTIRE viewport, with existing subjects cropped naturally by the left and right outer canvas edges and distributed vertically as in Image 2. Keep the airy CENTER 65% entirely blank and near-white from top to bottom for separately added headline, full-body animated characters and circular stage. Do not draw those future overlays. Near-white ground, without an aged yellow cast, with at most extremely subtle paper grain.
Avoid: uniformly thin vector outlines, cartoon black stickers, uniformly faint pastel art, all-over watercolor wash, dense foliage filling the center, 3D modeling or shading, cast shadows, single-point perspective, horizon or floor lines crossing the center, any bottom panel or square or oval vignette, outer frame or border, text, handwriting, signatures, seals, people, dogs, circular platforms, page UI, new props or decorative grapes. Change only the painting style; preserve the specified subjects and spacious layout. Return one finished image.
```

## nature

Inputs in order:

1. Style reference: /var/folders/td/_w9cqhsx5mb5g4vddzgrtmp80000gn/T/codex-clipboard-b4bef6fd-49b8-4f16-acd2-4a98227c1efa.png
2. Edit target: /Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-nature.webp

Exact prompt:

```text
Use case: style-transfer.
Asset type: one full-viewport landscape background painting for an interactive portfolio.
Input images: Image 1 is the Korean ink grape painting, used ONLY as the style reference for ink character, brush pressure, dry-brush breaks and diffused pigment. Do not copy its grapes, inscription, signature or seal. Image 2 is the EDIT TARGET: the existing nature scene. Its subject content, wide framing and broad edge placements must remain recognizable.
Primary request: Restyle Image 2 as a sparse modern Korean ink drawing led by expressive BLACK BRUSH marks with small areas of softly diffused color, directly following Image 1's contrast between vivid dark ink and feathered pigment. The current generic pastel look must become an ink-led painting.
Scene and invariants: Preserve the garden walk scene from Image 2: a cropped tree trunk, branches and sparse leaves at the far left; cherry tree branches and blossoms entering from the upper right; a few rocks and plants at the extreme bottom corners. Repaint trunks and branches with expressive thick-to-hairline charcoal-black strokes, dry-brush gaps and a few dense black branch or leaf marks. Give only the cherry blossoms small faded-rose pigment blooms and use restrained celadon or indigo-gray for existing foliage and rocks. Keep all subjects at their original broad edge placements.
Style/medium: Charcoal-black calligraphic strokes that visibly vary from thick to hairline; energetic but economical contours with dry crisp edges and visible broken-bristle gaps; select solid pooled black foliage or branch marks. Beside these, small muted celadon, indigo and faded-rose color blooms diffuse gently with feathered pigment edges. Black drawing carries the forms; soft color is a restrained accent. Keep silhouettes sparse and modern, with substantial unpainted paper between marks.
Composition/framing: Preserve the edit target's approximately 8:5 landscape proportions, ideally 1600 by 1000 pixels. Use the ENTIRE viewport, with existing subjects cropped naturally by the left and right outer canvas edges and distributed vertically as in Image 2. Keep the airy CENTER 65% entirely blank and near-white from top to bottom for separately added headline, full-body animated characters and circular stage. Do not draw those future overlays. Near-white ground, without an aged yellow cast, with at most extremely subtle paper grain.
Avoid: uniformly thin vector outlines, cartoon black stickers, uniformly faint pastel art, all-over watercolor wash, dense foliage filling the center, 3D modeling or shading, cast shadows, single-point perspective, horizon or floor lines crossing the center, any bottom panel or square or oval vignette, outer frame or border, text, handwriting, signatures, seals, people, dogs, circular platforms, page UI, new props or decorative grapes. Change only the painting style; preserve the specified subjects and spacious layout. Return one finished image.
```

## garden

Inputs in order:

1. Style reference: /var/folders/td/_w9cqhsx5mb5g4vddzgrtmp80000gn/T/codex-clipboard-b4bef6fd-49b8-4f16-acd2-4a98227c1efa.png
2. Edit target: /Users/ahwoncho/Documents/ChatGPT/My Portfolio/portfolio-game/public/images/painted-motion/background-garden.webp

Exact prompt:

```text
Use case: style-transfer.
Asset type: one full-viewport landscape background painting for an interactive portfolio.
Input images: Image 1 is the Korean ink grape painting, used ONLY as the style reference for ink character, brush pressure, dry-brush breaks and diffused pigment. Do not copy its grapes, inscription, signature or seal. Image 2 is the EDIT TARGET: the existing garden scene. Its subject content, wide framing and broad edge placements must remain recognizable.
Primary request: Restyle Image 2 as a sparse modern Korean ink drawing led by expressive BLACK BRUSH marks with small areas of softly diffused color, directly following Image 1's contrast between vivid dark ink and feathered pigment. The current generic pastel look must become an ink-led painting.
Scene and invariants: Preserve the vegetable garden scene from Image 2: the tomato stem, leaves and existing small fruit cluster along the far left; the zucchini foliage, single zucchini, blossom and trellis entering from the upper and far right. Keep the crops unmistakably tomato and zucchini. Repaint the stems, tendrils and trellis with expressive thick-to-hairline charcoal-black brush strokes; combine dry-brush breaks with some densely pooled black areas in existing foliage. Use a small faded-rose/red bloom for the ripe tomato and restrained celadon/indigo for the leaves and zucchini. Keep all subjects at their original broad edge placements.
Style/medium: Charcoal-black calligraphic strokes that visibly vary from thick to hairline; energetic but economical contours with dry crisp edges and visible broken-bristle gaps; select solid pooled black foliage or branch marks. Beside these, small muted celadon, indigo and faded-rose color blooms diffuse gently with feathered pigment edges. Black drawing carries the forms; soft color is a restrained accent. Keep silhouettes sparse and modern, with substantial unpainted paper between marks.
Composition/framing: Preserve the edit target's approximately 8:5 landscape proportions, ideally 1600 by 1000 pixels. Use the ENTIRE viewport, with existing subjects cropped naturally by the left and right outer canvas edges and distributed vertically as in Image 2. Keep the airy CENTER 65% entirely blank and near-white from top to bottom for separately added headline, full-body animated characters and circular stage. Do not draw those future overlays. Near-white ground, without an aged yellow cast, with at most extremely subtle paper grain.
Avoid: uniformly thin vector outlines, cartoon black stickers, uniformly faint pastel art, all-over watercolor wash, dense foliage filling the center, 3D modeling or shading, cast shadows, single-point perspective, horizon or floor lines crossing the center, any bottom panel or square or oval vignette, outer frame or border, text, handwriting, signatures, seals, people, dogs, circular platforms, page UI, new props or decorative grapes. Change only the painting style; preserve the specified subjects and spacious layout. Return one finished image.
```

