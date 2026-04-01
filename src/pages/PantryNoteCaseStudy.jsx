/* Rich case study — Pantry Note (personal/side project) */
/* ART: warm editorial tone, research-first narrative, generous process documentation */
/* MOTION: scroll reveals, staggered image grids */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { getAdjacentProjects } from '../data/projects'

const SLUG = 'pantry-note'
const CDN  = 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/'

const IMG = {
  heroGif:     CDN + 'c9fe7672-6f0c-438b-a6a0-00d42f44056e_rw_1200.gif?h=e0852bbd39b3ff9baffdca8aa9b1ebd7',
  screens1:    CDN + 'd8daa238-ad70-4a14-8993-3d62b08a1ca4_rw_1920.png?h=e55a3216cd8464c1e76bbc2ac01d172d',
  screens2:    CDN + '38abcbc7-a331-4802-bd61-a78080c7fe47_rw_1920.png?h=3751727d95b63c0ab4c377037194de83',
  inlineGif:   CDN + 'd90eabd3-4f4c-4ac7-a2ed-e42dd9f5f331_rw_1200.gif?h=d58331c5daa20a587b88b2334a280018',
  screens3:    CDN + '2e2eee4c-0585-4a76-be56-597ff5c54f02_rw_1920.png?h=052f183601fa66e3cc927dc97217437d',
  timeline:    CDN + '2395ff69-93a5-4a8e-906b-ed94f0ae80a3_rw_1200.png?h=60dbe20c2797e906a47382fd8cb725a5',
  survey1:     CDN + '4afbe116-c1ac-4c9a-b635-b5793e559b97_rw_600.jpg?h=63647fc164791aed8c098acd1b71e801',
  survey2:     CDN + 'b29806b8-b0a2-4ffb-8c93-23b152b2bee2_rw_600.jpg?h=a1366a5395778e0ca1bbdb4a5a519392',
  persona:     CDN + '33ca7012-9b55-4ab9-9fd5-9ea6c2affbf9_rw_1200.jpg?h=c0ccb4b84b0c91d50781f8c0e1c561fa',
  journey:     CDN + '78ac696d-dbb7-4fdb-89f0-6f1ef95f2164_rw_1920.jpeg?h=6c7020dacfa17a4885ce31ba0a2eb135',
  mentalModel: CDN + 'be98ffb3-f2a7-4fc1-a801-679f992f9adb_rw_1200.jpg?h=ba13525d71fc2974c3ba9ffdce764aa7',
  userFlow:    CDN + '71e7cdd6-19c9-4218-b35b-ff444b09a6cb_rw_1200.jpg?h=f7b1257545c7bf75c79c5a736409e025',
  colorSystem: CDN + '3d27b5ef-54b4-47a5-a84a-e3d82ceb5910_rw_1200.png?h=b47d53ae006d7e962bec0eacfea19d35',
}

const WIREFRAMES = [
  CDN + 'f0ea382d-f6cf-4086-bc40-e9acc06ed293_rw_600.png?h=b65be39703e48743933163c37215c3c7',
  CDN + '5bd0136a-6301-4d4d-b580-d1af93b9456a_rw_600.png?h=6252ded126442ca123088038e8cb4332',
  CDN + '670b82ae-60ad-4ac2-ab58-ca919c6dbf0c_rw_600.png?h=78be1f79e7389ba2f28afaf4b5e590aa',
  CDN + 'c017db26-17c1-4bb1-9515-89a7d4261cf8_rw_600.png?h=30d3620d2adfd14238a1a21741769a51',
  CDN + '80e435af-b5ea-4194-a556-fb275d529a42_rw_600.png?h=52f018fa8599f72a077370a97feee826',
  CDN + 'c630ee84-c204-49fc-ac24-12db6342c1ad_rw_600.png?h=2c6a91faa943f1ca6dc133b5e3440414',
  CDN + '82c9d2a7-570c-4807-af7a-bda64c3c0379_rw_600.png?h=5bda1fb5196edb514240b2a16599423a',
  CDN + '6a0a8bff-3184-4aa6-bf24-5e4b6e19017c_rw_600.png?h=61bd452ee730be16b6e1d78b94815ec4',
  CDN + '0619f232-1a76-4593-91ea-971ae3a8881f_rw_600.png?h=de270f10a229766383799454eefdcea0',
  CDN + '3e843bc4-7348-4f1d-96f0-83958380362b_rw_600.png?h=4ecaf48550193ed34c00be899e26f28a',
  CDN + 'bf47252a-e094-4d91-850c-49de7bbe77ce_rw_600.png?h=db3a848a6e5bbee72714039f2341337a',
  CDN + '3eff2bd5-317f-472b-bc86-4e2a41fb5633_rw_600.png?h=50edb882bb96a610b853d71a88724aad',
  CDN + '4d64a9fa-9e74-4cea-ab21-b3abc9e26d87_rw_600.png?h=293d86ace75dc72860f51014b425dfcf',
]

const FINAL_SCREENS = [
  CDN + '3c58f54d-aae7-49ec-a678-d9380da6b35f_rw_1200.png?h=7f31d89d526e217cebafc3fb1ce355e9',
  CDN + '2f10d999-d0a8-412d-b377-5aa0f7e81d8d_rw_1200.png?h=15d282d2fc5a7c243cc50146255b6cf1',
  CDN + 'a53646fe-b6cf-4bf4-9923-df6242d13b6a_rw_1200.png?h=880c050e58cb9d008ec236a18b22ea68',
  CDN + '3e6c5428-79e5-4d95-90c3-30872429931b_rw_1200.png?h=0270000b90db4ac0742ca42bb0ad47c',
  CDN + '0a3fa5ad-fa00-4431-b1c8-7717b1d48952_rw_1200.png?h=01de6b8be2e3558e6ad1ff1d30e8e68b',
  CDN + '08f5b2a1-01d9-475a-8f17-8fc03690b0bf_rw_1200.png?h=ee99057e54bbe7bc927e7043f968bde0',
  CDN + '8c64beae-fafa-4bde-9c48-7ba6050bc67b_rw_1200.png?h=a5b71e9e14d16a978407e48b36449e56',
  CDN + '3a8a4a24-d362-4240-aea1-a813c3f98693_rw_1200.png?h=5b270c1816a892f0908ec485b2ae577b',
  CDN + 'e59389b9-3624-497e-9c25-6da498b89646_rw_1200.png?h=537028b6e2a6be7f2d847f4fabcb8446',
  CDN + 'b4159413-89f4-4a86-91ec-60cb66fe4ec9_rw_1200.png?h=79f1739f49bacdb8101c4c04d4b43b24',
  CDN + '713e7703-8650-48ab-aa08-a83592a93efb_rw_1200.png?h=62ac2bb5fc6f2f2ee725fd37f60841d8',
]

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
        onClick={onClose} role="dialog" aria-modal="true" aria-label={`Full-size: ${alt}`}
      >
        <motion.img src={src} alt={alt}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()} />
        <button onClick={onClose} aria-label="Close image"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

function Zoomable({ src, alt, className, children }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`block w-full text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-indigo-400 rounded-xl ${className ?? ''}`}
        aria-label={`View full size: ${alt}`}>
        {children}
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={close} />}
    </>
  )
}

function ZoomImg({ src, alt, className }) {
  return (
    <Zoomable src={src} alt={alt}>
      <img src={src} alt={alt} className={className ?? 'w-full object-cover'} loading="lazy" />
    </Zoomable>
  )
}

function BackIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
}
function NextIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
}

function Eyebrow({ label }) {
  return (
    <div className="flex items-center gap-4 mb-10" aria-hidden="true">
      <span className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-400">{label}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  )
}
function DarkEyebrow({ label }) {
  return (
    <div className="flex items-center gap-4 mb-10" aria-hidden="true">
      <span className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
export default function PantryNoteCaseStudy() {
  const navigate = useNavigate()
  const { prev, next } = getAdjacentProjects(SLUG)
  const shouldReduce = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 28 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] } },
  }
  const stagger = { hidden: {}, show: { transition: { staggerChildren: shouldReduce ? 0 : 0.07 } } }

  return (
    <article className="min-h-screen bg-ink-50 pt-14" aria-label="Case study: Pantry Note">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <motion.div variants={stagger} initial="hidden" animate="show">

            <motion.div variants={fadeUp}>
              <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
                aria-label="Go back to all work">
                <BackIcon /><span className="group-hover:underline">All Work</span>
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-100">Product Design</span>
              <span className="text-sm font-medium text-stone-400">Personal Project</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5">
              Pantry Note
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              A food inventory app designed for busy people — helping families track pantry items,
              reduce waste, and get notified before food goes bad.
              Full end-to-end product design: research, ideation, visual design, and prototype.
            </motion.p>

            <motion.div variants={fadeUp}
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">TL;DR</span>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Solo UX design from problem to prototype. Ran 29-person survey, built persona + journey map,
                went through multiple visual design iterations, and shipped an interactive Framer prototype.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ── METADATA ────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { term: 'Role',      detail: 'Product Designer'           },
              { term: 'Engineer',  detail: 'Andy Shin'                  },
              { term: 'Tools',     detail: 'Figma · Framer'             },
              { term: 'Type',      detail: 'Personal Project'           },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{term}</dt>
                <dd className="text-sm font-medium text-ink-800">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── HERO GIF ────────────────────────────────────────── */}
      <div className="bg-stone-50 border-b border-stone-100 py-12">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <ZoomImg src={IMG.heroGif} alt="Pantry Note animated product overview" className="w-full rounded-2xl object-cover shadow-lg" />
          </motion.div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Problem + Solution */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}><Eyebrow label="Problem & Solution" /></motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white border border-stone-100">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Problem</div>
              <p className="text-ink-800 leading-relaxed text-lg font-medium mb-4">
                Busy people need an easier way to track their food items.
              </p>
              <p className="text-stone-500 leading-relaxed text-sm">
                People who don't have enough time to manage their pantry need an efficient smartphone solution
                to check and track food items — improving budgetary planning without adding cognitive load.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-indigo-600 border border-indigo-700">
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">Solution</div>
              <p className="text-white leading-relaxed text-lg font-medium mb-4">
                Accurate food inventory with smart notifications.
              </p>
              <p className="text-indigo-200 leading-relaxed text-sm">
                Pantry Note helps users create an accurate food inventory and sends push notifications
                before items expire — reducing waste and saving money.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Key Discovery */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <Eyebrow label="Key Discovery" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-center">
            <div>
              <h2 className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                The plus button was the problem.
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                In the first iteration, adding an item required tapping a plus button — a pattern borrowed
                from todo apps. Testing revealed this created unexpected friction: users had to stop and
                think about how the action worked before doing it.
              </p>
              <p className="text-stone-600 leading-relaxed">
                The core insight: <strong className="text-ink-800">users don't want to think about how to use the app.</strong> Any
                moment of "how do I do this?" signals a design failure for a utility tool. This drove
                the redesign toward more direct, contextual entry points.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-700">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Iteration Trigger</div>
              <blockquote className="text-stone-300 text-sm leading-relaxed italic">
                "The plus button required cognitive effort — making users perceive the app as burdensome rather than helpful."
              </blockquote>
            </div>
          </div>
        </motion.section>

        {/* App Screens Showcase */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <div className="space-y-5">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.screens1} alt="Pantry Note app screens overview" className="w-full object-cover" />
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.screens2} alt="Pantry Note UI detail screens" className="w-full object-cover" />
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.inlineGif} alt="Pantry Note interaction animation" className="w-full object-cover" />
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.screens3} alt="Pantry Note additional app screens" className="w-full object-cover" />
            </motion.figure>
          </div>
        </motion.section>

        {/* Process & Timeline */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}><Eyebrow label="Process & Timeline" /></motion.div>
          <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
            <ZoomImg src={IMG.timeline} alt="Pantry Note process and timeline diagram" className="w-full object-contain" />
          </motion.figure>
        </motion.section>

        {/* Research */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="research-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Research" />
            <h2 id="research-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Understanding the problem space
            </h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              Before designing anything, I needed to understand who manages food at home, what frustrates them,
              and why existing apps weren't solving it.
            </p>
          </motion.div>

          {/* Methodology + Competitive Analysis */}
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-4">Methodology</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                {['Guerrilla interviews', 'Online data research', 'Competitive analysis', 'Participant survey (n=29)', 'Data analysis', 'Persona + journey mapping'].map(m => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-4">Competitive Analysis</h3>
              <div className="space-y-3 text-sm text-stone-600">
                {['NoWaste', 'Pantry Check', 'Cozzo.app', 'Grocy.info'].map(app => (
                  <div key={app} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500 flex-shrink-0">
                      {app[0]}
                    </div>
                    <span>{app}</span>
                  </div>
                ))}
                <p className="text-xs text-stone-400 pt-2">Key finding: limited products, several discontinued; remaining apps require extensive user learning</p>
              </div>
            </motion.div>
          </div>

          {/* Survey stats */}
          <motion.div variants={stagger} className="mb-10">
            <motion.h3 variants={fadeUp} className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-6">
              Survey — 29 participants
            </motion.h3>
            <div className="grid grid-cols-3 gap-5 mb-8">
              {[
                { value: '19/29', label: 'Cook daily', pct: '66%' },
                { value: '24/29', label: 'Have discarded food previously', pct: '83%' },
                { value: '21/29', label: 'Want inventory visibility in-app', pct: '72%' },
              ].map(({ value, label, pct }) => (
                <motion.div key={label} variants={fadeUp} className="p-5 rounded-2xl bg-white border border-stone-100 text-center">
                  <div className="font-bold text-3xl text-indigo-600 mb-1">{pct}</div>
                  <div className="font-medium text-sm text-ink-800 mb-1">{value}</div>
                  <div className="text-xs text-stone-500 leading-snug">{label}</div>
                </motion.div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { src: IMG.survey1, alt: 'Survey data chart 1' },
                { src: IMG.survey2, alt: 'Survey findings chart 2' },
              ].map((img, i) => (
                <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                  <ZoomImg src={img.src} alt={img.alt} className="w-full object-contain max-h-72" />
                </motion.figure>
              ))}
            </div>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-5">Key Takeaways from Survey</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Awareness of inventory prevents problems seen in the past',
                'Food management issues are age-independent and widely shared',
                'Users rely on outdated methods (notes, memory) despite available apps',
                'Co-inhabitants rarely share food inventory data with each other',
                'Frequent cooks (3+ times/week) shop at least weekly',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-stone-600">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

      </div>

      {/* ── ANALYZE & DEFINE — dark section ─────────────────── */}
      <section className="bg-zinc-950 py-24" aria-labelledby="define-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-12">
            <DarkEyebrow label="Analyze & Define" />
            <h2 id="define-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-4">
              Who is this for?
            </h2>
            <p className="text-stone-400 max-w-xl">
              The target: people responsible for managing household food — often parents who are
              always too busy to track inventory properly.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-2 gap-4">
            {/* Persona */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Persona — Hailey Wilson</p>
              <figure className="rounded-2xl overflow-hidden bg-zinc-900">
                <ZoomImg src={IMG.persona} alt="Persona: Hailey Wilson" className="w-full h-64 object-cover object-top" />
                <figcaption className="text-xs text-stone-500 px-4 py-3">
                  Chicago · Freelance designer · Two children
                </figcaption>
              </figure>
            </motion.div>

            {/* User Journey Map */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">User Journey Map</p>
              <figure className="rounded-2xl overflow-hidden bg-zinc-900">
                <ZoomImg src={IMG.journey} alt="User journey map for Hailey" className="w-full h-64 object-cover object-top" />
                <figcaption className="text-xs text-stone-500 px-4 py-3">
                  End-to-end journey managing food at home
                </figcaption>
              </figure>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── IDEATE & ITERATIONS ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Mental Model + User Flow */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="ideate-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Ideate & Iterations" />
            <h2 id="ideate-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-10">
              From mental model to detailed flow
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <ZoomImg src={IMG.mentalModel} alt="Mental model and user flow diagram" className="w-full h-56 object-cover object-top" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Mental model and user flow</figcaption>
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <ZoomImg src={IMG.userFlow} alt="Detailed user flow diagram" className="w-full h-56 object-cover object-top" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Detailed user flow</figcaption>
            </motion.figure>
          </motion.div>
        </motion.section>

        {/* Wireframes design goals */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="wireframes-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Sketches & Wireframes" />
            <h2 id="wireframes-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Design principles driving the wireframes
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            <motion.div variants={fadeUp} className="space-y-3">
              {[
                { n: '1', goal: 'Easy start point — no steep learning curve for busy people' },
                { n: '2', goal: 'Offer few options per screen — reduce decision fatigue' },
                { n: '3', goal: 'Easy undo / redo — forgive mistakes without friction' },
                { n: '4', goal: 'Make things easy to find — no buried features' },
                { n: '5', goal: 'Efficient and streamlined — every tap should earn its place' },
              ].map(({ n, goal }) => (
                <div key={n} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                  <span className="text-sm text-stone-600 leading-relaxed">{goal}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-4">Key Features</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                {[
                  'Multiple input methods: typing, voice recognition, camera (image + barcode)',
                  'Family sharing — co-inhabitants see the same inventory',
                  'Push notifications before food expires',
                  'Eating habit analysis over time',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Wireframe grid */}
          <motion.div variants={stagger} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {WIREFRAMES.map((src, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 aspect-[9/16]">
                <Zoomable src={src} alt={`Wireframe screen ${i + 1}`} className="h-full">
                  <img src={src} alt={`Wireframe screen ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
                </Zoomable>
              </motion.figure>
            ))}
          </motion.div>
        </motion.section>

      </div>

      {/* ── VISUAL DESIGN — dark section ─────────────────────── */}
      <section className="bg-zinc-950 py-24" aria-labelledby="visual-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-12">
            <DarkEyebrow label="Visual Design" />
            <h2 id="visual-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-6">
              Simple, not complicated.
            </h2>
            <div className="grid md:grid-cols-[2fr_1fr] gap-12">
              <p className="text-stone-400 leading-relaxed">
                The visual design goal was clarity over decoration. Food images per item enable quick scanning;
                a white background with minimal color prevents visual clutter. Three colors carry intentional meaning:
                green for growth and health, yellow and orange for warmth and enthusiasm.
                The overall tone: helpful, easy, fun, and environmental.
              </p>
              <div className="space-y-3">
                {[
                  { color: 'bg-green-500',  label: 'Green',  meaning: 'Growth · Health · Refreshing' },
                  { color: 'bg-yellow-400', label: 'Yellow', meaning: 'Warmth · Enthusiasm'           },
                  { color: 'bg-orange-400', label: 'Orange', meaning: 'Excitement · Energy'            },
                ].map(({ color, label, meaning }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 ${color}`} aria-hidden="true" />
                    <div>
                      <div className="text-sm font-medium text-stone-200">{label}</div>
                      <div className="text-xs text-stone-500">{meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Color system + final screens side by side */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-[1fr_2fr] gap-5 items-start">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden bg-zinc-900">
              <ZoomImg src={IMG.colorSystem} alt="Pantry Note color palette and design system" className="w-full h-48 object-cover" />
              <figcaption className="text-xs text-stone-500 px-4 py-3">Color palette</figcaption>
            </motion.figure>

            {/* Final screens grid */}
            <motion.div variants={stagger} className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {FINAL_SCREENS.map((src, i) => (
                <motion.figure key={i} variants={fadeUp} className="rounded-lg overflow-hidden bg-zinc-900 aspect-[9/16]">
                  <Zoomable src={src} alt={`Final screen ${i + 1}`} className="h-full">
                    <img src={src} alt={`Final screen ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
                  </Zoomable>
                </motion.figure>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PROTOTYPE + REFLECTION ──────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">


        {/* Challenge + Reflection */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="reflection-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Challenge & Reflection" />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white border border-stone-100">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Challenge</div>
              <p className="text-stone-600 leading-relaxed">
                Making a clean, simple UI for what is fundamentally an inventory system — a category
                historically associated with complexity — was the central design challenge.
                Inventory systems require managing state, categories, quantities, and time.
                Hiding that complexity while keeping the app powerful enough to be useful is an
                ongoing problem that remains a focus for future iterations.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-ink-900 border border-ink-800">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Reflection</div>
              <blockquote className="text-stone-300 leading-relaxed mb-5">
                "It was difficult to repeatedly solve problems found in the idea phase.
                But this was a great time to think about what a UX designer should do —
                and I experienced the joy of finding solutions after persistent iteration."
              </blockquote>
              <div className="space-y-2 text-xs text-stone-500">
                <div className="flex gap-2"><span className="text-indigo-400">→</span> Implementation is harder than ideation</div>
                <div className="flex gap-2"><span className="text-indigo-400">→</span> One user flow requires many more screens than expected</div>
                <div className="flex gap-2"><span className="text-indigo-400">→</span> Gained end-to-end product creation experience</div>
                <div className="flex gap-2"><span className="text-indigo-400">→</span> Developed time management for digital products</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

      </div>

      {/* ── NEXT / PREV ──────────────────────────────────────── */}
      <nav aria-label="Project navigation" className="border-t border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid grid-cols-2 gap-4">
          {prev ? (
            <Link to={`/project/${prev.slug}`} aria-label={`Previous project: ${prev.title}`}
              className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5">
              <span className="text-xs text-stone-400 uppercase tracking-wide flex items-center gap-1"><BackIcon /> Previous</span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-ink-600 transition-colors line-clamp-1">{prev.title}</span>
            </Link>
          ) : <div aria-hidden="true" />}
          {next ? (
            <Link to={`/project/${next.slug}`} aria-label={`Next project: ${next.title}`}
              className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5 text-right ml-auto w-full">
              <span className="text-xs text-stone-400 uppercase tracking-wide flex items-center justify-end gap-1">Next <NextIcon /></span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-ink-600 transition-colors line-clamp-1">{next.title}</span>
            </Link>
          ) : <div aria-hidden="true" />}
        </div>
      </nav>

    </article>
  )
}
