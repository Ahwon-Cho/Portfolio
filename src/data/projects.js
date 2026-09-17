import gpuFlightImg     from '../img/gpuflight01.png'
import gpuThumbImg      from '../img/thumb-gpu.png'
import gfSystemPalette  from '../img/system02.png'
import gfSystemAtom     from '../img/system01.png'
import gfSystemTemplate from '../img/system03.png'
import surfaceImg       from '../img/surface-it-toolkit.png'
import blueConnectImg   from '../img/blueconnect-redesign.png'
import blueCrossImg     from '../img/bluecross-cost-estimator.png'
import homeDepotImg     from '../img/homedepot-protection-plan.png'
import pantryNoteImg    from '../img/pantry-note.png'
import blueComparison   from '../img/blueconnect_comparison.png'
import blueDirections   from '../img/bluecross_img1.png'
import costWireflow     from '../img/bc_wireflow.png'
import costFinal        from '../img/bc_final.png'

export const projects = [
  {
    id: 9,
    slug: 'gpuflight',
    title: 'GPU Flight',
    subtitle: 'An interface for monitoring GPU performance.',
    type: 'Web Dashboard',
    category: 'Product Design',
    company: 'Offleash Lab',
    employment: null,
    role: 'Product Designer & Frontend Developer',
    timeline: '2026',
    team: 'Andy Shin (Software Engineer)',
    tags: ['developer-tools', 'data-visualization', 'design-systems'],
    wip: true,
    image: gpuFlightImg,
    imageAlt: 'GPU Flight Insights dashboard exploration with device health, trends, and issue details',
    imageCaption: 'Insights dashboard exploration. The product and its design system are still evolving.',
    preserveHeroAspectRatio: true,
    thumbnail: gpuThumbImg,
    tldr: 'I design GPU Flight and build its frontend with AI-assisted coding. I work with Andy Shin, the software engineer, on the dashboard and its Verdant 2 design system.',
    overview: 'Developers use GPU telemetry to investigate application performance. I work on the interface for viewing device health, trends, and issues, while Andy Shin works on the data layer.',
    problem: 'The dashboard needs to show a summary without hiding the detailed data engineers need. As we built screens with AI-assisted coding, spacing and controls also began to vary. I created shared components to keep them consistent.',
    featureSections: [
      {
        label: '01 / Product interface',
        heading: 'Organizing the Insights dashboard',
        intro: 'I grouped summary indicators at the top, placed trend charts below them, and kept individual issues in a table. Engineers can scan the overview before inspecting the records.',
        body: ['A next step is to evaluate a complete investigation task with an engineer, including loading, stale data, and error states.'],
        images: [],
      },
      {
        label: '02 / Visual foundations',
        heading: 'Color and layout rules',
        intro: 'I developed Verdant 2 to define the colors, typography, spacing, and components used across the frontend. I kept layouts compact to accommodate data tables and charts.',
        body: ['Shared tokens let me update recurring styles in one place. I still need to review each screen in light and dark mode.'],
        images: [
          {
            src: gfSystemPalette,
            alt: 'Verdant 2 chart palette documentation with color tokens and usage examples',
            caption: 'Chart palette: color tokens, samples, and usage guidance',
            note: 'Charts still need contrast checks and labels that can be understood without color.',
          },
        ],
      },
      {
        label: '03 / Reusable interface',
        heading: 'Components and page templates',
        intro: 'I documented component sizes and states, then combined them into templates for recurring layouts.',
        images: [
          {
            src: gfSystemAtom,
            alt: 'VProgress documentation with variants, sizes, and a live example',
            caption: 'VProgress: determinate and indeterminate progress states',
            note: 'The examples show different sizes and progress states.',
          },
          {
            src: gfSystemTemplate,
            alt: 'Verdant 2 component-gallery template for a fleet-host layout',
            caption: 'Fleet-host template: a composition example, not a shipped product screen',
            note: 'This template belongs to the component gallery. Features marked planned are still in development.',
          },
        ],
      },
    ],
    processHeading: 'How I build and review the interface',
    process: [
      { phase: 'Understand the domain', description: 'Discussed GPU terminology and telemetry with the engineer and used AI to help me study unfamiliar concepts.' },
      { phase: 'Prototype in code', description: 'Used AI-assisted coding in VS Code to try layouts, review their behavior, and adjust the design.' },
      { phase: 'Document patterns', description: 'Documented recurring styles and components for reuse across the frontend.' },
    ],
    challengesHeading: 'What still needs attention',
    challenges: [
      'Balancing a compact overview with enough detail for technical investigation.',
      'Reviewing generated code and interface states, not just the default appearance.',
      'Keeping design-system examples and product screens aligned as both evolve.',
    ],
    outcomesHeading: 'Work produced so far',
    outcomes: [
      'Dashboard design explorations and frontend implementation work.',
      'Verdant 2 foundations, component documentation, and composition templates.',
      'A shared reference for visual and interaction decisions during development.',
    ],
    reflectionHeading: 'Next steps',
    reflection: 'Working in code lets me try interactions while designing them. Next, I want to test a complete investigation task with engineers and review loading, stale-data, and error states. The product is still in development.',
  },
  {
    id: 1,
    slug: 'surface-it-toolkit',
    title: 'Surface IT Toolkit',
    subtitle: "Bringing Surface deployment, configuration, and recovery tools into one Windows app.",
    type: 'Windows Application',
    category: 'Product Design',
    company: 'Microsoft',
    employment: 'Contractor',
    role: "Sole designer for UX, UI, and visual design",
    timeline: "September 2023 to April 2024",
    team: '2 PMs · 4 Engineers · 1 Designer',
    tags: ['enterprise', 'b2b'],
    image: surfaceImg,
    thumbnail: surfaceImg,
    tldr: 'Sole designer across all Surface IT Toolkit features, from workflows and interface design to custom icons and product imagery. Shipped in April 2024.',
    overview: "Surface IT Toolkit brings together tools for IT administrators managing Surface devices. I designed all its features, including the workflows, interface, custom icons, and product imagery.",
    problem: "The existing tools had different navigation and interaction patterns. I needed to organize them within a shared structure while preserving the controls admins use.",
    process: [
      {
        "phase": "Review the existing tools",
        "description": "Audited UEFI Configurator and Data Eraser with the PMs to compare their flows and identify inconsistent patterns."
      },
      {
        "phase": "Map the workflows",
        "description": "Created the information architecture and task flows for the toolkit."
      },
      {
        "phase": "Design the interface",
        "description": "Developed wireframes, Figma components, light and dark themes, and custom icons while engineering work progressed."
      },
      {
        "phase": "Support implementation",
        "description": "Reviewed the designs with engineers through handoff. The toolkit shipped in April 2024."
      }
    ],
    challenges: [
      "Designing while engineers were building the application.",
      "Bringing tools with different patterns into one navigation structure.",
      "Maintaining both light and dark themes."
    ],
    outcomes: [
      "Designs for all toolkit features.",
      "A Figma component library with variables for light and dark themes.",
      "Custom icons and product imagery."
    ],
    reflection: "I would document the reasons behind decisions earlier, so future changes can be reviewed against the original requirements.",
  },
  {
    id: 2,
    slug: 'blue-cross-cost-estimator',
    title: 'Blue Cross NC Cost Estimator',
    subtitle: 'Designing a flow for requesting a healthcare cost estimate.',
    type: 'Product Feature',
    category: 'Product Design',
    company: 'Blue Cross NC',
    employment: 'Contractor',
    role: 'Product Designer',
    timeline: '4 weeks · January 2022',
    team: 'Sydney Sample · Lamar Lundy · Leslie Carter',
    status: 'Prototype',
    tags: ['healthcare', 'enterprise'],
    image: blueCrossImg,
    thumbnail: blueCrossImg,
    preserveHeroAspectRatio: true,
    tldr: 'I designed wireflows and a prototype for requesting an Advance Explanation of Benefits (EOB). Providers and internal support staff use this flow to prepare a request for an estimate.',
    overview: 'An Advance EOB request includes member details, requester information, and claim details. The form changes depending on who submits it and the type of claim.',
    problem: 'The requirements were changing during a four-week design period. I used wireflows to discuss the order of the form, the different claim paths, and the final review step with the team.',
    featureSections: [
      {
        label: '01 / Structure',
        heading: 'Mapping the request',
        intro: 'The wireflow starts with member and requester details, then branches by claim type before returning to a shared review step.',
        steps: ['Member details', 'Requester details', 'Claim type and form', 'Review', 'Submit'],
        images: [
          {
            src: costWireflow,
            alt: 'Advance EOB wireflow from member details through requester and claim information to review and submission',
            caption: 'Wireflow: a shared reference for the request sequence',
            note: 'Professional and institutional claims have different form requirements. Open the original to inspect the branches.',
          },
        ],
      },
      {
        label: '02 / Interface',
        heading: 'Developing the prototype',
        intro: 'Wireframes and Figma components supported revisions during stakeholder discussions. The final design board shows how the request sequence developed into interface screens.',
        images: [
          {
            src: costFinal,
            alt: 'Advance EOB high-fidelity design board with request screens',
            caption: 'High-fidelity prototype screens',
            note: 'Prototype screens prepared for review.',
          },
        ],
      },
    ],
    processHeading: 'How I worked with the team',
    process: [
      { phase: 'Map the request', description: 'Outlined the information needed at each stage and the differences between requester and claim paths.' },
      { phase: 'Visualize and revise', description: 'Revised the wireflows and Figma components as the team reviewed the requirements.' },
      { phase: 'Evaluate the prototype', description: 'Prototype sessions included three internal support users and one external provider. Member testing would be needed to evaluate any member-facing flow.' },
    ],
    challengesHeading: 'Constraints that shaped the work',
    challenges: ['Requirements were still being defined while design progressed.', 'Different claim forms had to fit within a coherent request sequence.', 'The prototype needed to support discussion across multiple stakeholders.'],
    outcomesHeading: 'Design deliverables',
    outcomes: ['A mapped request flow with explicit branches and review states.', 'High-fidelity prototype screens for stakeholder review and evaluation.'],
    reflectionHeading: 'What I would check next',
    reflection: 'The prototype gave the team a complete request sequence to review. I would next check how well it handles incomplete information and changes made during the final review.',
  },
  {
    id: 3,
    slug: 'home-depot-protection-plan',
    title: 'Home Depot Protection Plan',
    subtitle: "Designing how customers add a protection plan after checkout.",
    type: 'Post-Purchase Experience',
    category: 'UX Design',
    company: 'Home Depot',
    employment: 'Contractor',
    role: 'UX Designer',
    timeline: '2023',
    team: 'PM Carrie Samples · Engineering Team',
    tags: ['e-commerce', 'conversion'],
    image: homeDepotImg,
    thumbnail: homeDepotImg,
    tldr: "I designed the post-purchase flows, prototype, and handoff for General Merchandise and Major Appliances.",
    overview: 'Home Depot customers who declined a protection plan at checkout had no way to add it afterward. This project designed a complete post-purchase protection plan experience accessible from both the Thank You page and Order Details page, covering multiple product types and edge cases.',
    problem: "A plan is attached to a product during checkout but becomes a separate item afterward. The drawer had to account for single products, multiple products, and mixed orders.",
    process: [
      {
        "phase": "Review the scenarios",
        "description": "Compared the two entry points and the plan choices for General Merchandise and Major Appliances."
      },
      {
        "phase": "Map the flows",
        "description": "Mapped all five product scenarios after the first GM design missed other cases."
      },
      {
        "phase": "Revise the drawer",
        "description": "Built Figma variants and separated choosing coverage from adding a plan to the cart."
      },
      {
        "phase": "Prepare handoff",
        "description": "Annotated the designs and provided versions for the legacy design system and Stencil."
      }
    ],
    challenges: [
      'Two different system treatments for the same protection plan across purchase phases',
      'Multiple entry points with different starting contexts (Thank You page vs. Order Details)',
      'Five distinct product category scenarios requiring separate design approaches',
      'Mid-project design system transition to Stencil',
    ],
    outcomes: [
      "Flows and prototype for the post-purchase experience.",
      "Figma component variants and annotated handoff files.",
      "Recognition from the Home Depot design team."
    ],
  },
  {
    id: 4,
    slug: 'microsoft-teams-anywhere',
    title: 'Microsoft Teams Anywhere',
    subtitle: "Storyboards for a concept about managing IT equipment remotely.",
    type: 'Storyboards & Concept Design',
    category: 'UX Design',
    company: 'Microsoft',
    employment: 'Contractor',
    role: 'UX Designer',
    timeline: '2023',
    team: 'PM Tabish Javed',
    tags: ['future-of-work', 'narrative'],
    image: null,      // 32x19 stub on disk — placeholder renders instead
    thumbnail: null,
    tldr: "I created storyboards to explain a B2B concept for managing distributed networks through Microsoft Teams.",
    overview: "Teams Anywhere explored how IT professionals might manage networks and equipment remotely through Teams. My work focused on communicating the concept through storyboards.",
    problem: "The team needed to explain the proposed workflows before the detailed interface was defined.",
    process: [
      {
        "phase": "Develop the concept",
        "description": "Organized scenarios across home, office, and remote work settings."
      },
      {
        "phase": "Draw the storyboards",
        "description": "Illustrated how IT admins might monitor devices and respond to issues in those settings."
      },
      {
        "phase": "Present the idea",
        "description": "Used the storyboards to discuss the proposed experience with stakeholders."
      }
    ],
    challenges: [
      "Explaining a technical concept through a short sequence of scenes.",
      "Showing different work settings before the features were fully defined."
    ],
    outcomes: [
      "Concept storyboards for stakeholder discussions."
    ],
  },
  {
    id: 5,
    slug: 'blue-connect-mobile-app',
    title: 'Blue Connect Mobile App Redesign',
    subtitle: 'Redesigning the home screen for health-plan tasks and benefits.',
    type: 'Mobile Application',
    category: 'Visual Design',
    categories: ['UX Design', 'Visual Design'],
    company: 'Blue Cross NC',
    employment: 'Contractor',
    role: 'Visual Interface Designer',
    timeline: '2022',
    team: 'Alan Tarrant · Arnie Mariano',
    status: 'Design proposal',
    tags: ['healthcare', 'mobile'],
    image: blueConnectImg,
    thumbnail: blueConnectImg,
    preserveHeroAspectRatio: true,
    tldr: 'I redesigned the main-screen experience, exploring three visual directions and a new hierarchy for tasks, plan information, and benefits.',
    overview: 'The existing home screen mixed plan details, provider information, and navigation in a long sequence. Members needed access to everyday tasks alongside information about their coverage.',
    problem: 'The visual challenge was to establish priorities within a constrained palette: make actions discoverable, distinguish plan types, and give financial information a clearer structure without removing the details.',
    featureSections: [
      {
        label: '01 / Information hierarchy',
        heading: 'Task shortcuts and plan information',
        intro: 'I moved six task shortcuts toward the top and grouped plan information under tabs. Labeled bars sit beside benefit amounts so members can read the numbers as well as see their relative sizes.',
        layout: 'comparison',
        images: [
          { src: blueComparison, alt: 'Earlier Blue Connect home-screen design', caption: 'Before: navigation and plan details share a long stack', sourceWidth: 1920, crop: { x: 70, y: 278, width: 485, height: 2006 } },
          { src: blueComparison, alt: 'Proposed Blue Connect home-screen design', caption: 'Proposal: task shortcuts, plan tabs, and benefit summaries', sourceWidth: 1920, crop: { x: 619, y: 278, width: 479, height: 2148 } },
        ],
      },
      {
        label: '02 / Visual exploration',
        heading: 'Comparing three visual directions',
        intro: 'I explored different ways to present shortcuts, switch plans, and group benefit information. The screens below show the three directions.',
        layout: 'directions',
        images: [
          { src: blueDirections, alt: 'Blue Connect first visual direction with circular task shortcuts', caption: '01: Prominent shortcuts and grouped plan cards', sourceWidth: 1920, crop: { x: 36, y: 132, width: 602, height: 2618 } },
          { src: blueDirections, alt: 'Blue Connect second visual direction with a six-action grid', caption: '02: An action grid and flatter information sections', sourceWidth: 1920, crop: { x: 659, y: 132, width: 600, height: 2690 } },
          { src: blueDirections, alt: 'Blue Connect third visual direction emphasizing the active plan', caption: '03: Plan-first navigation and account details', sourceWidth: 1920, crop: { x: 1281, y: 132, width: 602, height: 2650 } },
        ],
        callout: { label: 'Design intent', text: 'Keep common tasks visible while leaving room to read balances and coverage.' },
      },
    ],
    processHeading: 'My contribution',
    process: [
      { phase: 'Review the existing interface', description: 'Examined navigation, hierarchy, and the presentation of plan information with the team.' },
      { phase: 'Explore visual directions', description: 'Developed three high-fidelity directions and reusable Figma components to compare layout, navigation, and emphasis.' },
      { phase: 'Prepare for evaluation', description: 'Prepared the interface designs for team review and prototype evaluation.' },
    ],
    challengesHeading: 'Balancing clarity and detail',
    challenges: ['Working within the brand palette while giving actions and data distinct emphasis.', 'Presenting deductible and out-of-pocket information without relying on color alone.', 'Keeping important tasks visible alongside detailed plan information.'],
    outcomesHeading: 'Design work delivered',
    outcomes: ['Three visual directions for the mobile main-screen experience.', 'A before-and-after hierarchy comparison and a reusable Figma component library.'],
    reflectionHeading: 'What I would evaluate next',
    reflection: 'I would test whether members can find a common task and correctly interpret the deductible and out-of-pocket amounts. A preferred visual direction alone would not answer those questions.',
  },
  {
    id: 6,
    slug: 'pantry-note',
    title: 'Pantry Note',
    subtitle: "A prototype for keeping track of food at home.",
    type: 'Mobile Application',
    category: 'Product Design',
    company: null,
    employment: 'Personal Project',
    role: 'UX/Visual Designer',
    timeline: '2023',
    team: 'Andy Shin (Software Engineer)',
    tags: ['mobile', 'consumer'],
    image: pantryNoteImg,
    thumbnail: pantryNoteImg,
    tldr: "I designed Pantry Note and prototyped the flows in Figma, with particular attention to adding the first item.",
    overview: "Pantry Note explores how people could track food, storage locations, and dates at home. It is an independent design and prototype.",
    problem: "People have to keep an inventory current for it to be useful. The first version also left some participants unsure how to add an item to an empty pantry.",
    process: [
      {
        "phase": "Research",
        "description": "Reviewed household food-management habits and compared existing pantry apps."
      },
      {
        "phase": "Map the tasks",
        "description": "Created personas, a household journey map, and flows for adding and managing food."
      },
      {
        "phase": "Revise the first-use screen",
        "description": "Explored an add-items screen with search, popular items, and categories."
      },
      {
        "phase": "Prototype",
        "description": "Built prototypes in Figma."
      }
    ],
    challenges: [
      "Helping someone add their first item without assistance.",
      "Keeping the inventory current after shopping and cooking.",
      "Covering item details and the supporting screens."
    ],
    outcomes: [
      "Task flows, sketches, and wireframes.",
      "A blue visual identity and interface explorations.",
      "Interactive prototypes for further testing."
    ],
  },
  {
    id: 7,
    slug: 'samsung-crazy',
    title: 'Samsung Crazy',
    subtitle: "Visual and motion design for a Samsung campaign microsite.",
    type: 'Micro Website',
    category: 'Visual Design',
    company: 'Samsung',
    employment: 'Agency',
    role: 'Visual Designer',
    timeline: '2018',
    team: 'Samsung Marketing Team',
    tags: ['motion', 'campaign'],
    image: null,      // 32x19 stub on disk — placeholder renders instead
    thumbnail: null,
    tldr: "I designed campaign visuals and motion using Photoshop, Illustrator, and Flash.",
    overview: "Samsung Crazy was a promotional microsite. My work combined visual design with interactive motion.",
    problem: "The campaign needed to present the product through a short interactive experience.",
    process: [
      {
        "phase": "Visual concept",
        "description": "Explored typography, color, and composition for the campaign."
      },
      {
        "phase": "Design",
        "description": "Created the visual assets in Photoshop and Illustrator."
      },
      {
        "phase": "Motion",
        "description": "Built interactive animation sequences in Flash."
      }
    ],
    challenges: [
      "Keeping the product visible within the animation.",
      "Preparing motion assets for web delivery."
    ],
    outcomes: [
      "Campaign visuals and interactive motion assets."
    ],
  },
  {
    id: 8,
    slug: 'ergo-daum-insurance',
    title: 'Ergo Daum Insurance',
    subtitle: "Visual design for an insurance microsite.",
    type: 'Micro Website',
    category: 'Visual Design',
    company: 'Ergo Daum',
    employment: 'Agency',
    role: 'Visual Designer',
    timeline: '2017',
    team: 'Ergo Daum Marketing Team',
    tags: ['insurance', 'brand'],
    image: null,      // 32x19 stub on disk — placeholder renders instead
    thumbnail: null,
    tldr: "I designed the visual interface for an Ergo Daum Insurance microsite.",
    overview: "The microsite presented insurance information for a Korean audience. My contribution focused on visual design and page layouts.",
    problem: "The page needed to make policy information readable while following the brand.",
    process: [
      {
        "phase": "Visual direction",
        "description": "Reviewed the brand and explored typography, color, and layout."
      },
      {
        "phase": "Design",
        "description": "Created page layouts and image assets in Photoshop."
      },
      {
        "phase": "Handoff",
        "description": "Prepared visual assets and design specifications for development."
      }
    ],
    challenges: [
      "Organizing policy details so readers could scan them.",
      "Keeping the layouts consistent with the brand."
    ],
    outcomes: [
      "Page designs and visual assets for the microsite."
    ],
  },
]

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug)
}

/* The curated set, in the order they appear on /work. Adjacency walks THIS
   list, not `projects` — otherwise Next carries a reader out of the featured
   work and into projects that were deliberately left off the grid. */
export const FEATURED_SLUGS = [
  'surface-it-toolkit',
  'blue-connect-mobile-app',
  'home-depot-protection-plan',
  'gpuflight',
  'blue-cross-cost-estimator',
  'pantry-note',
]

export const featuredProjects = FEATURED_SLUGS
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter(Boolean)

export function getAdjacentProjects(slug) {
  const index = featuredProjects.findIndex((p) => p.slug === slug)
  /* Not a featured project — reachable by direct URL, but it has no place
     in the tour, so it offers no onward step. */
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? featuredProjects[index - 1] : null,
    next: index < featuredProjects.length - 1 ? featuredProjects[index + 1] : null,
  }
}
