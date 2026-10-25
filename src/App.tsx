import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { profile, projects, skills, stops, type Project } from './content'

const Scene = lazy(() => import('./Scene'))

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

function initialSimple() {
  if (new URLSearchParams(location.search).has('simple')) return true
  try {
    const saved = localStorage.getItem('view')
    if (saved) return saved === 'simple'
  } catch {}
  return !hasWebGL()
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Year shown in the stop stamp: a project's latest year, otherwise this year.
function stopYear(id: string) {
  return projects.find((p) => p.id === id)?.period.match(/\d{4}/g)?.at(-1) ?? String(new Date().getFullYear())
}

export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

function ProjectSheet({ p }: { p: Project }) {
  return (
    <article className="sheet project">
      <h2>{p.name}</h2>
      <p className="sub">{p.title}</p>
      <p className="meta">{p.period}</p>
      <p className="summary">{p.summary}</p>

      <h3>Stack</h3>
      <ul className="tags" aria-label="Stack">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h3>Screens</h3>
      <div className="shots">
        {p.shots.map((s) => (
          <figure key={s.src} className={s.height > s.width ? 'portrait' : undefined}>
            <a href={s.src} target="_blank" rel="noreferrer" aria-label={`Open full size: ${s.caption}`}>
              <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async" />
            </a>
            <figcaption>{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      {p.link && (
        <a className="btn project-link" href={p.link.href} target="_blank" rel="noreferrer">
          {p.link.label}
        </a>
      )}
      {p.team && <p className="meta team">{p.team}</p>}
    </article>
  )
}

export default function App() {
  const [simple, setSimple] = useState(initialSimple)
  const [active, setActive] = useState(0)
  // Continuous tour position: 2.4 means 40% of the way from stop 2 to stop 3.
  const progress = useRef(0)

  useEffect(() => {
    document.documentElement.classList.toggle('simple', simple)
    try {
      localStorage.setItem('view', simple ? 'simple' : 'desk')
    } catch {}
  }, [simple])

  useEffect(() => {
    const sections = stops.map((s) => document.getElementById(s.id)!)
    const update = () => {
      const mid = scrollY + innerHeight * 0.5
      let i = sections.length - 1
      while (i > 0 && sections[i].offsetTop > mid) i--
      const el = sections[i]
      const t = Math.min(1, Math.max(0, (mid - el.offsetTop) / el.offsetHeight))
      // Hold the camera on a stop while its sheet is read; travel only near the end.
      const travel = i < sections.length - 1 ? Math.max(0, (t - 0.72) / 0.28) : 0
      progress.current = i + travel
      setActive(i)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      {!simple && (
        <Suspense fallback={null}>
          <Scene progress={progress} active={active} reducedMotion={reducedMotion} onSelect={goTo} />
        </Suspense>
      )}

      <header className="bar">
        <a className="mark" href="#desk">
          {profile.short}
        </a>
        <nav aria-label="Tour stops" className="rail">
          {stops.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="stop" aria-current={i === active ? 'true' : undefined}>
              <span className="stop-n">{String(i + 1).padStart(2, '0')}</span> {s.label}
            </a>
          ))}
        </nav>
        <div className="bar-actions">
          <button type="button" className="link" onClick={() => setSimple(!simple)} aria-pressed={simple}>
            {simple ? 'Desk view' : 'Simple view'}
          </button>
          {profile.cv && (
            <a className="link" href={profile.cv} download>
              CV
            </a>
          )}
        </div>
      </header>

      {/* From the first project on; on the desk stop the name already heads the page. */}
      {!simple && active > 0 && (
        <p className="stamp" aria-hidden="true">
          <span className="stamp-n">{String(active + 1).padStart(2, '0')}</span>
          <span>{stopYear(stops[active].id)}</span>
          <span>{stops[active].label}</span>
        </p>
      )}

      <main>
        <section id="desk" className="stop-section hero">
          <div className="hero-copy">
            <h1>{profile.name}</h1>
            <p className="roles">{profile.roles.join(' · ')}</p>
            <p className="lede">{profile.summary}</p>
            <div className="actions">
              <a className="btn" href="#bantay">
                Start the tour
              </a>
              <a className="btn btn-quiet" href={`mailto:${profile.email}`}>
                Email me
              </a>
            </div>
            <p className="hint" aria-hidden="true">
              Scroll, or click anything on the desk.
            </p>
          </div>
        </section>

        {projects.map((p) => (
          <section key={p.id} id={p.id} className="stop-section">
            <ProjectSheet p={p} />
          </section>
        ))}

        <section id="skills" className="stop-section">
          <article className="sheet">
            <h2>Skills</h2>
            <div className="skills">
              {skills.map((g) => (
                <section key={g.group} aria-labelledby={`skills-${g.group}`}>
                  <h3 id={`skills-${g.group}`}>{g.group}</h3>
                  <ul className="tags" aria-label={`${g.group}, core`}>
                    {g.core.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <p className="more">
                    <span>Also:</span> {g.more.join(', ')}
                  </p>
                </section>
              ))}
            </div>
          </article>
        </section>

        <section id="contact" className="stop-section">
          <article className="sheet">
            <h2>Let’s talk</h2>
            <p>
              {profile.location}. {profile.remote}.
            </p>
            <ul className="contact">
              <li>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
            {profile.cv && (
              <a className="btn" href={profile.cv} download>
                Download CV (PDF)
              </a>
            )}
          </article>
        </section>
      </main>
    </>
  )
}
