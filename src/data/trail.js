import workImg from '../img/landing-work.png'
import surfaceImg from '../img/surface-it-toolkit.png'
import gpuImg from '../img/thumb-gpu.png'
import meImg from '../img/landing-me.png'
import artImg from '../img/art07.png'

export const TRAIL_LENGTH = 52

export const trailStops = [
  {
    chapter: '01',
    label: 'Work Garden',
    sceneLabel: 'Selected work',
    description: 'Selected UX and visual design projects.',
    proof: 'Microsoft · Blue Cross NC · Home Depot',
    mission: 'Choose a path through the work.',
    clue: 'Prioritize',
    clueNote: 'Lead with impact, not chronology.',
    tint: '#dfe9df',
    href: '/work',
    progress: 0.14,
    worldZ: 14.3,
    x: -1.9,
    r: 0.76,
    dy: 8,
    ph: 0,
    img: workImg,
  },
  {
    chapter: '02',
    label: 'Systems Pavilion',
    sceneLabel: 'Surface IT Toolkit',
    description: 'A fragmented enterprise suite rebuilt as one clear system.',
    proof: 'Sole designer · Shipped April 2024',
    mission: 'Turn scattered tools into one visual language.',
    clue: 'Unify',
    clueNote: 'Systems make complexity feel coherent.',
    tint: '#e7e4d7',
    href: '/project/surface-it-toolkit',
    progress: 0.34,
    worldZ: 24.7,
    x: 1.72,
    r: 0.7,
    dy: -20,
    ph: 1.5,
    img: surfaceImg,
  },
  {
    chapter: '03',
    label: 'Flight Lab',
    sceneLabel: 'GPU Flight',
    description: 'A GPU dashboard I design and build with an engineer.',
    proof: 'Product design + code · 2026',
    mission: 'Make the idea real enough to test.',
    clue: 'Prototype',
    clueNote: 'A working idea reveals what a mockup cannot.',
    tint: '#dce7e8',
    href: '/project/gpuflight',
    progress: 0.55,
    worldZ: 35.6,
    x: -1.68,
    r: 0.67,
    dy: 2,
    ph: 3,
    img: gpuImg,
  },
  {
    chapter: '04',
    label: 'Personal Studio',
    sceneLabel: 'About Ahwon',
    description: 'The person, principles, artwork, and curiosity behind the work.',
    proof: '10+ years · MICA · Always learning',
    mission: 'Meet the curiosity behind the craft.',
    clue: 'Observe',
    clueNote: 'The smallest details often change the direction.',
    tint: '#eadfd9',
    href: '/about',
    progress: 0.76,
    worldZ: 46.5,
    x: 1.72,
    r: 0.72,
    dy: -10,
    ph: 4.2,
    img: meImg,
  },
  {
    chapter: '05',
    label: 'The Lookout',
    sceneLabel: 'Say hello',
    description: 'A quiet place to start the next conversation.',
    proof: 'Email · LinkedIn · Résumé',
    mission: 'Bring the clues together and say hello.',
    clue: 'Connect',
    clueNote: 'Good work begins with a shared question.',
    tint: '#dce4dd',
    href: '/contact',
    progress: 0.96,
    worldZ: 56.9,
    x: -1.55,
    r: 0.64,
    dy: 10,
    ph: 5.4,
    img: artImg,
  },
]

export function nearestTrailStop(progress) {
  return trailStops.reduce((nearest, stop) => (
    Math.abs(stop.progress - progress) < Math.abs(nearest.progress - progress)
      ? stop
      : nearest
  ), trailStops[0])
}
