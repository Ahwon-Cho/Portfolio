export default function Contact() {
  return (
    <section id="contact" className="portfolio-page contact-page" aria-labelledby="contact-title">
      <div className="portfolio-container">
        <header className="portfolio-page-heading"><h1 id="contact-title">Let’s talk<span>.</span></h1><p>Contact</p></header>
        <div className="contact-layout">
          <div className="contact-letter">
            <h2>Have a role or<br />project in mind?</h2>
            <p>I’m interested in senior UX and product design roles where I can put my visual design skills to use.</p>
            <p>Email me about an opportunity, or get in touch if you have a question about my work.</p>
            <p className="contact-signature">Talk soon,<br /><span>Ahwon</span></p>
          </div>
          <div>
            <div className="contact-links">
              <a href="mailto:awony82@gmail.com" aria-label="Email: awony82@gmail.com"><span>Email</span><strong>awony82@gmail.com</strong><i aria-hidden="true">↗</i></a>
              <a href="https://www.linkedin.com/in/ahwon-c-3bb41593/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Ahwon on LinkedIn"><span>Connect</span><strong>LinkedIn</strong><i aria-hidden="true">↗</i></a>
            </div>
            <div className="contact-topics"><h3>Design interests</h3><p>Visual design · Enterprise UX<br />Design systems · AI-assisted prototyping</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
