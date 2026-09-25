import { useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import greetingVideo from '../Firefly A sunny afternoon scene where a woman waves slowly in the foreground while sitting. The back.mp4'
import { Zoomable } from './Lightbox'
import art01 from '../img/art01.png'
import art02 from '../img/art02.png'
import art03 from '../img/art03.png'
import art04 from '../img/art04.png'
import art05 from '../img/art05.png'
import art06 from '../img/art06.png'
import art07 from '../img/art07.png'

const ART_WORKS = [art01, art02, art03, art04, art05, art06, art07]
const SKILLS = [
  { category: 'Design', items: ['Visual Design', 'Interaction Design', 'Design Systems', 'Information Architecture', 'High-fidelity UI', 'Prototyping', 'Accessibility specifications'] },
  { category: 'AI & Tools', items: ['AI-assisted prototyping', 'Claude Code', 'VS Code', 'Figma'] },
  { category: 'Research', items: ['User Research', 'Usability Testing', 'Journey Mapping', 'Wireframing', 'User Flows'] },
]

export default function About() {
  const reduce = useReducedMotion()
  return (
    <section id="about" className="portfolio-page about-page" aria-labelledby="about-title">
      <div className="portfolio-container">
        <header className="portfolio-page-heading">
          <h1 id="about-title">Beyond the screen<span>.</span></h1>
          <p>About Ahwon</p>
        </header>
        <div className="about-introduction">
          <div className="about-portrait">
            <video src={greetingVideo} autoPlay={!reduce} loop muted playsInline controls aria-label="Greeting from Ahwon Cho" />
          </div>
          <div className="about-biography">
            <p className="portfolio-lead">I’m Ahwon Cho, a UX and visual designer.</p>
            <p>My work spans enterprise, B2B, e-commerce, and cloud platforms. On Microsoft’s Surface Commercial team, I own UX and visual design across products including Surface Management Portal, Surface Support Portal, Surface Knowledge Portal, and Surface IT Toolkit.</p>
            <p>Visual design is one of my strengths. I like making an idea visible early, so people can try it and tell me what needs to change.</p>
            <p>I use AI-assisted coding in VS Code to build working prototypes and try out interactions.</p>
            <Link className="portfolio-text-link" to="/resume">View résumé <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <dl className="about-facts">
          <div><dt>10+</dt><dd>Years in UX and visual design</dd></div>
          <div><dt>7</dt><dd>Product managers I work with as the sole designer</dd></div>
          <div><dt>MICA</dt><dd>Master’s in UX Design</dd></div>
        </dl>
        <div className="about-practice">
          <div>
            <h2>How I work</h2>
            <p>I work with product managers to understand the problem, then use flows and prototypes to discuss possible solutions. I stay involved while engineers build the design.</p>
            <p>I create accessibility design specifications for developers, including keyboard tab order, color contrast requirements, and responsive behavior.</p>
            <p>At Microsoft, I adapt the existing design system into local Figma libraries where components need modernization, so designs are easier to update and collaborate on.</p>
            <p>I’m also interested in how people’s habits influence their use of a product, and how AI changes the way we design and build.</p>
            <a className="about-writing" href="https://medium.com/@acho_24144/my-team-used-ai-to-skip-design-for-mvp-heres-what-i-learned-98d13787fb91" target="_blank" rel="noopener noreferrer">
              <span className="portfolio-eyebrow">Writing</span>
              My Team Used AI to Skip Design for MVP: Here’s What I Learned <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="about-skills">
            {SKILLS.map(({ category, items }) => <div key={category}><h3>{category}</h3><p>{items.join(' · ')}</p></div>)}
          </div>
        </div>
        <section className="about-art" aria-labelledby="art-title">
          <header className="about-art__heading">
            <h2 id="art-title">Away from the screen</h2>
            <p>Drawing & painting · 2019</p>
          </header>
          <p>A few pieces from my drawing and painting classes.</p>
          <div className="about-art__gallery">
            {ART_WORKS.map((src, index) => (
              <div key={src}><Zoomable src={src} alt={`Art class study, 2019: ${index + 1}`}><img src={src} alt={`Art class study, 2019: ${index + 1}`} loading="lazy" /></Zoomable></div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
