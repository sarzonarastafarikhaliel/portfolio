// Single source of truth. Facts come from the CV (Rastafari_Sarzona_Resume.pdf) and, for BANTAY, the thesis defense deck.
// Phone number is deliberately absent: it lives only in public/cv.pdf.

export const profile = {
  name: 'Rastafari Khaliel Sarzona',
  short: 'R. K. Sarzona',
  roles: ['AI Specialist', 'Web Development', 'Automation'],
  location: 'Angeles City, Pampanga, Philippines',
  remote: 'Open to remote work',
  summary:
    'Welcome to my portfolio. I build AI systems, web applications and automations that save people time. Take a look around, and get in touch if you would like to work together.',
  email: 'rastafarisarzona2@gmail.com',
  linkedin: 'https://linkedin.com/in/rastafari-sarzona',
  github: 'https://github.com/sarzonarastafarikhaliel',
  // Set to '/cv.pdf' once the file is in public/. Empty hides every CV link so nothing 404s.
  cv: '',
}

export type Project = {
  id: string
  name: string
  title: string
  period: string
  summary: string
  stack: string[]
  role: { title: string; points: string[] }
  steps: string[]
  shots: { src: string; alt: string; caption: string; width: number; height: number }[]
  team?: string
  link?: { href: string; label: string }
}

// BANTAY facts come from the thesis defense deck (BANTAY Presentation.pptx, October 2026) and the CV.
// Screenshots are the app screens from that deck, copied unedited into public/projects/bantay/.
export const projects: Project[] = [
  {
    id: 'bantay',
    name: 'BANTAY',
    title: 'Turning handwritten barangay blotters into searchable records',
    period: 'Thesis · Angeles University Foundation · 2025–2026',
    summary:
      'Barangay Anunas wrote every incident report by hand in logbooks, so finding an old case took up to half an hour and monthly reports were counted by hand. BANTAY reads those pages, sorts each incident, and puts everything on one dashboard.',
    stack: ['Python', 'Flask', 'SQLite', 'Ollama', 'Gemma 4', 'SEA-LION', 'Google Cloud Vision', 'Gemini', 'Chart.js', 'Leaflet.js'],
    role: {
      title: 'Prototype developer and co-author, team of four',
      points: [
        'Built the web app, from scanning a page to the dashboard and map.',
        'Read, checked and labeled all 188 real records the system was tested on.',
        'Tested five AI models and picked the one that sorted incidents best.',
      ],
    },
    steps: [
      'Staff take a photo of a handwritten logbook page.',
      'BANTAY reads the handwriting and fills in the blotter form.',
      'An AI model suggests the type of incident, and a second model double-checks it.',
      'Staff confirm or correct the suggestion, and the record is saved securely with names hidden.',
      'The dashboard counts cases, shows trends and maps where incidents happen.',
    ],
    shots: [
      { src: '/projects/bantay/dashboard.png', width: 1878, height: 916, alt: 'BANTAY incident dashboard with record counts, review status and Katarungang Pambarangay referability totals', caption: 'The dashboard: every case at a glance.' },
      { src: '/projects/bantay/scan.png', width: 1228, height: 409, alt: 'New Blotter Record page with an upload field for a scanned logbook page', caption: 'Scanning a handwritten page.' },
      { src: '/projects/bantay/records.png', width: 1684, height: 863, alt: 'All Records table with filters for category, purok, status and date', caption: 'All records, searchable and filterable.' },
      { src: '/projects/bantay/hotspot-map.png', width: 1674, height: 526, alt: 'Hotspot map of incidents around Angeles City', caption: 'Where incidents are reported.' },
    ],
    team: 'With Jonnard Enzo Santos, Art Elvin Miranda and De Andre Antonio Williams · Adviser Dr. Joey S. Aviles · Built for Barangay Anunas, Angeles City',
  },
  {
    id: 'laredo',
    name: '24/7 Laredo',
    title: 'A local news website that updates itself',
    period: 'Freelance · Remote, for a client in Laredo, Texas · 2026',
    summary:
      '24/7 Laredo is a free, independent news outlet for Laredo and Webb County. I helped build its 14-page website on GoHighLevel, so the newsroom can publish a story once and see it appear across the whole site.',
    stack: ['GoHighLevel', 'HTML', 'CSS', 'JavaScript', 'RSS', 'Open-Meteo API', 'Google Analytics 4', 'Google AdSense', 'schema.org SEO', 'Python', 'Node.js'],
    role: {
      title: 'Freelance web developer, small development team',
      points: [
        'Built the front end of the site with custom HTML, CSS and JavaScript inside GoHighLevel.',
        'Connected the news feeds so stories, the breaking-news ticker and related articles update on their own.',
        'Added live Laredo weather, video and podcast sections, a cookie notice, analytics, ads and search-engine markup.',
        'Wrote a small script that checks every page for code errors before it goes live.',
      ],
    },
    steps: [
      'The newsroom publishes a story in GoHighLevel.',
      'The site pulls the new story from its feed and lists it by category: news, weather, business, community and announcements.',
      'The latest headlines run in the breaking-news bar, and the weather widget refreshes from live data.',
      'Readers search, filter by category, share stories and watch the latest videos.',
      'The cookie notice, analytics and ads load only after the reader chooses, and every article carries search-engine markup.',
    ],
    shots: [
      { src: '/projects/laredo/home.png', width: 1440, height: 900, alt: '24/7 Laredo home page with a breaking news bar, top story, weather widget and sponsored placements', caption: 'The home page: top story, live weather and breaking-news bar.' },
      { src: '/projects/laredo/news.png', width: 1440, height: 900, alt: '24/7 Laredo Current News page with category tabs and a top story', caption: 'News, filtered by category.' },
      { src: '/projects/laredo/weather.png', width: 1440, height: 900, alt: '24/7 Laredo weather page with current conditions and a seven-day forecast', caption: 'Live Laredo weather and forecast.' },
      { src: '/projects/laredo/home-mobile.png', width: 780, height: 1688, alt: '24/7 Laredo home page on a phone', caption: 'The same site on a phone.' },
    ],
    link: { href: 'https://247laredo.com/', label: 'Visit 247laredo.com' },
  },
  {
    id: 'brewview',
    name: 'BrewView',
    title: 'A coffee review site that reads the mood of every review',
    period: 'Web project · 2025',
    summary:
      'BrewView is a coffee-shop website where customers rate drinks and write reviews. The site reads each review, tells whether it is positive, neutral or negative, and gives staff a dashboard to manage the menu and see how customers feel.',
    stack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap 5', 'Chart.js', 'HTML', 'CSS'],
    role: {
      title: 'Web developer',
      points: [
        'Built the customer site: home page, menu by category and a page for each drink with its ratings.',
        'Built sign-up, login and password reset, with separate customer and staff accounts.',
        'Built the staff area to manage drinks, reviews and users, and a report of customer sentiment that can be exported.',
        'Added security basics: strong-password rules, locked accounts after repeated failed logins and a log of admin activity.',
      ],
    },
    steps: [
      'A customer browses the menu by category and opens a drink.',
      'They sign in, give a star rating and write a short review.',
      'The site scans the review for positive and negative words, and checks the result against the star rating, so a happy 5-star review is never marked negative.',
      'The drink page updates with its average rating and a breakdown of positive, neutral and negative reviews.',
      'Staff open the dashboard to manage the menu, moderate reviews and download a sentiment report.',
    ],
    shots: [
      { src: '/projects/brewview/home.png', width: 1440, height: 900, alt: 'BrewView home page with the headline Elevate Your Coffee Experience and a mountain view with a coffee cup', caption: 'The home page.' },
      { src: '/projects/brewview/home-mobile.png', width: 780, height: 1688, alt: 'BrewView home page on a phone', caption: 'The same page on a phone.' },
    ],
  },
]

export const experience = [
  {
    role: 'Freelance Web Developer',
    org: '24/7 Laredo',
    where: 'Remote · Laredo, Texas, USA',
    period: '07/2026 – 08/2026',
    note: 'Independent local news website · Small development team',
    points: [
      'Co-developed a 14-page news website with custom HTML, CSS, and JavaScript on the GoHighLevel platform.',
      'Built RSS-fed news feeds with category filters, site search, a breaking-news ticker, live weather (Open-Meteo API), and Facebook Reels and YouTube podcast embeds.',
      'Set up Google Analytics 4 with Consent Mode v2, Google AdSense, and schema.org SEO; wrote a Python/Node script that syntax-checks every page’s inline JavaScript before release.',
    ],
  },
  {
    role: 'Intern, Electronics & Documentation',
    org: 'A2K Group',
    where: 'Bacolor, Pampanga',
    period: '06/2024 – 07/2024',
    note: '',
    points: [
      'Produced technical documentation and circuit diagrams for a biometric access-system prototype.',
      'Diagnosed hardware and firmware faults, and assembled and soldered prototype components.',
    ],
  },
]

export const skills = [
  {
    group: 'Backend',
    items: ['Python', 'Flask', 'Node.js', 'Express.js', 'Jinja2', 'REST APIs', 'SQL', 'SQLite', 'pandas', 'NumPy', 'Ollama', 'Gemma 4', 'SEA-LION', 'Gemini (Vertex AI)', 'Google Cloud Vision', 'OCR (Tesseract, PaddleOCR)', 'LLM evaluation', 'Data labeling and quality review', 'Java', 'C++', 'Git and GitHub', 'pytest', 'Jupyter and Google Colab'],
  },
  {
    group: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Leaflet.js', 'GoHighLevel', 'Google Analytics 4', 'SEO and schema.org markup'],
  },
  // Design is the thinnest part of the CV; only what the CV supports is listed here.
  {
    group: 'Design',
    items: ['Responsive page layout', 'Technical documentation and circuit diagrams'],
  },
]

// Tour order. `id` doubles as the section anchor and the desk object that opens it.
export const stops = [
  { id: 'desk', label: 'Desk' },
  { id: 'bantay', label: 'BANTAY' },
  { id: 'laredo', label: '24/7 Laredo' },
  { id: 'brewview', label: 'BrewView' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export type StopId = (typeof stops)[number]['id']
