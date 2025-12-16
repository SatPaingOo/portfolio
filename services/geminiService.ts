import { GoogleGenAI, Chat } from "@google/genai";
import { PORTFOLIO_DATA } from '../constants';

// Global switch to completely disable live Gemini API calls.
// When true, Aura will ALWAYS use the local fallback responses
// and will NEVER send network requests to Google.
const FORCE_OFFLINE = true;
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

let chatSession: Chat | null = null;
// Check localStorage for persisted quota status
let quotaExceeded = typeof window !== 'undefined' && localStorage.getItem('aura_quota_exceeded') === 'true';

// Get API key from environment
// Vite replaces process.env.VITE_* at build time, so this will work
const API_KEY = (typeof process !== 'undefined' && process.env) 
  ? (process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '')
  : '';

// Helper function to check if API key is valid - VERY STRICT
const hasValidApiKey = (): boolean => {
  // Log for debugging in development
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log('Aura: API Key validation:', {
      hasKey: !!API_KEY,
      keyLength: API_KEY?.length || 0,
      isEmpty: !API_KEY || API_KEY.trim() === '',
      isUndefined: API_KEY === 'undefined',
      isNull: API_KEY === 'null'
    });
  }
  
  // STRICT VALIDATION - must pass ALL checks
  if (!API_KEY) return false;
  if (API_KEY === 'undefined') return false;
  if (API_KEY === 'null') return false;
  if (typeof API_KEY !== 'string') return false;
  const trimmed = API_KEY.trim();
  if (trimmed === '') return false;
  // Gemini API keys are typically 39+ characters, but we'll accept 20+ to be safe
  if (trimmed.length < 20) return false;
  
  return true;
};

// Fallback response generator when API key is not available
const getFallbackResponse = (message: string): string => {
  const lowerText = message.toLowerCase();
  const allSkillsFlat = [
    ...PORTFOLIO_DATA.skills.coreLanguages,
    ...PORTFOLIO_DATA.skills.frontendFrameworks,
    ...PORTFOLIO_DATA.skills.backendAndDevOps,
    ...PORTFOLIO_DATA.skills.specialty,
  ];
  
  // Personal information queries
  if (lowerText.includes('who is') || 
      lowerText.includes('who are you') || 
      lowerText.includes('tell me about') ||
      lowerText.includes('about you') ||
      lowerText.includes('about sat paing') ||
      (lowerText.includes('who') && lowerText.includes('sat paing')) ||
      lowerText.includes('introduce') ||
      lowerText.includes('introduction')) {
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
    
    // Detailed "how/what/about" for a specific project
    const projectNumberMatch = lowerText.match(/project\s+(\d+)/);
    const projectNameMatch = PORTFOLIO_DATA.projects.find(p => lowerText.includes(p.title.toLowerCase()));
    const wantsHow = lowerText.includes('how') || lowerText.includes('about') || lowerText.includes('what');
    const projectTarget = projectNameMatch || (projectNumberMatch ? PORTFOLIO_DATA.projects.find(p => p.id === Number(projectNumberMatch[1])) : undefined);
    if (wantsHow && projectTarget) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**3D Floating Data Node - Project Detail**

**Project:** ${projectTarget.title}
**Role:** ${projectTarget.role}
**Stack:** ${projectTarget.technologies.join(', ')}
**Challenge:** ${projectTarget.challenge}
**Solution:** ${projectTarget.solution}
**Metrics:** ${projectTarget.metrics}
**Links:**${projectTarget.links.liveDemo ? ` Live Demo: ${projectTarget.links.liveDemo}` : ' Live Demo: N/A'} | GitHub: ${projectTarget.links.github}

**Explore More**
1. Ask **"projects"** to view the full list.
2. Ask **"how many projects"** for counts.
3. Ask about another project by number (e.g., "project 2 details").`;
    }
    
    // Handle "how many" queries
    if (lowerText.includes('how many') || lowerText.includes('count') || lowerText.includes('number')) {
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

**Total Projects:** ${projectCount} major projects are documented in the portfolio.

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
1. Type a project number (1-${projectCount}) to see details
2. Type **"project [name]"** to explore a specific project
3. Use the **PROJECTS** button above to view the 3D visualization`;
  }
  
  // Skills
  if (lowerText.includes('skill') || lowerText.includes('tech')) {
    const allSkills = [
      ...PORTFOLIO_DATA.skills.coreLanguages.map(s => s.name),
      ...PORTFOLIO_DATA.skills.frontendFrameworks.map(s => s.name),
      ...PORTFOLIO_DATA.skills.backendAndDevOps.map(s => s.name),
      ...PORTFOLIO_DATA.skills.specialty.map(s => s.name)
    ];
    // Skill-specific "how/what/about" response
    const matchedSkill = allSkillsFlat.find(s => lowerText.includes(s.name.toLowerCase()));
    const wantsHowSkill = lowerText.includes('how') || lowerText.includes('about') || lowerText.includes('what');
    if (matchedSkill && wantsHowSkill) {
      const projectsUsingSkill = PORTFOLIO_DATA.projects
        .filter(p => p.technologies.some(t => t.toLowerCase().includes(matchedSkill.name.toLowerCase().replace(/\/.*$/, '').trim())))
        .map((p, i) => `${i + 1}. ${p.title} (${p.role})`)
        .join('\n');
      return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Interactive Radar Chart Projection - Skill Focus**

**Skill:** ${matchedSkill.name}
**Level:** ${matchedSkill.level}
**How it's used:** Applied in projects across UI/UX, APIs, data, or infrastructure depending on context.

${projectsUsingSkill ? `**Projects using this skill:**\n${projectsUsingSkill}\n` : ''}

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
2. Ask about specific technologies or frameworks
3. Type **"projects"** to see how these skills are applied`;
  }
  
  // History
  if (lowerText.includes('history') || lowerText.includes('experience') || lowerText.includes('education')) {
    const history = PORTFOLIO_DATA.employmentHistory.map((e, i) => 
      `${i + 1}. **${e.position}** at ${e.company} (${e.duration})`
    ).join('\n');
    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Chronological Timeline Bar - Employment History**

${history}

**Explore Further:**
1. Click the **HISTORY** button above to see the timeline visualization
2. Ask about a specific company or position
3. Type **"about"** to see full professional summary`;
  }
  
  // Gallery
  if (lowerText.includes('gallery') || lowerText.includes('photo') || lowerText.includes('image')) {
    return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**Image Archive Nodes - Gallery**

Accessing ${PORTFOLIO_DATA.gallery?.length || 0} visual documentation nodes.

**View Gallery:**
1. Click the **GALLERY** button above to see all images
2. Browse project screenshots and visual documentation
3. Images are organized by project and category`;
  }
  
  // Default response
  return `[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]

**System Response**

I can help you explore:

**Available Commands:**
1. **"projects"** - View all ${PORTFOLIO_DATA.projects.length} development projects
2. **"skills"** - See technical expertise and technologies
3. **"history"** - Explore employment timeline (${PORTFOLIO_DATA.employmentHistory.length} positions)
4. **"gallery"** - Browse visual documentation (${PORTFOLIO_DATA.gallery?.length || 0} images)
5. **"about"** - Learn more about Sat Paing Oo
6. **"how many projects"** - Get project count and statistics

**Navigation Tips:**
1. Use the navigation buttons above to switch views
2. Ask specific questions about any project or skill
3. Type any command above to get started

What would you like to explore?`;
};

export const initializeChat = () => {
  // First check: Validate API key exists and is valid
  if (!hasValidApiKey()) {
    console.log('Aura: Operating in offline mode - API key not configured or invalid');
    chatSession = null;
    // Don't reset quota flag - keep it if it was set
    return;
  }
  
  // Check quota status from localStorage first
  if (typeof window !== 'undefined') {
    const storedQuotaStatus = localStorage.getItem('aura_quota_exceeded');
    if (storedQuotaStatus === 'true') {
      quotaExceeded = true;
    }
  }
  
  // Don't initialize if quota is exceeded
  if (quotaExceeded) {
    console.log('Aura: Operating in offline mode - Quota exceeded (persisted)');
    chatSession = null;
    return;
  }
  
  // Only initialize if we don't already have a session
  if (chatSession) {
    return;
  }
  
  // Final validation before creating session
  if (!hasValidApiKey()) {
    console.log('Aura: API key validation failed - not initializing');
    chatSession = null;
    return;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error('Failed to initialize Gemini chat:', error);
    chatSession = null;
    // If initialization fails, mark as quota exceeded to prevent retries
    quotaExceeded = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_quota_exceeded', 'true');
    }
  }
};

// Export function to check if API is available
export const isApiAvailable = (): boolean => {
  if (FORCE_OFFLINE) return false;
  return hasValidApiKey() && !quotaExceeded;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // Hard override: never call the live API when FORCE_OFFLINE is enabled
  if (FORCE_OFFLINE) {
    console.log('Aura: FORCE_OFFLINE enabled - using offline responses only (no Gemini API calls)');
    return getFallbackResponse(message);
  }

  // FIRST CHECK: Validate API key - if not valid, return immediately without any API calls
  if (!hasValidApiKey()) {
    console.log('Aura: No valid API key - using offline mode');
    return getFallbackResponse(message);
  }
  
  // SECOND CHECK: If quota is exceeded, use fallback immediately without API call
  if (quotaExceeded) {
    console.log('Aura: Quota exceeded - using offline mode');
    return getFallbackResponse(message);
  }
  
  // THIRD CHECK: Check localStorage for quota status
  if (typeof window !== 'undefined' && localStorage.getItem('aura_quota_exceeded') === 'true') {
    quotaExceeded = true;
    console.log('Aura: Quota exceeded (from storage) - using offline mode');
    return getFallbackResponse(message);
  }
  
  // FOURTH CHECK: Final validation before proceeding
  if (!hasValidApiKey() || quotaExceeded) {
    return getFallbackResponse(message);
  }
  
  // Only proceed with API if key is valid and quota is not exceeded
  // Try to use Gemini API
  if (!chatSession) {
    initializeChat();
    // After initialization, check again - validate key and quota
    if (!hasValidApiKey() || !chatSession || quotaExceeded) {
      return getFallbackResponse(message);
    }
  }
  
  if (!chatSession) {
    // If initialization failed, use fallback
    return getFallbackResponse(message);
  }
  
  // FINAL CHECKS: Multiple validation layers right before API call
  // Check localStorage for quota status (might have been set by another tab)
  if (typeof window !== 'undefined' && localStorage.getItem('aura_quota_exceeded') === 'true') {
    quotaExceeded = true;
    chatSession = null;
    console.log('Aura: Quota exceeded (from storage) - preventing API call');
    return getFallbackResponse(message);
  }
  
  // Check quota flag
  if (quotaExceeded) {
    chatSession = null;
    console.log('Aura: Quota exceeded - preventing API call');
    return getFallbackResponse(message);
  }
  
  // ABSOLUTE FINAL CHECK: Verify key is still valid before API call
  if (!hasValidApiKey()) {
    chatSession = null;
    console.error('Aura: CRITICAL - Attempted API call without valid key - blocked');
    return getFallbackResponse(message);
  }

  try {
    // FINAL GUARD: One last check inside try block before the actual API call
    if (!hasValidApiKey()) {
      throw new Error('API key validation failed - no API call made');
    }
    
    const response = await chatSession.sendMessage({ message });
    return response.text || getFallbackResponse(message);
  } catch (error: any) {
    // Check if it's a quota/rate limit error
    const errorMessage = error?.message || error?.toString() || '';
    const errorCode = error?.code || error?.status || '';
    
    if (errorCode === 429 || 
        errorMessage.includes('429') || 
        errorMessage.includes('quota') || 
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('Too Many Requests')) {
      // Set quota exceeded flag to prevent future API calls
      quotaExceeded = true;
      // Persist to localStorage so it survives page reloads
      if (typeof window !== 'undefined') {
        localStorage.setItem('aura_quota_exceeded', 'true');
      }
      console.log('Aura: Quota exceeded - switching to offline mode permanently');
      // Destroy chat session to prevent further calls
      chatSession = null;
      // Return fallback immediately
      return getFallbackResponse(message);
    }
    
    console.error("Gemini API Error:", error);
    // On other errors, fall back to basic responses
    return getFallbackResponse(message);
  }
};
