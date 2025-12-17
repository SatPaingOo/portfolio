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
      position: "Full Stack Developer (POS & E-Commerce)",
      duration: "2019 - Present",
      responsibilities: [
        "System design and develop POS and e-commerce systems for merchants and members using React, C#/.NET, MS SQL Server, and Bootstrap.",
        "Implemented and supported AXTRA POS modules (inventory, inventory reports, floor plan, table reservation) from Myanmar between 2019 and 2024, then continued on-site/remote from Thailand from 2025 onward.",
        "Collaborate with stakeholders in both Myanmar and Thailand to gather requirements and continuously improve system usability and performance.",
        "2019 - Present (Myanmar: 2019 - 2024, Thailand: 2025 - Present)"
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
      name: "Certificate – Python Programming & Data Engineering (ETL, ELT, Data Pipeline)",
      year: 2025,
      issuer: "Myanmar Data Tech (MMDT)"
    }
  ],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform for Axtra POS Merchants & Members",
      role: "Full Stack Developer",
      technologies: ["React", "React Native", "Electron", "C#/.NET", "MS SQL Server", "Bootstrap"],
      challenge: "Build a unified e-commerce and POS platform for merchants and members, including inventory, reporting, and table management for restaurants.",
      solution: "Implemented web and mobile apps with React and React Native, a C#/.NET backend with MS SQL Server, covering inventory management, inventory reports, floor plan configuration, and table reservation/booking flows.",
      metrics: "Improved inventory accuracy and reduced manual reconciliation time for merchants while enabling real-time table availability and reservation for customers.",
      links: {
        liveDemo: "https://shop.axtrapos.com/",
        github: null
      }
    },
    {
      id: 2,
      title: "Local AXTRA Auto-Deploy Application",
      role: "Full Stack / DevOps Developer",
      technologies: ["React", "Electron", "Batch (.bat)", "PowerShell", "IIS", "MS SQL Server"],
      challenge: "Reduce manual setup time and human error when deploying the local AXTRA application across Windows servers, including IIS site creation, SQL Server database setup, and static IP/network configuration.",
      solution: "Built a desktop UI using React and Electron that guides operators through a few configuration fields, then automatically generates and executes bat and PowerShell scripts to install prerequisites, configure IIS, restore or create SQL Server databases, and apply static IP/network settings.",
      metrics: "Cut local environment provisioning time from hours to minutes and standardized deployments to be reproducible with a single UI-driven workflow.",
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