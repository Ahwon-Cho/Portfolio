/* Pantry Note — a focused account of the existing prototype, not a shipped app. */
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import CaseStudyFigure from '../components/CaseStudyFigure'
import { getAdjacentProjects } from '../data/projects'
import pnHero from '../img/pn_hero.gif'
import pnScreens1 from '../img/pn_screens1.png'
import pnScreens2 from '../img/pn_screens2.png'
import pnUserFlow from '../img/pn_userflow.jpg'
import pnJourney from '../img/pn_journey.jpg'
import pnWire1 from '../img/pn_wire1.png'
import pnWire2 from '../img/pn_wire2.png'
import pnWire3 from '../img/pn_wire3.png'
import pnWire4 from '../img/pn_wire4.png'
import pnWire5 from '../img/pn_wire5.png'
import pnWire6 from '../img/pn_wire6.png'
import pnWire7 from '../img/pn_wire7.png'
import pnWire8 from '../img/pn_wire8.png'
import pnWire9 from '../img/pn_wire9.png'
import pnWire10 from '../img/pn_wire10.png'
import pnWire11 from '../img/pn_wire11.png'
import pnWire12 from '../img/pn_wire12.png'
import pnWire13 from '../img/pn_wire13.png'

const wireframes = [pnWire1, pnWire2, pnWire3, pnWire4, pnWire5, pnWire6, pnWire7, pnWire8, pnWire9, pnWire10, pnWire11, pnWire12, pnWire13]

export default function PantryNoteCaseStudy() {
  const { prev, next } = getAdjacentProjects('pantry-note')
  const reduceMotion = useReducedMotion()
  return (
    <article className="case-study" aria-label="Case study: Pantry Note">
      <header>
        <motion.div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/work" className="portfolio-text-link mb-6">← All Work</Link>
          <p className="portfolio-eyebrow">Independent project <span className="case-status">Prototype</span></p>
          <h1>Pantry Note</h1>
          <p>A simpler starting point for keeping track of food at home.</p>
          <div className="case-study-summary">
            <span>At a glance</span>
            <p>I designed and prototyped Pantry Note in Figma. One of the first
              problems I worked on was helping people add an item to an empty pantry.</p>
          </div>
        </motion.div>
      </header>
      <div className="bg-white border-b border-stone-100">
        <dl className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ['Role', 'UX / Visual Designer'], ['Project', 'Independent exploration'],
            ['Tools', 'Figma'], ['Stage', 'Design & prototype'],
          ].map(([term, detail]) => <div key={term}>
            <dt className="text-xs uppercase mb-1">{term}</dt><dd>{detail}</dd>
          </div>)}
        </dl>
      </div>
      <div className="max-w-5xl mx-auto">
        <CaseStudyFigure src={reduceMotion ? pnScreens1 : pnHero} alt="Pantry Note blue mobile interface prototype"
          caption="Original prototype: item details, inventory, and the Pantry Note visual identity"
          note="Freshness scores in the mockups are exploratory interface concepts, not validated food-safety assessments." />
      </div>
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 space-y-24">
        <section aria-labelledby="pantry-context">
          <span className="portfolio-eyebrow">01 / The challenge</span>
          <h2 id="pantry-context">Keeping a food inventory up to date</h2>
          <div className="grid md:grid-cols-2 gap-10 mt-6">
            <p>Pantry Note explores how households could keep track of what they have, where it is stored,
              and when it needs attention.</p>
            <p>An inventory only stays useful if people keep it up to date. I focused on a clear entry point,
              recognizable food categories, and item details that can be edited as things change.</p>
          </div>
        </section>
        <section aria-labelledby="pantry-first-use">
          <span className="portfolio-eyebrow">02 / First-use iteration</span>
          <h2 id="pantry-first-use">An empty pantry needs a clear next step</h2>
          <p className="max-w-2xl mt-6">The earlier screen showed an empty list and a small plus button.
            The iteration notes describe participants being unsure what to do next. The later exploration
            introduces a dedicated “Add your items” view with search, popular items, and categories.</p>
          <p className="max-w-2xl mt-4">I changed the first-use screen. The plus button remains available elsewhere in the prototype.</p>
          <div className="case-evidence-grid case-evidence-grid--pair">
            <CaseStudyFigure src={pnScreens2} sourceWidth={1600}
              crop={{ x: 237, y: 100, width: 361, height: 739 }}
              alt="Earlier Pantry Note empty pantry screen with a small plus button"
              caption="Earlier: an empty list offers little direction" />
            <CaseStudyFigure src={pnScreens2} sourceWidth={1600}
              crop={{ x: 449, y: 1261, width: 710, height: 1100 }}
              alt="Pantry Note add-items exploration with search, popular items, and categories"
              caption="Exploration: make the ways to start visible" />
          </div>
          <p className="case-decision-note">I would test whether people can add their first item without help,
            then check how they update the list after shopping or cooking.</p>
        </section>
        <section aria-labelledby="pantry-visual">
          <span className="portfolio-eyebrow">03 / Visual language</span>
          <h2 id="pantry-visual">Organizing item details</h2>
          <p className="max-w-2xl mt-6">A blue identity, white item surfaces, and storage tabs organize the
            experience. Item details bring storage location, amount, and dates into one view.</p>
          <div className="case-evidence-grid">
            <CaseStudyFigure src={pnScreens1} alt="Pantry Note item details, brand screen, and inventory overview"
              caption="High-fidelity visual exploration"
              note="Original prototype screens; interface wording and the freshness indicator remain part of the exploration." />
          </div>
        </section>
        <section aria-labelledby="pantry-process">
          <span className="portfolio-eyebrow">04 / Working through the flow</span>
          <h2 id="pantry-process">Sketches and wireframes</h2>
          <p className="max-w-2xl mt-6">Early sketches and a household journey map helped organize the
            flow from creating a pantry to adding and managing food. Wireframes explored the supporting
            screens before the visual design developed.</p>
          <details className="case-artifact-details mt-8">
            <summary>View the original sketches and journey map</summary>
            <div className="case-evidence-grid case-evidence-grid--pair">
              <CaseStudyFigure src={pnUserFlow} alt="Hand-drawn Pantry Note task-flow exploration" caption="Task-flow sketches" />
              <CaseStudyFigure src={pnJourney} alt="Pantry Note household food-management journey map" caption="Journey-map artifact" />
            </div>
          </details>
          <details className="case-artifact-details mt-6">
            <summary>View the wireframe collection</summary>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {wireframes.map((src, i) => <CaseStudyFigure key={src} src={src}
                alt={`Pantry Note original wireframe ${i + 1}`} caption={`Wireframe ${String(i + 1).padStart(2, '0')}`} />)}
            </div>
          </details>
        </section>
        <section aria-labelledby="pantry-reflection">
          <span className="portfolio-eyebrow">Reflection</span>
          <h2 id="pantry-reflection">Would people keep using it?</h2>
          <p className="max-w-2xl mt-6">Pantry Note is a prototype. I would next test it over several shopping
            and cooking cycles to see whether people keep their inventory current. That would help me
            understand whether it could actually reduce wasted food.</p>
        </section>
      </div>
      <nav aria-label="Project navigation" className="border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid grid-cols-2 gap-6">
          {prev ? <Link to={`/project/${prev.slug}`} aria-label={`Previous project: ${prev.title}`}>
            <span className="block text-sm text-stone-500 mb-2">← Previous</span><span>{prev.title}</span>
          </Link> : <div />}
          {next ? <Link to={`/project/${next.slug}`} className="text-right" aria-label={`Next project: ${next.title}`}>
            <span className="block text-sm text-stone-500 mb-2">Next →</span><span>{next.title}</span>
          </Link> : <Link to="/work" className="text-right"><span className="block text-sm text-stone-500 mb-2">Explore</span><span>All work →</span></Link>}
        </div>
      </nav>
    </article>
  )
}
