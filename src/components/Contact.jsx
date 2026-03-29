function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function DribbbleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
    </svg>
  )
}

const links = [
  { icon: EmailIcon, label: 'Email', href: 'mailto:ahwon@example.com', value: 'ahwon@example.com' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com/in/ahwoncho', value: 'linkedin.com/in/ahwoncho' },
  { icon: DribbbleIcon, label: 'Dribbble', href: 'https://dribbble.com/ahwoncho', value: 'dribbble.com/ahwoncho' },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500">05 — Contact</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-900 dark:text-stone-100 leading-tight mb-6">
              Let's build something
              <br />
              <span className="italic font-normal text-stone-500 dark:text-stone-400">remarkable together.</span>
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-md">
              I'm currently open to senior IC and lead design roles at companies where design
              has a real seat at the table. I'm especially interested in enterprise software,
              healthcare, and AI/ML product spaces.
            </p>

            <div className="mt-10 space-y-4">
              {links.map(({ icon: Icon, label, href, value }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Contact via ${label}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-100 dark:group-hover:text-stone-900 transition-all duration-200">
                    <Icon />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 dark:text-stone-600 uppercase tracking-wide">{label}</div>
                    <div className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-8">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-6">Send a message</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-stone-700 dark:text-stone-400 mb-2 uppercase tracking-wide">Name</label>
                  <input id="contact-name" type="text" placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 text-sm transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-stone-700 dark:text-stone-400 mb-2 uppercase tracking-wide">Email</label>
                  <input id="contact-email" type="email" placeholder="your@email.com" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 text-sm transition-all duration-200" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-stone-700 dark:text-stone-400 mb-2 uppercase tracking-wide">Message</label>
                <textarea id="contact-message" rows={4} placeholder="Tell me about the role or project..." className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 text-sm transition-all duration-200 resize-none" />
              </div>
              <button type="submit" className="w-full btn-primary justify-center">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
