// Refined from Ahwon's own Korean-name sketch. A shared geometric master keeps
// the reusable vector and the animated 3D mark identical.
export const AHWON_MARK = {
  size: 400,
  center: 200,
  outerRadius: 160,
  strokeWidth: 10,
  color: '#2949a9',
  paths: [
    { radius: 160, start: 192, end: 534 },
    { radius: 112, start: 72, end: 174 },
    { radius: 112, start: 192, end: 294 },
    { radius: 112, start: 312, end: 414 },
    { radius: 64, start: 54, end: 414, closed: true },
    { angle: 123, from: 112, to: 136 },
    { angle: 54, from: 112, to: 160 },
    { angle: 270, from: 112, to: 136 },
    { angle: 192, from: 148, to: 160 },
  ],
}

export function getMarkPoint(path, progress) {
  const angle = (path.radius ? path.start + (path.end - path.start) * progress : path.angle) * Math.PI / 180
  const radius = path.radius ?? path.from + (path.to - path.from) * progress
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
}

// Multiple origins slowly gather momentum, then finish together in a flourish.
// These are presentation timings, not Korean stroke order.
export const MARK_WRITING_STROKES = [
  { path: 4, start: 0.55, end: 5.0 },
  { path: 0, from: 0.14, to: 1, start: 0.62, end: 5.45 },
  { path: 0, from: 0.14, to: 0, start: 0.62, end: 4.75 },
  { path: 3, from: 1, to: 0, start: 0.85, end: 5.2 },
  { path: 1, from: 1, to: 0, start: 1.0, end: 5.15 },
  { path: 2, start: 1.15, end: 5.25 },
  { path: 6, start: 2.2, end: 4.95 },
  { path: 5, from: 1, to: 0, start: 2.7, end: 5.05 },
  { path: 8, from: 1, to: 0, start: 3.1, end: 5.1 },
  { path: 7, start: 3.3, end: 5.3 },
].map((stroke) => ({ from: 0, to: 1, ...stroke }))

export const MARK_WRITING_END = Math.max(...MARK_WRITING_STROKES.map((stroke) => stroke.end))

export function getMarkWritingProgress(time, stroke) {
  const t = Math.max(0, Math.min(1, (time - stroke.start) / (stroke.end - stroke.start)))
  const gentleStart = t ** 3 * (t * (t * 6 - 15) + 10)
  // Late-peaking acceleration gives the reveal a crescendo, not a uniform
  // slow-motion playback. Both curves settle with zero speed/acceleration.
  const crescendo = t ** 7 * (36 - 63 * t + 28 * t * t)
  return Math.max(0, Math.min(1, gentleStart * 0.2 + crescendo * 0.8))
}

export function createMarkSvg() {
  const { size, center, strokeWidth, color, paths } = AHWON_MARK
  const point = ({ x, y }) => (center + x).toFixed(4) + ' ' + (center - y).toFixed(4)
  const shapes = paths.map((path) => {
    if (path.closed) return '    <circle cx="' + center + '" cy="' + center + '" r="' + path.radius + '"/>'
    const start = point(getMarkPoint(path, 0))
    const end = point(getMarkPoint(path, 1))
    const command = path.radius ? 'A ' + path.radius + ' ' + path.radius + ' 0 ' + (path.end - path.start > 180 ? 1 : 0) + ' 0 ' : 'L '
    return '    <path d="M ' + start + ' ' + command + end + '"/>'
  })
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-labelledby="title">\n'
    + '  <title id="title">Ahwon Cho — personal mark</title>\n'
    + '  <g fill="none" stroke="' + color + '" stroke-width="' + strokeWidth + '" stroke-linecap="round" stroke-linejoin="round">\n'
    + shapes.join('\n') + '\n  </g>\n</svg>\n'
}
