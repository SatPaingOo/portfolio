import { PortfolioData } from './types';

export const PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    name: "Sat Paing Oo",
    title: "Full Stack & Applied AI Engineer",
    summary: "Full stack engineer with 5+ years building production POS and e-commerce platforms in React, Next.js, Node.js and C#/.NET. Applies AI in practice: Gemini features in shipped apps, a self-scheduling multi-model LLM pipeline with grounded fact-checking, and a disk-backed engine serving a 61 GB MoE model on a 31 GB laptop.",
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
      { name: "Next.js 15", level: "Expert" },
      { name: "Vite", level: "Proficient" },
      { name: "Redux/Zustand", level: "Proficient" },
      { name: "Bootstrap", level: "Expert" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "Framer Motion", level: "Proficient" },
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
      { name: "LLM App Integration (Gemini, Groq, OpenRouter)", level: "Proficient" },
      { name: "AI Pipelines: Model Routing & Grounded Verification", level: "Proficient" },
      { name: "Local LLM Inference (MoE, Quantization, C Kernels)", level: "Familiar" },
      { name: "Clean Architecture & Domain-Driven Design", level: "Proficient" },
      { name: "Database Design & Optimization (MS SQL, MySQL)", level: "Expert" },
      { name: "Continuous Integration & Delivery", level: "Proficient" }
    ]
  },
  employmentHistory: [
    {
      company: "OMS Company (Thailand-based)",
      position: "Full Stack Software Engineer – POS & E‑Commerce Platforms",
      duration: "2019 - Present",
      responsibilities: [
        "Develop and maintain AXTRA POS and e‑commerce platforms for merchants and members using React, React Native, C#/.NET, MS SQL Server, and Bootstrap.",
        "Implement and evolve core AXTRA POS modules including inventory management, inventory reporting, restaurant floor‑plan configuration, and table reservation/booking workflows.",
        "Own the inventory and costing domain: FIFO cost rebuilds and their determinism, package and discount costing, daily inventory balance backfills with a background scheduler, stock adjustments, batch expiry reporting, and the profit and loss figures that depend on them.",
        "Design and build the offline mode for AXTRA POS as a local-first layer with pull and push stored procedures, host and client device registration, offline guards in the apps, and an embedded Node API kept identical between the React Native merchant app and the Electron desktop POS.",
        "Independently designed and developed the Local IIS Auto-Deploy desktop application (Electron and React) that turns an 8 to 16 hour AXTRA POS server installation into a 30 to 60 minute guided run covering IIS sites, bundled SQL Server install, database restore, versioned SQL scripts, network setup and version-based updates, packaged so a non-technical shop owner can run it.",
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
      role: "Full Stack Software Engineer – AXTRA POS & E‑Commerce Platform",
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
      id: 8,
      title: "Information Hub - Autonomous AI Intelligence Library",
      role: "Solo Applied AI Engineer – Self-Scheduling LLM Data Pipeline",
      technologies: ["Python", "GitHub Actions", "Gemini Search Grounding", "Groq", "OpenRouter", "D3.js", "Tailwind CSS", "pytest"],
      challenge: "Build a daily intelligence library of world, tech, politics and product news that writes deep-dive briefings and fact-checks its own claims, running entirely on free tiers with no server, no fixed schedule and no manual upkeep.",
      solution: "Built a two-phase Python pipeline on GitHub Actions. The collect phase gathers RSS, arXiv, Hacker News and GitHub sources, deduplicates them, and has Groq and OpenRouter free models write deep-dives, discovering free models at run time and rotating to the next model or provider on rate limits and errors. The check phase verifies claims with Gemini search grounding and scores every item. A pre-call gate enforces provider cooldowns and token budgets, and the pipeline rewrites its own cron to the next moment collection is possible. Records are stored as raw frames, Markdown previews and schema-validated JSON, classified by region, content type, topic and category, and published to a static library site with a D3 knowledge graph.",
      metrics: "Runs at zero cost on GitHub Actions and free AI tiers, with a full provenance trail on every item showing which provider and model wrote it, which model checked it and its grounding score. Items scoring below 0.5 stay in pending review instead of being marked verified, and the live site re-renders automatically whenever the pipeline commits new data.",
      links: {
        liveDemo: "https://satpaingoo.github.io/information-hub/",
        github: "https://github.com/SatPaingOo/information-hub"
      }
    },
    {
      id: 9,
      title: "Joule - Disk-Backed MoE LLM Inference Engine",
      role: "Solo AI Systems Engineer – Local LLM Inference Research",
      technologies: ["Python", "C", "PyTorch", "Hugging Face Transformers", "Q4 Quantization", "Mixture of Experts", "OpenAI-compatible API"],
      challenge: "Serve a Mixture-of-Experts language model larger than the machine's RAM on a CPU-only laptop by treating weights like a database: keep them on disk, load only what each token needs, and release them after use.",
      solution: "Built a config-driven inference engine covering 7 architecture families that loads only the router's active expert set per token. Wrote a native C batch-decode kernel with Q4 quantized matrix multiplication whose output is bit-identical to single-stream decoding, plus an OpenAI-compatible server with browser chat. Every kernel is checked against Hugging Face Transformers, and every claim traces to a measured entry in the validation log, including the ideas that failed.",
      metrics: "Served the 61 GB Qwen3-30B-A3B on a 31 GB laptop with RAM proportional to the working set and budget-invariant outputs, and verified the native kernel against Hugging Face on 5 models. Measurements also disproved per-query layer selection and claims of 30-150 tok/s on a laptop: single-stream decode is memory-bandwidth-bound at about 7-10 tok/s, with a measured real serving aggregate of 3-5 tok/s.",
      links: {
        liveDemo: null,
        github: "https://github.com/SatPaingOo/joule"
      }
    },
    {
      id: 11,
      title: "EventPulse - Event-Driven Market Intelligence",
      role: "Solo Applied AI Engineer - LLM Pipeline & Self-Scored Track Record",
      technologies: ["Python", "GitHub Actions", "Groq", "OpenRouter", "GitHub Pages", "pytest"],
      challenge: "Explain why gold, oil and large company prices moved, and keep an honest record of whether those explanations predict anything, without paying for a model, a server or a data feed.",
      solution: "Built a Python pipeline that ingests prices and news, extracts events, writes a causal note for every significant move, then makes structured predictions carrying direction, horizon, threshold and confidence. Scoring is deterministic and never touches a model, so the track record cannot flatter itself. Free models do the writing through a pool that falls through Groq to OpenRouter, lists free text and JSON capable models at run time, rests any model that rate limits and drops one that disappears. The core knows nothing about GitHub: a scheduled Actions workflow calls the command line interface, commits the records and publishes the static site.",
      metrics: "After a bug was found that voided predictions on their expiry day, every expired prediction was rescored: 294 of them, 108 hits and 186 misses, a 36.7 percent hit rate the site publishes as it stands. The whole system runs on free tiers, and it is published as research rather than financial advice.",
      links: {
        liveDemo: "https://satpaingoo.github.io/eventpulse/",
        github: null
      }
    },
    {
      id: 10,
      title: "Offline-First POS - Hybrid Local DB & Cloud Sync",
      role: "Full Stack Engineer - Offline Mode & Sync Architecture",
      technologies: ["C#/.NET 6", "MS SQL Server", "SQLite", "React Native", "Electron", "Node.js", "SignalR"],
      challenge: "Keep shops selling when the internet or the cloud goes down, with one host device and several client devices on the shop network, then reconcile everything back to the cloud without losing or duplicating orders.",
      solution: "Designed a local-first layer across the .NET API, the React Native merchant app and the Electron desktop POS. Pull procedures bring catalogue, inventory, orders, tables and users down to the local database, push procedures send orders, cancellations and combined bills back to the cloud, and a device registration table decides which device acts as host while the rest stay read-only clients. The embedded Node API is mirrored byte for byte inside both apps, so one fix serves the phone and the desktop, and offline guards keep online-only screens out of reach while disconnected.",
      metrics: "Delivered a full tester build in September 2026 covering the Android app, the Windows installer, the published API and the database scripts grouped into required, merge-check and decision tiers. Two rounds of tester findings are documented with root cause and fix, including bill rounding drift, tables leaking across shops, reservations shifted by timezone and bills minted without a number.",
      links: {
        liveDemo: null,
        github: null
      }
    },
    {
      id: 2,
      title: "AXTRA POS Local IIS Auto-Deploy",
      role: "Solo Developer - AXTRA POS Deployment Tooling",
      technologies: ["Electron", "React 19", "Vite", "PowerShell", "IIS", "MS SQL Server", "Batch (.bat)", "NSIS"],
      challenge: "Let a shop owner with no IT background stand up a complete AXTRA POS local server alone, instead of paying an engineer to spend a day on IIS, SQL Server, database restore and network configuration.",
      solution: "Built a Windows desktop app with Electron, React 19 and Vite that runs the whole deployment as guided tasks. It checks the machine, creates IIS sites in either one-site or two-site mode and cleans up the mode it replaces, installs the URL Rewrite module, installs SQL Server from an installer bundled in the app so no internet is needed, creates or restores the database, runs versioned SQL scripts in order and applies network settings. A status panel reports IIS service health with a one-click start, version checks drive updates, and the app ships its own license agreement, user guide, app download links with QR codes and an issue reporter.",
      metrics: "Turns an 8 to 16 hour expert installation into a 30 to 60 minute guided run that a non-technical shop owner can finish. Now at version 3.0.2, shipped as a licensed Windows build for AXTRA POS deployments with in-app guides, version checks, app download links and an issue reporter.",
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
      role: "Full Stack Software Engineer – Astrology & Numerology Web Application",
      technologies: ["React", "TypeScript", "Vite", "Firebase", "Firestore", "Tailwind CSS", "Gemini AI", "html2canvas", "React Router"],
      challenge: "Create an intuitive, bilingual web application that combines Myanmar Mahabote astrology, Western Numerology, and AI-powered insights to provide users with personalized cosmic blueprint reflections and compatibility analysis, while maintaining cultural authenticity and modern UX design.",
      solution: "Built a client-side React application with Vite that integrates Myanmar Mahabote chart calculations (7 houses), Western Numerology (Birth Day # and Life Path #), Western/Chinese Zodiac compatibility analysis, and optional Gemini AI Oracle readings (quick/deep modes). Implemented comprehensive bilingual support (English/Myanmar) with dynamic content switching, Firebase Firestore for visitor tracking, analytics, and user feedback collection. Developed image export functionality using html2canvas for shareable Magic Cards (Identity Cards, Vibe Cards, Sync Cards) and created a multi-route system for detailed zodiac, numerology, and day sign pages with rich content management.",
      metrics: "Delivered a production-ready astrology platform deployed on Firebase Hosting with real-time visitor analytics, daily statistics tracking, user feedback system with rating and categorization, and seamless AI integration. Enabled users to generate personalized cosmic insights, compatibility scores, and shareable visual cards while providing deep Oracle readings through AI-powered analysis. Implemented comprehensive tracking for visitor behavior, calculation patterns, card downloads, and feature usage to support data-driven improvements.",
      links: {
        liveDemo: "https://www.karmicmirror.app/",
        github: null
      }
    },
    {
      id: 6,
      title: "VaultGuard Pro - Neural Security Operations Center",
      role: "Solo Full Stack Software Engineer – AI-Powered Security Scanner",
      technologies: ["React", "TypeScript", "Vite", "Gemini 3 Pro/Flash", "Google AI Studio", "Tailwind CSS", "jsPDF", "Leaflet", "Framer Motion", "React Router"],
      challenge: "Build a frontend-only Security Operations Center (SOC) that performs comprehensive vulnerability scanning without requiring backend infrastructure, using AI-powered analysis to overcome browser security limitations and provide enterprise-grade security assessments with real-time CVE database cross-referencing.",
      solution: "Developed a pure frontend React application leveraging Google Gemini 3 Pro (32,768 token thinking budget) and Flash models for neural vulnerability analysis. Implemented multi-tier scanning system (FAST/STANDARD/DEEP) with parallel data collection (DOM, OSINT, Headers, SSL, DNS), real-time CVE cross-referencing via Google Search Grounding, automatic PII masking, and comprehensive security reporting. Created Vault Academy - an integrated educational knowledge base with multi-language support (EN/MM) for OWASP Top 10, CVE, SSL/TLS, DNS, Headers, and Tech DNA security topics. Built SOC-grade PDF export functionality with 100% UI-to-PDF content synchronization, real-time telemetry logging, confidence-based vulnerability reporting, and automated retry logic with exponential backoff. Implemented batch probe execution (3 at a time), response caching (SSL/DNS cached for 24h/1h), and tier-based data transmission to optimize token usage by 30-50%.",
      metrics: "Delivered a production-ready security scanner deployed on Vercel (https://vaultguard-pro.vercel.app/) with 2-3x faster data collection through parallel execution (5-8s vs 15-20s), 30-50% token reduction via tier-based optimization, and comprehensive vulnerability detection including OWASP Top 10, technology stack DNA mapping, forensic logic chaining, and business logic flaw detection. Achieved ~95-100% scan accuracy with CORS extension support, with AI compensation mode providing ~60-70% accuracy for standard browser usage. Reduced total scan times by 25-40% (FAST: 20-30s, STANDARD: 40-60s, DEEP: 90-150s) and achieved 30-40% cost savings through smart caching and optimized data transmission. Implemented real-time mission telemetry, data quality assessment with trust scores, and comprehensive vulnerability ledger with full remediation directives.",
      links: {
        liveDemo: "https://vaultguard-pro.vercel.app/",
        github: "https://github.com/SatPaingOo/VAULTGUARD_PRO.git"
      }
    },
    {
      id: 7,
      title: "Gita Gravity",
      role: "Solo Full Stack Developer & Designer",
      technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "YouTube Search API", "React Player"],
      challenge: "Create a high-fidelity, frictionless music discovery platform that helps users find music matching their exact mood and energy level without the clutter of account creation or ads, while ensuring high performance and a premium 'cosmic' aesthetic.",
      solution: "Engineered a Next.js application with a 5-step interactive logic-based personalization flow. Integrated YouTube Search API for dynamic playlist generation and used React Player for seamless audio-visual feedback. Implemented a futuristic 'cosmic' dark theme with Framer Motion for smooth transitions and a premium music console experience.",
      metrics: "Achieved an instant, zero-friction music discovery loop (Set Vibe -> Curate -> Play). Delivered a high-performance web experience with 100% client-side playback and a state-of-the-art UI that maximizes user engagement through emotional and situational music matching.",
      links: {
        liveDemo: "https://gitagravity.vercel.app/",
        github: null
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