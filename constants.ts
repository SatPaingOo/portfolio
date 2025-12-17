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
      {name: "JavaScript/TypeScript", level: "Expert"},
      {name: "C#", level: "Expert"},
      {name: "Python", level: "Proficient"}
    ],
    frontendFrameworks: [
      {name: "React", level: "Expert"},
      {name: "React Native", level: "Familiar"},
      {name: "Electron", level: "Familiar"},
      {name: "Next.js", level: "Proficient"},
      {name: "Redux/Zustand", level: "Proficient"},
      {name: "Bootstrap", level: "Expert"},
      {name: "Tailwind CSS", level: "Familiar"},
    ],
    backendAndDevOps: [
      {name: "Node.js", level: "Expert"},
      {name: "C# / .NET", level: "Expert"},
      {name: ".NET Core", level: "Expert"},
      {name: "Python", level: "Proficient"},
      {name: "MS SQL Server", level: "Expert"},
      {name: "MySQL", level: "Proficient"},
      {name: "Windows Server", level: "Proficient"},
      {name: "CI/CD (GitHub Actions)", level: "Familiar"}
    ],
    specialty: [
      {name: "Full Stack Web Applications", level: "Expert"},
      {name: "React & Redux SPA Architecture", level: "Expert"},
      {name: "Clean Architecture & Domain-Driven Design", level: "Proficient"},
      {name: "Database Design & Optimization (MS SQL, MySQL)", level: "Expert"},
      {name: "Continuous Integration & Delivery", level: "Proficient"}
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