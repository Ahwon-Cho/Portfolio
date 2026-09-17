// Gentle articulation of the supplied cutouts, not newly drawn characters.
// u/v are normalized to each alpha-cropped image, with v measured from top.
const smooth = (x, a, b) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const band = (x, a, b, c, d) => smooth(x, a, b) * (1 - smooth(x, c, d))
const region = (u, v, x, y) => band(u, ...x) * band(v, ...y)
const pulse = (t, a, b, c, d) => band(t, a, b, c, d)

export function createActorMotion(mesh, name, width, height) {
  const layers = []
  const add = (mask, pose) => layers.push({ mask, pose })
  if (name === 'person') {
    // Cup and both hands lift together; elbows and legs remain in place.
    add((u, v) => region(u, v, [.12, .25, .68, .80], [.22, .28, .39, .47]),
      t => ({ dy: height * .026 * pulse(t, .25, 1.15, 1.75, 2.95) }))
  } else if (name === 'work-person') {
    // The mouse is under the viewer-left hand. No typing or chair rocking.
    add((u, v) => region(u, v, [.13, .24, .43, .51], [.42, .47, .54, .60]),
      t => ({ dx: width * (.012 * pulse(t, .25, .6, 1.0, 1.35) - .009 * pulse(t, 1.9, 2.3, 2.8, 3.15)),
        dy: -height * .0015 * pulse(t, .85, .94, .99, 1.10) }))
  } else if (name === 'nature-person-bench') {
    // The bench shares this image: every vertex at/below v=.40 stays fixed.
    add((u, v) => region(u, v, [.20, .33, .67, .78], [-.1, 0, .29, .40]),
      t => ({ angle: .012 * Math.sin(t * 1.15), pivot: [.50, .32] }))
    add((u, v) => (band(u, .19, .25, .34, .40) + band(u, .59, .64, .72, .79)) * band(v, .08, .18, .31, .40),
      t => ({ dx: width * .004 * Math.sin(t * 1.7 + .6) }))
  } else if (name === 'nature-bichon') {
    add((u, v) => (1 - smooth(u, .17, .31)) * band(v, .42, .49, .69, .80),
      t => ({ angle: .10 * Math.sin(t * 7.1) * pulse(t % 4.1, .05, .3, 1.75, 2.05), pivot: [.30, .73] }))
  } else if (name === 'nature-cocker') {
    add((u, v) => smooth(u, .74, .85) * band(v, .64, .72, .88, .94),
      t => ({ angle: .13 * Math.sin(t * 5.6 + 1.3) * pulse((t + 1.2) % 4.7, .15, .45, 2.5, 2.9), pivot: [.75, .845] }))
  } else if (name === 'growing-person') {
    // Can and hands tilt as one area, blending into sleeves, not the legs.
    add((u, v) => region(u, v, [.02, .13, .55, .69], [.29, .35, .54, .59]),
      t => ({ angle: .027 * Math.sin(t * 1.35), pivot: [.46, .40] }))
    add((u, v) => (1 - smooth(u, .11, .19)) * band(v, .53, .55, .67, .70),
      t => ({ dy: -height * .005 * (1 + Math.sin(t * 6.3)) / 2 }))
  } else if (['palm', 'work-plant', 'nature-tree', 'growing-tomato', 'growing-zucchini'].includes(name)) {
    const phase = name.length * .73
    // Foliage only; pot bases and lower trunks stay planted on the page.
    add((u, v) => (1 - smooth(v, .2, .76)) * (1 - v),
      t => ({ dx: width * .006 * Math.sin(t * 1.55 + phase) }))
  }
  if (!layers.length) return null
  const geometry = mesh.geometry, positions = geometry.attributes.position
  const original = positions.array.slice(), uv = geometry.attributes.uv
  for (const layer of layers) {
    layer.weights = Float32Array.from({ length: positions.count }, (_, i) => layer.mask(uv.getX(i), 1 - uv.getY(i)))
  }
  let lastStrength = 0
  return {
    measure() {
      let maxOffset = 0, anchoredOffset = 0, signature = 0
      for (let i = 0; i < positions.count; i++) {
        const dx = positions.getX(i) - original[i * 3], dy = positions.getY(i) - original[i * 3 + 1]
        const offset = Math.hypot(dx, dy)
        maxOffset = Math.max(maxOffset, offset)
        if (layers.every(layer => layer.weights[i] === 0)) anchoredOffset = Math.max(anchoredOffset, offset)
        signature += dx * (i + 1) + dy * (i + 7)
      }
      return { maxOffset, anchoredOffset, signature }
    },
    apply(age, strength) {
      if (!strength && !lastStrength) return
      lastStrength = strength
      const poses = layers.map(layer => layer.pose(Math.max(0, age - 2.5)))
      for (let i = 0; i < positions.count; i++) {
        const x = original[i * 3], y = original[i * 3 + 1]
        let dx = 0, dy = 0
        for (let j = 0; j < layers.length; j++) {
          const weight = layers[j].weights[i] * strength
          if (!weight) continue
          const pose = poses[j]
          dx += (pose.dx || 0) * weight; dy += (pose.dy || 0) * weight
          if (pose.angle) {
            const px = (pose.pivot[0] - .5) * width, py = (1 - pose.pivot[1]) * height
            const a = pose.angle * weight, c = Math.cos(a), s = Math.sin(a)
            dx += (x - px) * (c - 1) - (y - py) * s
            dy += (x - px) * s + (y - py) * (c - 1)
          }
        }
        positions.setXYZ(i, x + dx, y + dy, original[i * 3 + 2])
      }
      positions.needsUpdate = true
    },
  }
}
