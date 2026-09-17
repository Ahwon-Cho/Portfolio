export const FIRST_PAGE = 4.25
export const CHAPTER_LENGTH = 8
export const SETTLED_AT = 2.5

export const chapters = [
  {
    id: 'coffee', title: 'Inspiration', floor: null, edge: '#d0cbc1',
    sentence: 'Coffee inspires me!',
    speaker: { object: 'person', x: 0, y: 1.06, side: 'left' },
    objects: [
      { name: 'chair', x: 1.94, z: -.12, height: 1.72, width: 1.5, delay: .08 },
      { name: 'person', x: 1.88, z: .015, height: 2.17, width: 1.6, delay: .24 },
      { name: 'table', x: 1.69, z: .27, height: 1.27, width: 1.49, delay: .40 },
      { name: 'palm', x: .70, z: -.27, height: 2.25, width: 1.32, delay: .56 },
    ],
  },
  {
    id: 'work', title: 'Visualization', floor: 'work', edge: '#c3aa8c',
    sentence: 'I visualize early, fail fast, and make ideas clear.',
    speaker: { object: 'work-person', x: -.18, y: .85, side: 'left' },
    objects: [
      { name: 'work-person', x: 1.57, z: -.17, height: 2.25, width: 1.55, delay: .12 },
      { name: 'work-desk', x: 1.64, z: .27, height: 1.29, width: 2.26, delay: .02 },
      { name: 'work-screens', x: 2.10, z: .32, y: 1.13, height: 1.13, width: 1.48, delay: .34 },
      { name: 'work-plant', x: .78, z: .35, y: 1.13, height: .59, width: .52, delay: .50 },
    ],
  },
  {
    id: 'nature', title: 'Healing', floor: 'nature', edge: '#909a78',
    sentence: 'I find healing and clarity in nature.',
    speaker: { object: 'nature-person-bench', x: -.15, y: .86, side: 'left' },
    objects: [
      { name: 'nature-tree', x: 2.23, z: -.48, height: 2.50, width: 2.70, delay: .03 },
      { name: 'nature-person-bench', x: 1.57, z: -.05, height: 2.03, width: 2.0, delay: .18 },
      { name: 'nature-bichon', x: .72, z: .45, height: .77, width: .91, delay: .32 },
      { name: 'nature-cocker', x: 2.43, z: .42, height: 1.05, width: .92, delay: .51 },
    ],
  },
  {
    id: 'growing', title: 'Peace of mind', floor: 'garden', edge: '#b68671',
    sentence: 'Watching things grow brings me peace of mind.',
    speaker: { object: 'growing-person', x: -.06, y: .88, side: 'left' },
    objects: [
      { name: 'growing-person', x: 1.66, z: -.14, height: 2.43, width: 1.51, delay: .03 },
      { name: 'growing-tomato', x: .83, z: .31, height: 1.60, width: 1.04, delay: .21 },
      { name: 'growing-zucchini', x: 2.45, z: .25, height: 1.05, width: 1.00, delay: .39 },
    ],
  },
]

export const DURATION = FIRST_PAGE + chapters.length * CHAPTER_LENGTH
export const chapterStart = index => FIRST_PAGE + index * CHAPTER_LENGTH
export const chapterSettled = index => chapterStart(index) + SETTLED_AT
export function chapterAt(time) {
  return Math.max(0, Math.min(chapters.length - 1, Math.floor((time - FIRST_PAGE) / CHAPTER_LENGTH)))
}
export function stageAt(time) {
  if (time < 1.35) return 'cover'
  if (time < 3.7) return 'opening'
  if (time < FIRST_PAGE) return 'open'
  const age = time - chapterStart(chapterAt(time))
  if (age < .85) return 'turning'
  return age < SETTLED_AT ? 'revealing' : 'settled'
}

export function nextStop(time) {
  const index = chapterAt(time)
  if (time < chapterSettled(index) - .03) return chapterSettled(index)
  return index < chapters.length - 1 ? chapterSettled(index + 1) : 0
}
export function previousStop(time) {
  const index = chapterAt(time)
  return index > 0 ? chapterSettled(index - 1) : 0
}
