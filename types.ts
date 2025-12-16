export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  location: string;
  languagesSpoken: string[];
}

export interface SkillItem {
  name: string;
  level: string;
}

export interface Skills {
  coreLanguages: SkillItem[];
  frontendFrameworks: SkillItem[];
  backendAndDevOps: SkillItem[];
  specialty: SkillItem[];
}

export interface Employment {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
}

export interface Certification {
  name: string;
  year: number;
  issuer: string;
}

export interface ProjectLinks {
  liveDemo: string | null;
  github: string | null;
}

export interface Project {
  id: number;
  title: string;
  role: string;
  technologies: string[];
  challenge: string;
  solution: string;
  metrics: string;
  links: ProjectLinks;
}

export interface GalleryPhoto {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  date?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skills;
  employmentHistory: Employment[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  gallery?: GalleryPhoto[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  skipTyping?: boolean; // Skip typing animation for initial messages
}

export enum ViewMode {
  HOME = 'HOME',
  PROJECTS = 'PROJECTS',
  SKILLS = 'SKILLS',
  HISTORY = 'HISTORY',
  GALLERY = 'GALLERY'
}