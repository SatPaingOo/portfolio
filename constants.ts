import { PortfolioData } from './types';

export const PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    name: "Sat Paing Oo",
    title: "Full Stack Developer (React, .NET & Node.js)",
    summary: "Full stack developer with 5+ years of hands-on experience designing and building web, mobile, and desktop applications using React, Redux, Node.js, C#/.NET, .NET Core and Python on MS SQL Server, MySQL and Windows Server, with a strong focus on clean architecture and CI/CD automation.",
    contact: {
      email: "satpaingoo777@gmail.com",
      linkedin: "https://www.linkedin.com/in/satpaingoo777/",
      github: "https://github.com/SatPaingOo"
    },
    location: "Thailand",
    languagesSpoken: ["Burmese (Native)", "English (Fluent)", "Japanese (Basic)"]
  },
  skills: {
    coreLanguages: [
      { name: "JavaScript/TypeScript", level: "Expert" },
      { name: "C#", level: "Expert" },
      { name: "Python", level: "Proficient" }
    ],
    frontendFrameworks: [
      { name: "React", level: "Expert" },
      { name: "React Native", level: "Familiar" },
      { name: "Electron", level: "Familiar" },
      { name: "Next.js", level: "Proficient" },
      { name: "Vite", level: "Proficient" },
      { name: "Redux/Zustand", level: "Proficient" },
      { name: "Bootstrap", level: "Expert" },
      { name: "Tailwind CSS", level: "Proficient" },
      { name: "Framer Motion", level: "Familiar" },
      { name: "React Router", level: "Expert" },
    ],
    backendAndDevOps: [
      { name: "Node.js", level: "Expert" },
      { name: "C# / .NET", level: "Expert" },
      { name: ".NET Core", level: "Expert" },
      { name: "Python", level: "Proficient" },
      { name: "Firebase", level: "Proficient" },
      { name: "MS SQL Server", level: "Expert" },
      { name: "MySQL", level: "Proficient" },
      { name: "Windows Server", level: "Proficient" },
      { name: "CI/CD (GitHub Actions)", level: "Familiar" }
    ],
    specialty: [
      { name: "Full Stack Web Applications", level: "Expert" },
      { name: "React & Redux SPA Architecture", level: "Expert" },
      { name: "AI Integration (Gemini AI)", level: "Proficient" },
      { name: "Clean Architecture & Domain-Driven Design", level: "Proficient" },
      { name: "Database Design & Optimization (MS SQL, MySQL)", level: "Expert" },
      { name: "Continuous Integration & Delivery", level: "Proficient" }
    ]
  },
  employmentHistory: [
    {
      company: "OMS Company (Thailand-based)",
      position: "Full Stack Developer – POS & E‑Commerce Platforms",
      duration: "2019 - Present",
      responsibilities: [
        "Develop and maintain AXTRA POS and e‑commerce platforms for merchants and members using React, React Native, C#/.NET, MS SQL Server, and Bootstrap.",
        "Implement and evolve core AXTRA POS modules including inventory management, inventory reporting, restaurant floor‑plan configuration, and table reservation/booking workflows.",
        "Independently designed and developed the Local AXTRA Auto‑Deploy desktop application (React & Electron) that automates IIS site setup, SQL Server database creation/restore, and static IP/network configuration via batch and PowerShell scripts.",
        "Develop a car showroom and test‑drive booking web application for automotive dealers, enabling them to upload vehicle listings, manage photos, and handle online enquiries and appointment requests.",
        "Deliver and support AXTRA POS rollouts from Myanmar (2019–2024), then transition to a hybrid on‑site/remote role based in Thailand from 2025 onward.",
        "Collaborate with stakeholders and on‑site teams in Myanmar and Thailand to gather requirements, refine deployment and operations workflows, and continuously improve system performance and usability."
      ]
    },
    {
      company: "Family Fuel Sales Business (Home-based)",
      position: "Family Business Assistant",
      duration: "2012 - 2016",
      responsibilities: [
        "Supported day-to-day operations of a home-based family fuel sales business.",
        "Helped with basic record-keeping, customer communication, and inventory checks.",
        "Gained practical experience in responsibility, teamwork, and time management while assisting parents."
      ]
    }
  ],
  education: [
    {
      institution: "Coursera",
      degree: "React Basics and Advanced React course by Meta.",
      duration: "July - August 2025"
    },
    {
      institution: "Myanmar Data Tech(MMDT) ",
      degree: "Python Programming Course and data engineering course ETL & ELT & data pipeline",
      duration: "January - April 2025"
    },
    {
      institution: "Myanmar Management Institute",
      degree: "Business Management Course",
      duration: "June 2020 - August 2020"
    },
    {
      institution: "Myanmar IT Consulting",
      degree: "Introductory Programming & Web Development (HTML, CSS, JavaScript, Bootstrap, WordPress, PHP, MySQL)",
      duration: "October - November 2018"
    },
    {
      institution: "Metro IT & Japanese Language Center",
      degree: "IT Diploma (IT Fundamentals, Management, Technology & Programming Logic) and Japanese Language",
      duration: "2016 - 2018"
    },
    {
      institution: "Magway University",
      degree: "Bachelor of Arts (History)",
      duration: "2010 - 2012"
    }
  ],
  certifications: [
    {
      name: "Certificate of Completion – React Basics & Advanced React (Meta)",
      year: 2025,
      issuer: "Coursera / Meta"
    },
    {
      name: "Diploma in Information Technology & Japanese Language",
      year: 2018,
      issuer: "Metro IT & Japanese Language Center"
    },
    {
      name: "Business Management Certificate",
      year: 2020,
      issuer: "Myanmar Management Institute"
    }
  ],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform for Axtra POS Merchants & Members",
      role: "Full Stack Developer – AXTRA POS & E‑Commerce Platform",
      technologies: ["React", "React Native", "Electron", "C#/.NET", "MS SQL Server", "Bootstrap"],
      challenge: "Unify AXTRA POS with a modern e-commerce experience so merchants and members can manage products, orders, inventory, and restaurant table bookings across web, mobile, and in‑store channels.",
      solution: "Implemented a multi-tenant web and mobile platform using React and React Native with a C#/.NET + MS SQL Server backend, integrating tightly with AXTRA POS for real-time inventory, reporting, floor-plan configuration, and table reservation/booking workflows.",
      metrics: "Reduced manual data entry and reconciliation, improved inventory accuracy for merchants, and enabled real-time table availability and online booking for customers across Myanmar and Thailand.",
      links: {
        liveDemo: "https://shop.axtrapos.com/",
        github: null
      }
    },
    {
      id: 2,
      title: "Local AXTRA Auto-Deploy Application",
      role: "Solo Full Stack / DevOps Engineer – AXTRA Deployment Tooling",
      technologies: ["React", "Electron", "Batch (.bat)", "PowerShell", "IIS", "MS SQL Server"],
      challenge: "Eliminate slow and error‑prone manual installation of AXTRA POS local servers (IIS sites, SQL databases, and network configuration) at customer locations.",
      solution: "Independently built a desktop deployment assistant with React and Electron that collects a few configuration inputs, then generates and runs batch/PowerShell scripts to install prerequisites, configure IIS sites, create/restore SQL Server databases, and apply static IP and network settings consistently.",
      metrics: "Cut on‑site environment provisioning from hours to minutes, reduced configuration mistakes, and standardized AXTRA POS deployments into a repeatable, UI‑driven process.",
      links: {
        liveDemo: null,
        github: null
      }
    },
    {
      id: 3,
      title: "Exam Testing & Practice Platform",
      role: "Frontend Developer",
      technologies: ["React", "Vite", "JavaScript (JSX)", "SCSS", "ESLint", "JSON"],
      challenge: "Provide a fast, user-friendly platform for practicing and taking certification-style exams such as ITPEC and JLPT, with support for multiple categories and flexible quiz modes.",
      solution: "Built a React + Vite single-page application with SCSS styling and JSON-based exam data, including timed and practice quiz modes, result tracking, and an admin dashboard for managing questions and exam categories.",
      metrics: "Enabled learners to repeatedly practice categorized questions with instant feedback and historical result visibility, improving exam preparation efficiency.",
      links: {
        liveDemo: "https://satpaingoo.github.io/exam-test",
        github: "https://github.com/SatPaingOo/exam-test.git"
      }
    },
    {
      id: 4,
      title: "Football Data Engineering & Scraping Project",
      role: "Backend / Data Engineer",
      technologies: ["Python", "Flask", "FastAPI", "SQLite", "Requests", "Selenium", "BeautifulSoup", "GitHub Actions"],
      challenge: "Create a small data engineering project that scrapes rich football data from external sites, stores it in SQLite, and exposes it through APIs while keeping one month of data up to date via CI.",
      solution: "Built scraping services using Selenium and BeautifulSoup to load and parse fbref player pages into SQLite, wrapped the data access in Flask and FastAPI APIs (including paginated/sortable player endpoints), and scheduled a GitHub Actions workflow to run the pipeline, fetch new data, update the SQLite database and logs, and push changes back to the GitHub repo.",
      metrics: "Demonstrated an automated, CI-driven data ingestion and API layer with reproducible setup (venv, FastAPI/uvicorn run scripts) suitable as a data engineering test project.",
      links: {
        liveDemo: null,
        github: "https://github.com/SatPaingOo/football-data-project.git"
      }
    },
    {
      id: 5,
      title: "Karmic Mirror - Cosmic Blueprint Reflection Platform",
      role: "Full Stack Developer – Astrology & Numerology Web Application",
      technologies: ["React", "TypeScript", "Vite", "Firebase", "Firestore", "Tailwind CSS", "Gemini AI", "html2canvas", "React Router"],
      challenge: "Create an intuitive, bilingual web application that combines Myanmar Mahabote astrology, Western Numerology, and AI-powered insights to provide users with personalized cosmic blueprint reflections and compatibility analysis, while maintaining cultural authenticity and modern UX design.",
      solution: "Built a client-side React application with Vite that integrates Myanmar Mahabote chart calculations (7 houses), Western Numerology (Birth Day # and Life Path #), Western/Chinese Zodiac compatibility analysis, and optional Gemini AI Oracle readings (quick/deep modes). Implemented comprehensive bilingual support (English/Myanmar) with dynamic content switching, Firebase Firestore for visitor tracking, analytics, and user feedback collection. Developed image export functionality using html2canvas for shareable Magic Cards (Identity Cards, Vibe Cards, Sync Cards) and created a multi-route system for detailed zodiac, numerology, and day sign pages with rich content management.",
      metrics: "Delivered a production-ready astrology platform deployed on Firebase Hosting with real-time visitor analytics, daily statistics tracking, user feedback system with rating and categorization, and seamless AI integration. Enabled users to generate personalized cosmic insights, compatibility scores, and shareable visual cards while providing deep Oracle readings through AI-powered analysis. Implemented comprehensive tracking for visitor behavior, calculation patterns, card downloads, and feature usage to support data-driven improvements.",
      links: {
        liveDemo: "https://karmic-mirror.web.app/",
        github: null
      }
    },
    {
      id: 6,
      title: "VaultGuard Pro - Neural Security Operations Center",
      role: "Solo Full Stack Developer – AI-Powered Security Scanner",
      technologies: ["React", "TypeScript", "Vite", "Gemini 3 Pro/Flash", "Google AI Studio", "Tailwind CSS", "jsPDF", "Leaflet", "Framer Motion", "React Router"],
      challenge: "Build a frontend-only Security Operations Center (SOC) that performs comprehensive vulnerability scanning without requiring backend infrastructure, using AI-powered analysis to overcome browser security limitations and provide enterprise-grade security assessments with real-time CVE database cross-referencing.",
      solution: "Developed a pure frontend React application leveraging Google Gemini 3 Pro (32,768 token thinking budget) and Flash models for neural vulnerability analysis. Implemented multi-tier scanning system (FAST/STANDARD/DEEP) with parallel data collection (DOM, OSINT, Headers, SSL, DNS), real-time CVE cross-referencing via Google Search Grounding, automatic PII masking, and comprehensive security reporting. Created Vault Academy - an integrated educational knowledge base with multi-language support (EN/MM) for OWASP Top 10, CVE, SSL/TLS, DNS, Headers, and Tech DNA security topics. Built SOC-grade PDF export functionality with 100% UI-to-PDF content synchronization, real-time telemetry logging, confidence-based vulnerability reporting, and automated retry logic with exponential backoff. Implemented batch probe execution (3 at a time), response caching (SSL/DNS cached for 24h/1h), and tier-based data transmission to optimize token usage by 30-50%.",
      metrics: "Delivered a production-ready security scanner deployed on Vercel (https://vaultguard-pro.vercel.app/) with 2-3x faster data collection through parallel execution (5-8s vs 15-20s), 30-50% token reduction via tier-based optimization, and comprehensive vulnerability detection including OWASP Top 10, technology stack DNA mapping, forensic logic chaining, and business logic flaw detection. Achieved ~95-100% scan accuracy with CORS extension support, with AI compensation mode providing ~60-70% accuracy for standard browser usage. Reduced total scan times by 25-40% (FAST: 20-30s, STANDARD: 40-60s, DEEP: 90-150s) and achieved 30-40% cost savings through smart caching and optimized data transmission. Implemented real-time mission telemetry, data quality assessment with trust scores, and comprehensive vulnerability ledger with full remediation directives.",
      links: {
        liveDemo: "https://vaultguard-pro.vercel.app/",
        github: "https://github.com/SatPaingOo/VAULTGUARD_PRO.git"
      }
    },
  ],
  gallery: [
    {
      id: 9,
      title: "Team Collaboration",
      description: "Development team working on microservices architecture",
      imageUrl: "https://picsum.photos/800/600?random=8",
      category: "Personal",
      date: "2024"
    },
  ]
};