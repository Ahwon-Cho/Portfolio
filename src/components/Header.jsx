import { Link, useLocation } from 'react-router-dom'

export const PORTFOLIO_NAV = [
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const { pathname } = useLocation()
  return (
    <>
      <a className="portfolio-skip-link" href="#main-content">Skip to main content</a>
      <header className="portfolio-header">
        <Link className="portfolio-brand" to="/" aria-label="Ahwon Cho: home">
          Ahwon Cho<small>UX + Visual Designer</small>
        </Link>
        <nav aria-label="Primary navigation">
          {PORTFOLIO_NAV.map(({ label, to }) => (
            <Link key={to} to={to} aria-current={pathname === to || (to === '/work' && pathname.startsWith('/project/')) ? 'page' : undefined}>{label}</Link>
          ))}
          <Link to="/resume" aria-current={pathname === '/resume' ? 'page' : undefined}>Résumé</Link>
        </nav>
      </header>
    </>
  )
}
