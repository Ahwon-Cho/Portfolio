// Isolated presentation drafts. Existing project records and routes are unchanged.
// Deliberately omit disputed metrics and launch/duration claims from the review.
import surface from '../img/sit_hero1.png'
import surfaceNav from '../img/sit_hero2.png'
import surfaceIcons from '../img/sit_iconset.png'
import surfaceFlow from '../img/sit_flowchart.png'
import surfaceWire from '../img/sit_wireframe1.png'
import blueCompare from '../img/blueconnect_comparison.png'
import blueDirections from '../img/bluecross_img1.png'
import hdFinal from '../img/hd_design_comp4.png'
import hdOption1 from '../img/hd_design_comp1.png'
import hdOption2 from '../img/hd_design_comp2.png'
import hdFlow from '../img/hd_flowchart.png'
import hdTest from '../img/hd_usertest2.png'
import gpuTemplate from '../img/system03.png'
import gpuPalette from '../img/system02.png'
import gpuComponent from '../img/system01.png'
import pantryOverview from '../img/pn_screens1.png'
import pantryIteration from '../img/pn_screens2.png'
import pantryFlow from '../img/pn_userflow.jpg'
import pantryWire from '../img/pn_wire4.png'
import costCover from '../img/bluecross-cost-estimator.png'
import costFlow from '../img/bc_userflow.png'
import costWire from '../img/bc_wireflow.png'
import costFinal from '../img/bc_final.png'

// Crops are presentation windows onto the original assets, never fabricated UI.
const crop = (width, x, y, w, h) => ({ width, x, y, w, h })
const art = (src, alt, window, caption) => ({ src, alt, crop: window, caption })
const surfaceArt = art(surface, 'Surface IT Toolkit Data Eraser screen', crop(1920, 0, 0, 1920, 1100))
const blueArt = art(blueCompare, 'Blue Connect redesigned home screen', crop(1920, 620, 280, 475, 1120))
const hdArt = art(hdFinal, 'Protection-plan drawer showing plans linked to purchases', crop(757, 6, 0, 750, 1110))
const gpuArt = art(gpuTemplate, 'GPU Flight fleet table with a device inspector', crop(3529, 492, 390, 2985, 1435))
const pantryArt = art(pantryIteration, 'Pantry Note add-items screen with search and popular foods', crop(1600, 495, 1310, 620, 1035))
const costArt = art(costCover, 'Blue Cross NC Advance EOB form design', crop(1600, 386, 175, 830, 460))

export const previewProjects = [
  {
    slug: 'surface-it-toolkit', title: 'Surface IT Toolkit', client: 'Microsoft',
    discipline: 'Product design · Visual systems', status: 'Released · April 2024',
    role: 'Sole UX, UI & visual designer', time: 'Sep 2023 – Apr 2024', theme: 'surface',
    hook: 'Many tools. One clear experience.',
    summary: 'Bringing Surface tools together through a shared navigation model, a reusable UI system, and custom visual assets.',
    cover: surfaceArt, detail: art(surfaceIcons, 'Custom Surface navigation icons', crop(1200, 345, 25, 820, 210)),
    context: 'IT administrators were moving between separate tools to configure, erase, and recover Surface devices. The redesign brought those workflows into one Windows application.',
    contribution: 'I owned the experience from information architecture and wireframes through high-fidelity UI, custom icons, and handoff, working with two PMs and four engineers.',
    decisions: [
      { label: '01 / Structure', title: 'Start with the task, not the tool.', text: 'I audited the legacy workflows with PMs, then reorganized the tools under a shared navigation model. The flow map gave design and engineering a reference before individual screens were finalized.', images: [art(surfaceFlow, 'Surface toolkit user-flow map', null, 'A shared map of the toolkit workflows.')] },
      { label: '02 / Interaction', title: 'Make the next action clear.', text: 'The Data Eraser entry separates creating a USB from generating a certificate. Each action has its own label, explanation, and visual cue, within the same page structure.', images: [art(surface, 'Data Eraser entry screen', crop(1920, 490, 85, 1320, 980), 'Two distinct tasks, presented as explicit choices.'), art(surfaceWire, 'Data Eraser wireframe exploration', null, 'The underlying flow before the visual layer.')], layout: 'pair' },
    ],
    craft: { title: 'Small details. A shared language.', text: 'I created custom icons for the toolkit’s specific tasks and used Figma variables to manage light and dark themes. Visual decisions became reusable parts of the product, rather than one-off screen treatments.', images: [art(surfaceIcons, 'Custom icon set for Surface IT Toolkit', null, 'Navigation icons and larger task illustrations, designed for the same product family.'), art(surfaceNav, 'Additional Surface toolkit interface', null, 'The visual language applied within the toolkit.')], layout: 'stack' },
    result: 'The redesigned toolkit was released in April 2024. The component library and theme work provided a foundation for continued iteration.',
    lesson: 'A system can carry a design decision further than a single polished screen.',
  },
  {
    slug: 'blue-connect-mobile-app', title: 'Blue Connect', client: 'Blue Cross NC',
    discipline: 'Visual design · Mobile', status: 'Tested redesign proposal', role: 'Visual interface designer', time: '2022', theme: 'blue',
    hook: 'A clearer picture of your coverage.',
    summary: 'A mobile home-screen redesign that uses hierarchy, grouping, and restrained color to make insurance information easier to scan.',
    cover: blueArt, detail: art(blueCompare, 'Benefits and coverage detail', crop(1920, 632, 1020, 450, 350)),
    context: 'The existing home screen mixed policy information, account status, and navigation. People with limited insurance knowledge needed a clearer starting point.',
    contribution: 'As the sole visual interface designer, I explored three directions, refined the visual hierarchy, and built a Figma component library with auto-layout.',
    decisions: [
      { label: '01 / Exploration', title: 'Three ways to organize the same information.', text: 'The explorations tested different balances of navigation, plan information, and personality within the brand palette.', layout: 'triptych', images: [
        art(blueDirections, 'Blue Connect direction one', crop(1920, 37, 134, 597, 1640), '01 — Illustrated greeting, prominent navigation.'),
        art(blueDirections, 'Blue Connect direction two', crop(1920, 658, 134, 597, 1640), '02 — A compact action grid and quieter header.'),
        art(blueDirections, 'Blue Connect direction three', crop(1920, 1281, 134, 599, 1640), '03 — Plan information brought to the foreground.'),
      ] },
      { label: '02 / Hierarchy', title: 'Give actions and information different jobs.', text: 'The redesigned home separates frequently used actions from plan details. Benefits are grouped by plan, and progress bars make deductible and out-of-pocket amounts more scannable.', layout: 'pair', images: [
        art(blueCompare, 'Previous Blue Connect home screen', crop(1920, 72, 280, 480, 1650), 'Before — Navigation and policy details compete.'),
        art(blueCompare, 'Redesigned Blue Connect home screen', crop(1920, 620, 280, 475, 1650), 'Proposal — Quick actions, then a consistent plan hierarchy.'),
      ] },
    ],
    craft: { title: 'Clarity, without relying on more color.', text: 'Spacing, type weight, dividers, and a consistent icon grid establish the hierarchy. Blue anchors the brand; warmer accents are reserved for specific information.', layout: 'pair', images: [art(blueCompare, 'Quick-action icon grid', crop(1920, 632, 429, 450, 269), 'A compact, labeled set of everyday actions.'), art(blueCompare, 'Coverage information with progress bars', crop(1920, 632, 1020, 450, 350), 'A repeatable treatment for coverage information.')] },
    result: 'The visual directions were evaluated through unmoderated assessments and interviews. The selected redesign remained a proposal; it was not implemented because of business decisions.',
    lesson: 'Visual hierarchy is part of the interaction—not a layer added after the UX is finished.',
  },
  {
    slug: 'home-depot-protection-plan', title: 'Protection, after purchase', client: 'The Home Depot',
    discipline: 'UX design · E-commerce', status: 'Design & handoff', role: 'UX designer', time: '2023', theme: 'depot',
    hook: 'A second chance to protect a purchase.',
    summary: 'Designing a post-purchase protection-plan experience across order pages, product types, and mixed-item scenarios.',
    cover: hdArt,
    context: 'Customers who skipped a protection plan at checkout needed a way to add one afterward. The experience had to work from both the Thank You and Order Details pages.',
    contribution: 'I mapped the scenarios, explored interaction models, tested the designs, and prepared the experience for engineering handoff.',
    decisions: [
      { label: '01 / Reframing', title: 'One good screen was not enough.', text: 'The first General Merchandise solution did not cover the other product scenarios. I stepped back to map General Merchandise, Major Appliances, and mixed orders before refining the UI.', images: [art(hdFlow, 'Protection-plan scenario flowchart', null, 'The complete scenario map became a shared reference.')] },
      { label: '02 / Interaction', title: 'Keep the plan connected to the purchase.', text: 'I explored different selection and action patterns. The selected design keeps each protection plan beside its associated item and provides feedback when a plan is added.', layout: 'triptych', images: [art(hdOption1, 'Protection-plan first design option', null, 'Exploration 01'), art(hdOption2, 'Protection-plan second design option', null, 'Exploration 02'), art(hdFinal, 'Selected protection-plan design', null, 'Selected direction')] },
    ],
    craft: { title: 'Make selection—and its result—visible.', text: 'The checkbox, item details, and confirmation message work together within the drawer. The orange action treatment remains consistent with the retail brand.', layout: 'pair', images: [art(hdFinal, 'Protection-plan selection and confirmation', crop(757, 6, 97, 744, 372), 'Selection, item context, and “Added to cart” in one place.'), art(hdTest, 'Protection-plan usability-testing artifact', null, 'Testing informed the interaction and subsequent handoff.')] },
    result: 'Testing included feedback that the experience was “easier than expected.” I delivered the designs and handoff documentation, and left the team before the final launch.',
    lesson: 'Map the exceptions early. They often reveal what the main interaction needs to be.',
  },
  {
    slug: 'gpuflight', title: 'GPU Flight', client: 'Independent project',
    discipline: 'Design systems · AI-assisted prototyping', status: 'Work in progress', role: 'Product design & frontend', time: '2026', theme: 'gpu',
    hook: 'Fast to build. Designed to stay consistent.',
    summary: 'A visual language and component system for a GPU observability dashboard, built alongside AI-assisted prototypes.',
    cover: gpuArt,
    context: 'Generating a new screen was fast. Keeping every screen visually coherent was harder, especially when design and engineering happened at different times.',
    contribution: 'I designed and built the React dashboard with AI coding tools in VS Code, working with a software engineer on the data layer. I created Verdant 2 to give the interface a durable design reference.',
    decisions: [
      { label: '01 / Foundations', title: 'Define the language before adding more screens.', text: 'I used tokens to establish typography, color, spacing, and theme behavior. The restrained palette and information density reflect the product’s technical purpose.', images: [art(gpuPalette, 'Verdant 2 chart-color documentation', null, 'Chart tokens and usage guidance in the design-system documentation.')] },
      { label: '02 / Components', title: 'Design the states, not just the default.', text: 'Reusable components make the choices explicit. The progress component documents variants, sizes, and behavior so the next screen does not invent a new pattern.', images: [art(gpuComponent, 'Verdant 2 progress component documentation', null, 'Component examples turn the visual decisions into a working reference.')] },
    ],
    craft: { title: 'The system becomes the interface.', text: 'Templates bring the navigation, table, and inspector together. Monospace data and a restrained hierarchy distinguish telemetry from the actions around it.', images: [art(gpuTemplate, 'GPU Flight fleet template in Verdant 2', crop(3529, 492, 390, 2985, 1435), 'An actual template assembled from the system’s parts.')] },
    result: 'Verdant 2 provides documented foundations, components, and page templates. The dashboard remains in progress; this case study focuses on the design system and prototyping work.',
    lesson: 'AI can accelerate implementation. The visual decisions still need an intentional, reusable home.',
  },
  {
    slug: 'pantry-note', title: 'Pantry Note', client: 'Personal project',
    discipline: 'Product design · Mobile', status: 'Interactive prototype', role: 'UX & visual designer', time: '2023', theme: 'pantry',
    hook: 'Less effort to know what’s at home.',
    summary: 'Exploring a simpler way to start and maintain a household food inventory, in a familiar blue-and-white interface.',
    cover: pantryArt, detail: art(pantryOverview, 'Pantry Note inventory screen', crop(1400, 970, 151, 310, 681)),
    context: 'Food tracking only helps if people can keep up with it. The design challenge was to make starting an inventory and updating it feel less like another household chore.',
    contribution: 'I worked through research, flows, visual design, and Figma and Framer prototypes with a software engineer.',
    decisions: [
      { label: '01 / First use', title: 'An empty screen needs a clear first step.', text: 'In the initial usability test, participants did not know what to do on the empty list. I explored a more explicit add-items screen with search, popular foods, and categories.', layout: 'pair', images: [art(pantryIteration, 'Pantry Note initial empty-state design', crop(1600, 257, 121, 317, 659), 'Before — An empty list and a plus button.'), art(pantryIteration, 'Pantry Note explicit add-items design', crop(1600, 495, 1310, 620, 1035), 'Iteration — Search, popular items, and categories.')] },
      { label: '02 / Everyday use', title: 'Keep the inventory and the item connected.', text: 'The prototype groups items by storage location and provides an item-detail view for condition, quantity, and dates. The intent is to support quick checking and updating.', images: [art(pantryOverview, 'Pantry Note item details and inventory', null, 'The blue-and-white visual theme, from inventory to item detail.')] },
    ],
    craft: { title: 'A light visual rhythm for a daily habit.', text: 'White item cards, blue actions, and a consistent storage switcher create a recognizable pattern across the prototype. Wireframes helped work through the states behind those screens.', layout: 'pair', images: [art(pantryFlow, 'Pantry Note user flow', null, 'The flow behind the inventory experience.'), art(pantryWire, 'Pantry Note wireframe', null, 'An early wireframe exploration.')] },
    result: 'The project produced interactive Figma and Framer prototypes. Features such as voice and camera input were explored as design concepts, not presented here as a shipped app.',
    lesson: 'Making the first action obvious matters as much as simplifying the actions that follow.',
  },
  {
    slug: 'blue-cross-cost-estimator', title: 'Cost Estimator', client: 'Blue Cross NC',
    discipline: 'Product design · Healthcare', status: 'Prototype delivered', role: 'Product designer', time: '4 weeks · January 2022', theme: 'cost',
    hook: 'Make the idea visible. Move the decision forward.',
    summary: 'Using scenario-based flows and rapid prototypes to align a team on a complex healthcare estimate experience.',
    cover: costArt,
    context: 'The Advance EOB project needed a high-fidelity prototype in four weeks, while requirements were still being finalized. The team needed something concrete to discuss and evaluate.',
    contribution: 'I created user flows, wireflows, and scenario-based prototypes, adjusted designs in stakeholder sessions, and iterated through testing.',
    decisions: [
      { label: '01 / Alignment', title: 'Turn the discussion into a visible flow.', text: 'Rather than wait for every requirement to settle, I mapped the scenarios and brought visual options into the conversation. This gave the team a shared view of the experience.', layout: 'pair', images: [art(costFlow, 'Cost Estimator user flow', null, 'User flow'), art(costWire, 'Cost Estimator wireflow', null, 'Wireflow connecting the decisions to screens')] },
      { label: '02 / Prototype', title: 'Use the screens to resolve the details.', text: 'Figma auto-layout supported adjustments during stakeholder meetings. The prototype connected the form, member context, and subsequent states into scenarios that could be evaluated.', images: [art(costCover, 'Advance EOB form prototype', crop(1600, 386, 175, 830, 460), 'Member context stays visible above the form.')] },
    ],
    craft: { title: 'Consistency across the whole flow.', text: 'The final design artifact covers the connected screens and their variations, providing a reference beyond a single polished view.', images: [art(costFinal, 'Cost Estimator final screen-flow artifact', null, 'The connected design screens prepared for delivery.')] },
    result: 'A high-fidelity prototype was delivered within the four-week project. Usability testing involved three internal CSP users and one external provider—not a sample of members or patients.',
    lesson: 'A prototype can be a tool for reaching a decision, not only for presenting one.',
  },
]
