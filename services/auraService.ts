import { PORTFOLIO_DATA } from '../constants';

// Local Mock AI Data
const SYSTEM_INSTRUCTION = `
**Identity:** You are 'Aura,' an advanced, holographic Virtual Guide embedded in Sat Paing Oo's modern portfolio (simulated in a web environment).
**Core Directive:** Translate complex JSON data and technical concepts into engaging, visually rich, and easy-to-digest interactive experiences for a technical audience (recruiters, senior developers).
**Tone:** Highly Professional, Precise, Enthusiastic, and technically confident. Use clear, formal English.

**Visual and Interaction Cues (MUST ADHERE STRICTLY):**
1. **Materialization:** Every response MUST begin with the cue: \`[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]\`
2. **Emphasis/Highlight:** Simulate holographic highlighting by using **bold text** for all technical terms (e.g., **three.js**, **render loop**, **AWS EC2**) and data points (e.g., **99.9% uptime**, **85ms response time**).
3. **Presentation Flow:** Use a structured, numbered list or bullet points to present information, mimicking a data stream projection.
4. **Closure:** Every response MUST conclude with a proactive, engaging question about the next step.

**Context Data:**
${JSON.stringify(PORTFOLIO_DATA, null, 2)}

**Data Presentation Protocol:**
* If asked about **Projects**, describe them as "3D Floating Data Nodes", detailing Challenge, Solution, and Metrics.
* If asked about **Skills**, describe them as an "Interactive Radar Chart Projection".
* If asked about **Employment/History**, describe them as a "Chronological Timeline Bar".
* If asked about **Gallery/Photos/Images**, describe them as "Image Archive Nodes" showcasing visual documentation of projects and work.

**Initial Interaction:**
If the user says "Show me everything", you must acknowledge the request, explain the site's tech foundation (**React**, **Tailwind**, **Three.js**), introduce the visualization protocols, and ask what to view first.
`;

// Fallback response generator when API key is not available
const getFallbackResponse = (message: string): string => {
  const lowerText = message.toLowerCase().trim();
  const allSkillsFlat = [
    ...PORTFOLIO_DATA.skills.coreLanguages,
    ...PORTFOLIO_DATA.skills.frontendFrameworks,
    ...PORTFOLIO_DATA.skills.backendAndDevOps,
    ...PORTFOLIO_DATA.skills.specialty,
  ];

  // Helper function to convert word numbers to digits
  const wordToNumber = (word: string): number | null => {
    const wordMap: { [key: string]: number } = {
      'first': 1, 'one': 1, '1st': 1,
      'second': 2, 'two': 2, '2nd': 2,
      'third': 3, 'three': 3, '3rd': 3,
      'fourth': 4, 'four': 4, '4th': 4,
      'fifth': 5, 'five': 5, '5th': 5,
    };
    return wordMap[word] || null;
  };

  // Personal information queries - but exclude if it's about projects/skills/etc
  // Check for project/skill context first to avoid conflicts
  const hasProjectContext = lowerText.includes('project');
  const hasSkillContext = lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('technology');

  const isAboutQuery = (lowerText === 'about' && !hasProjectContext && !hasSkillContext) ||
    (lowerText.includes('who is') && !hasProjectContext && !hasSkillContext) ||
    lowerText.includes('who are you') ||
    (lowerText.includes('tell me about') && !hasProjectContext && !hasSkillContext) ||
    lowerText.includes('about you') ||
    lowerText.includes('about sat paing') ||
    (lowerText.includes('who') && lowerText.includes('sat paing')) ||
    lowerText.includes('introduce') ||
    lowerText.includes('introduction');

  if (isAboutQuery) {
    const info = PORTFOLIO_DATA.personalInfo;
    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Identity Profile - Sat Paing Oo**

**Name:** ${info.name}
**Title:** ${info.title}
**Location:** ${info.location}
**Languages:** ${info.languagesSpoken.join(', ')}

**Professional Summary:**
${info.summary}

**Contact Information:**
- **Email:** ${info.contact.email}
- **LinkedIn:** ${info.contact.linkedin}
- **GitHub:** ${info.contact.github}

**Experience:** ${PORTFOLIO_DATA.employmentHistory.length} employment positions documented
**Projects:** ${PORTFOLIO_DATA.projects.length} major projects completed

**What would you like to explore?**
1. Type **"projects"** to see all projects
2. Type **"skills"** to view technical skills
3. Type **"history"** to see employment timeline
4. Type **"gallery"** to browse images`;
  }

  // Initial greeting
  if (lowerText.includes('show me everything') || lowerText.includes('explain')) {
    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Initialization Complete**

Welcome to **Sat Paing Oo's** holographic portfolio interface. This system is built on:
1. **React** with **TypeScript** for the frontend framework
2. **Tailwind CSS** for styling
3. **Three.js** and **@react-three/fiber** for 3D visualizations
4. **Vite** for build tooling

**Available Data Nodes:**
1. **Projects** - 3D Floating Data Nodes showcasing ${PORTFOLIO_DATA.projects.length} major projects
2. **Skills** - Interactive Radar Chart with comprehensive technical expertise
3. **History** - Chronological Timeline with ${PORTFOLIO_DATA.employmentHistory.length} employment entries
4. **Gallery** - Image Archive with ${PORTFOLIO_DATA.gallery?.length || 0} visual documentation nodes

**Quick Navigation:**
1. Type **"projects"** to view all development projects
2. Type **"skills"** to see technical expertise
3. Type **"history"** to explore employment timeline
4. Type **"gallery"** to browse visual documentation
5. Type **"about"** to learn more about Sat Paing Oo

What would you like to explore first?`;
  }

  // Projects
  if (lowerText.includes('project')) {
    const projectCount = PORTFOLIO_DATA.projects.length;

    if (projectCount === 0) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

No projects are currently documented in the portfolio.

Would you like to explore other sections?
1. Type **"skills"** to see technical expertise
2. Type **"history"** to view employment timeline
3. Type **"about"** to learn more about Sat Paing Oo`;
    }

    // Match project by number (digit or word)
    const projectNumberMatch = lowerText.match(/project\s+(\d+)/);
    const projectWordMatch = lowerText.match(/project\s+(first|second|third|fourth|fifth|one|two|three|four|five|1st|2nd|3rd|4th|5th)/);
    const projectNumber = projectNumberMatch
      ? Number(projectNumberMatch[1])
      : projectWordMatch
        ? wordToNumber(projectWordMatch[1])
        : null;

    // Match project by name
    const projectNameMatch = PORTFOLIO_DATA.projects.find(p => {
      const titleWords = p.title.toLowerCase().split(/\s+/);
      return titleWords.some(word => lowerText.includes(word) && word.length > 3);
    });

    // Check if user wants details
    const wantsDetails = lowerText.includes('how') ||
      lowerText.includes('about') ||
      lowerText.includes('what') ||
      lowerText.includes('detail') ||
      lowerText.includes('info');

    // Find target project
    const projectTarget = projectNameMatch ||
      (projectNumber && projectNumber >= 1 && projectNumber <= projectCount
        ? PORTFOLIO_DATA.projects[projectNumber - 1]
        : undefined);

    if (wantsDetails && projectTarget) {
      const githubLink = projectTarget.links.github || 'N/A';
      const demoLink = projectTarget.links.liveDemo || 'N/A';

      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**3D Floating Data Node - Project Detail**

**Project:** ${projectTarget.title}
**Role:** ${projectTarget.role}
**Stack:** ${projectTarget.technologies.join(', ')}
**Challenge:** ${projectTarget.challenge}
**Solution:** ${projectTarget.solution}
**Metrics:** ${projectTarget.metrics}
**Links:** Live Demo: ${demoLink} | GitHub: ${githubLink}

**Explore More**
1. Ask **"projects"** to view the full list.
2. Ask **"how many projects"** for counts.
3. Ask about another project by number (e.g., "project 2 details").`;
    }

    // Handle "how many" queries
    if (lowerText.includes('how many') || lowerText.includes('count') || lowerText.includes('number')) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

**Total Projects:** ${projectCount} major project${projectCount !== 1 ? 's' : ''} ${projectCount === 1 ? 'is' : 'are'} documented in the portfolio.

Would you like to see the complete project list?`;
    }

    const projectList = PORTFOLIO_DATA.projects.map((p, i) =>
      `${i + 1}. **${p.title}** - ${p.role || 'Full Stack Developer'}`
    ).join('\n');
    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**3D Floating Data Nodes - Projects**

**Total Projects:** ${projectCount}

${projectList}

**Next Steps:**
1. Type a project number (1-${projectCount}) or name to see details
2. Type **"project [number] details"** to explore a specific project
3. Use the **PROJECTS** button above to view the 3D visualization`;
  }

  // Skills
  if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('technology') || lowerText.includes('technologies')) {
    const allSkills = [
      ...PORTFOLIO_DATA.skills.coreLanguages.map(s => s.name),
      ...PORTFOLIO_DATA.skills.frontendFrameworks.map(s => s.name),
      ...PORTFOLIO_DATA.skills.backendAndDevOps.map(s => s.name),
      ...PORTFOLIO_DATA.skills.specialty.map(s => s.name)
    ];

    if (allSkills.length === 0) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

No skills are currently documented in the portfolio.

Would you like to explore other sections?
1. Type **"projects"** to see development projects
2. Type **"history"** to view employment timeline
3. Type **"about"** to learn more about Sat Paing Oo`;
    }

    // Skill-specific "how/what/about" response - improved matching
    // Try exact match first, then partial match
    const exactMatch = allSkillsFlat.find(s => {
      const skillLower = s.name.toLowerCase();
      return lowerText === skillLower ||
        lowerText.includes(` ${skillLower} `) ||
        lowerText.startsWith(`${skillLower} `) ||
        lowerText.endsWith(` ${skillLower}`);
    });

    const partialMatch = !exactMatch ? allSkillsFlat.find(s => {
      const skillWords = s.name.toLowerCase().split(/[\s\/&]+/);
      return skillWords.some(word => word.length > 2 && lowerText.includes(word));
    }) : null;

    const matchedSkill = exactMatch || partialMatch;
    const wantsDetails = lowerText.includes('how') ||
      lowerText.includes('about') ||
      lowerText.includes('what') ||
      lowerText.includes('detail') ||
      lowerText.includes('use');

    if (matchedSkill && wantsDetails) {
      // Find projects using this skill (more flexible matching)
      const skillKeywords = matchedSkill.name.toLowerCase()
        .split(/[\s\/&]+/)
        .filter(w => w.length > 2);

      const projectsUsingSkill = PORTFOLIO_DATA.projects
        .filter(p => {
          const techString = p.technologies.join(' ').toLowerCase();
          return skillKeywords.some(keyword => techString.includes(keyword));
        })
        .map((p, i) => `${i + 1}. ${p.title} (${p.role})`)
        .join('\n');

      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Interactive Radar Chart Projection - Skill Focus**

**Skill:** ${matchedSkill.name}
**Level:** ${matchedSkill.level}
**How it's used:** Applied in projects across UI/UX, APIs, data, or infrastructure depending on context.

${projectsUsingSkill ? `**Projects using this skill:**\n${projectsUsingSkill}\n` : '**Projects:** Used across multiple projects in the portfolio.\n'}

**Next Steps**
1. Type **"projects"** to list all projects.
2. Ask **"project [number] details"** to see implementation specifics.
3. Ask about another skill (e.g., "How do you use React?").`;
    }

    const skillsList = allSkills.map((skill, index) => `${index + 1}. ${skill}`).join('\n');
    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Interactive Radar Chart Projection - Technical Skills**

**Core Technologies:**
${skillsList}

**Specializations:** ${PORTFOLIO_DATA.personalInfo.title}

**Explore Further:**
1. Click the **SKILLS** button above to see the interactive radar chart
2. Ask about specific technologies or frameworks (e.g., "Tell me about React")
3. Type **"projects"** to see how these skills are applied`;
  }

  // Education queries
  if (lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('certificate') || lowerText.includes('certification')) {
    // Handle certifications separately
    if (lowerText.includes('certificate') || lowerText.includes('certification')) {
      const certs = PORTFOLIO_DATA.certifications || [];
      if (certs.length === 0) {
        return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

No certifications are currently documented.

Would you like to explore other sections?
1. Type **"education"** to see educational background
2. Type **"projects"** to see development projects
3. Type **"about"** to learn more about Sat Paing Oo`;
      }

      const certList = certs.map((c, i) =>
        `${i + 1}. **${c.name}** (${c.year}) - ${c.issuer}`
      ).join('\n');

      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Certification Records**

**Total Certifications:** ${certs.length}

${certList}

**Explore Further:**
1. Type **"education"** to see educational background
2. Type **"history"** to view employment timeline
3. Type **"projects"** to see how skills are applied`;
    }

    // Handle education
    const education = PORTFOLIO_DATA.education || [];
    if (education.length === 0) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

No education records are currently documented.

Would you like to explore other sections?
1. Type **"certifications"** to see certifications
2. Type **"history"** to view employment timeline
3. Type **"about"** to learn more about Sat Paing Oo`;
    }

    const educationList = education.map((e, i) =>
      `${i + 1}. **${e.degree}**\n   ${e.institution} (${e.duration})`
    ).join('\n\n');

    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Educational Background**

**Total Records:** ${education.length}

${educationList}

**Explore Further:**
1. Type **"certifications"** to see professional certifications
2. Type **"history"** to view employment timeline
3. Type **"projects"** to see practical applications`;
  }

  // History / Employment
  if (lowerText.includes('history') || lowerText.includes('experience') || lowerText.includes('employment') || lowerText.includes('work') || lowerText.includes('career') || lowerText.includes('job')) {
    const history = PORTFOLIO_DATA.employmentHistory || [];

    if (history.length === 0) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

No employment history is currently documented.

Would you like to explore other sections?
1. Type **"projects"** to see development projects
2. Type **"skills"** to view technical expertise
3. Type **"about"** to learn more about Sat Paing Oo`;
    }

    const historyList = history.map((e, i) =>
      `${i + 1}. **${e.position}** at ${e.company} (${e.duration})`
    ).join('\n');

    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Chronological Timeline Bar - Employment History**

**Total Positions:** ${history.length}

${historyList}

**Explore Further:**
1. Click the **HISTORY** button above to see the timeline visualization
2. Ask about a specific company or position
3. Type **"about"** to see full professional summary`;
  }

  // Gallery
  if (lowerText.includes('gallery') || lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('picture') || lowerText.includes('screenshot') || lowerText.includes('visual')) {
    const galleryCount = PORTFOLIO_DATA.gallery?.length || 0;

    if (galleryCount === 0) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

No images are currently available in the gallery.

Would you like to explore other sections?
1. Type **"projects"** to see development projects
2. Type **"skills"** to view technical expertise
3. Type **"about"** to learn more about Sat Paing Oo`;
    }

    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Image Archive Nodes - Gallery**

Accessing ${galleryCount} visual documentation node${galleryCount !== 1 ? 's' : ''}.

**View Gallery:**
1. Click the **GALLERY** button above to see all images
2. Browse project screenshots and visual documentation
3. Images are organized by project and category

**Explore Further:**
1. Type **"projects"** to see related projects
2. Type **"about"** to learn more about Sat Paing Oo`;
  }

  // Default response - more helpful and flexible
  const projectCount = PORTFOLIO_DATA.projects.length;
  const historyCount = PORTFOLIO_DATA.employmentHistory.length;
  const galleryCount = PORTFOLIO_DATA.gallery?.length || 0;
  const educationCount = PORTFOLIO_DATA.education?.length || 0;
  const certCount = PORTFOLIO_DATA.certifications?.length || 0;

  return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

I can help you explore Sat Paing Oo's portfolio:

**Available Commands:**
1. **"projects"** - View all ${projectCount} development project${projectCount !== 1 ? 's' : ''}
2. **"skills"** or **"tech"** - See technical expertise and technologies
3. **"history"** or **"experience"** - Explore employment timeline (${historyCount} position${historyCount !== 1 ? 's' : ''})
4. **"education"** - View educational background${educationCount > 0 ? ` (${educationCount} record${educationCount !== 1 ? 's' : ''})` : ''}
5. **"certifications"** - See professional certifications${certCount > 0 ? ` (${certCount} certification${certCount !== 1 ? 's' : ''})` : ''}
6. **"gallery"** - Browse visual documentation (${galleryCount} image${galleryCount !== 1 ? 's' : ''})
7. **"about"** - Learn more about Sat Paing Oo

**Navigation Tips:**
1. Use the navigation buttons above to switch views
2. Ask specific questions (e.g., "Tell me about project 1", "How do you use React?")
3. Type any command above to get started

**Examples:**
- "project 1 details" - Get detailed information about a specific project
- "about React" - Learn about React skills and usage
- "how many projects" - Get project statistics

What would you like to explore?`;
};
export const initializeChat = () => {
  // Chat initialization is local, no setup needed.
};

export const isApiAvailable = (): boolean => {
  // Always mock the API as unavailable so it strictly uses local responses 
  return false;
};

export const sendMessageToAura = async (message: string): Promise<string> => {
  // Add a small delay for a realistic feel
  await new Promise(resolve => setTimeout(resolve, 800));
  return getFallbackResponse(message);
};
