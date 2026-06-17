/**
 * Centralized role / job description config.
 * Add or edit a role here and it will appear automatically wherever the
 * RoleInfoModal is rendered (Professional Background step, Dashboard, etc).
 */
export interface RoleDescription {
  /** Display title — must match the option value used in selects. */
  title: string;
  summary: string;
  responsibilities?: string[];
  requirements?: string[];
  optional?: string[];
  preferred?: string[];
}

export const ROLE_OPTIONS = [
  'Growthbacker',
  'Cyberbacker',
  'Marketing Backer',
  'Appointment Setter',
  'Cyber Recruiter',
  'Listing Backer',
  'Property Management Backer',
  'Web Developer',
  'Social Media Backer',
  'Transaction Backer',
  'Productivity Backer',
  'Lead Backer',
  'Bookkeeper Backer',
  'Video Editor',
  'Concierge Backer',
  'Software Backer',
  'DevOps Backend Engineer',
  'AI Service Delivery Specialist',
  'Client Experience Apprentice',
  'Facilitator Support - Cyberbacker University',
] as const;

export type RoleName = (typeof ROLE_OPTIONS)[number];

export const ROLE_DESCRIPTIONS: Record<RoleName, RoleDescription> = {
  'Growthbacker': {
    title: 'Growthbacker',
    summary:
      'Drives client growth through outbound outreach, lead nurture, and pipeline acceleration. Owns activities that move prospects toward becoming long-term clients.',
    responsibilities: [
      'Execute outbound campaigns (calls, email, social).',
      'Qualify leads and book discovery calls.',
      'Maintain CRM hygiene and pipeline reporting.',
      'Collaborate with the client on weekly growth targets.',
    ],
    requirements: ['Strong English communication', 'CRM experience', 'Goal-oriented mindset'],
  },
  'Cyberbacker': {
    title: 'Cyberbacker',
    summary:
      'General virtual professional who supports a client across administrative, communication, and operational tasks.',
    responsibilities: [
      'Calendar, email, and inbox management.',
      'Document organization and reporting.',
      'Client communication and follow-ups.',
      'Ad-hoc business support tasks.',
    ],
    requirements: ['Excellent organization', 'Strong written communication', 'Reliable work setup'],
  },
  'Marketing Backer': {
    title: 'Marketing Backer',
    summary:
      'Supports the client’s marketing engine — content creation, scheduling, campaign management, and reporting.',
    responsibilities: [
      'Content scheduling and calendar management.',
      'Email campaign creation and tracking.',
      'Basic graphic design (Canva / templates).',
      'Performance reporting.',
    ],
    requirements: ['Marketing fundamentals', 'Canva or design tool experience', 'Copywriting basics'],
  },
  'Appointment Setter': {
    title: 'Appointment Setter',
    summary:
      'Books qualified appointments for the client through outbound calls, messaging, and email follow-up.',
    responsibilities: [
      'Outbound calling from provided lead lists.',
      'Qualifying prospects against client criteria.',
      'Booking appointments directly into client calendar.',
      'CRM logging and follow-up sequences.',
    ],
    requirements: ['Excellent phone presence', 'Resilience to rejection', 'Calendar tool fluency'],
  },
  'Cyber Recruiter': {
    title: 'Cyber Recruiter',
    summary:
      'Sources, screens, and coordinates candidates for the client’s open roles.',
    responsibilities: [
      'Source candidates across channels.',
      'Screen resumes and conduct initial interviews.',
      'Schedule client interviews.',
      'Maintain ATS / candidate trackers.',
    ],
    requirements: ['Recruiting / sourcing experience', 'ATS familiarity', 'Strong interview skills'],
  },
  'Listing Backer': {
    title: 'Listing Backer',
    summary:
      'Supports real estate listings end-to-end — MLS entry, marketing materials, and document coordination.',
    responsibilities: [
      'Create and maintain MLS listings.',
      'Coordinate photography and marketing collateral.',
      'Manage listing documents.',
      'Update systems on status changes.',
    ],
    requirements: ['Real estate VA experience', 'MLS familiarity', 'Detail-oriented'],
  },
  'Property Management Backer': {
    title: 'Property Management Backer',
    summary:
      'Supports property managers with tenant communication, maintenance coordination, and reporting.',
    responsibilities: [
      'Handle tenant inquiries and maintenance requests.',
      'Coordinate vendors and inspections.',
      'Track rent collection and reporting.',
      'Document management.',
    ],
    requirements: ['Property management software experience', 'Strong communication'],
  },
  'Web Developer': {
    title: 'Web Developer',
    summary:
      'Builds and maintains websites and web applications for clients.',
    responsibilities: [
      'Develop responsive websites and web apps.',
      'Implement designs from Figma / mockups.',
      'Integrate APIs and third-party services.',
      'Maintain and optimize existing sites.',
    ],
    requirements: ['HTML / CSS / JavaScript', 'React or similar framework', 'Git workflow'],
    preferred: ['TypeScript', 'Tailwind CSS', 'Backend basics (Node.js / API design)'],
  },
  'Social Media Backer': {
    title: 'Social Media Backer',
    summary:
      'Manages the client’s social media presence — content, scheduling, engagement, and reporting.',
    responsibilities: [
      'Plan and schedule social content.',
      'Engage with comments and DMs.',
      'Create simple graphics and short videos.',
      'Report on engagement and growth.',
    ],
    requirements: ['Social media management tools', 'Canva / design basics', 'Copywriting'],
  },
  'Transaction Backer': {
    title: 'Transaction Backer',
    summary:
      'Coordinates real estate transactions from contract to close.',
    responsibilities: [
      'Manage transaction timelines and checklists.',
      'Coordinate with agents, lenders, escrow, and title.',
      'Track contingencies and deadlines.',
      'Prepare and file documents.',
    ],
    requirements: ['Transaction coordination experience', 'Real estate forms knowledge'],
  },
  'Productivity Backer': {
    title: 'Productivity Backer',
    summary:
      'Helps clients build systems, SOPs, and automation that improve operational productivity.',
    responsibilities: [
      'Document SOPs and workflows.',
      'Set up productivity tools and dashboards.',
      'Automate repeatable tasks.',
      'Coach client on best practices.',
    ],
    requirements: ['Process design mindset', 'Automation tools (Zapier / Make)'],
  },
  'Lead Backer': {
    title: 'Lead Backer',
    summary:
      'Generates and qualifies leads through research, outreach, and database management.',
    responsibilities: [
      'Build prospect lists from defined criteria.',
      'Research contact information and decision-makers.',
      'Initial outreach and qualification.',
      'CRM data entry and hygiene.',
    ],
    requirements: ['Research skills', 'CRM familiarity', 'Persistence'],
  },
  'Bookkeeper Backer': {
    title: 'Bookkeeper Backer',
    summary:
      'Maintains client financial records — categorization, reconciliations, and reporting.',
    responsibilities: [
      'Categorize transactions in QuickBooks / Xero.',
      'Reconcile bank and credit card accounts.',
      'Prepare monthly financial reports.',
      'Manage A/P and A/R.',
    ],
    requirements: ['QuickBooks or Xero experience', 'Accounting fundamentals'],
  },
  'Video Editor': {
    title: 'Video Editor',
    summary:
      'Edits short- and long-form video content for marketing, training, and social media.',
    responsibilities: [
      'Edit raw footage into polished videos.',
      'Add captions, music, transitions, and graphics.',
      'Repurpose long-form into social clips.',
      'Maintain media library.',
    ],
    requirements: ['Adobe Premiere / DaVinci / Final Cut', 'Strong sense of pacing'],
    preferred: ['After Effects basics', 'Color grading'],
  },
  'Concierge Backer': {
    title: 'Concierge Backer',
    summary:
      'Provides premium client-experience support — research, bookings, scheduling, and personal assistance.',
    responsibilities: [
      'Research and book travel, dining, and events.',
      'Manage personal and professional calendars.',
      'Handle correspondence with white-glove care.',
    ],
    requirements: ['Discretion', 'Excellent written communication', 'Resourcefulness'],
  },
  'Software Backer': {
    title: 'Software Backer',
    summary:
      'Provides hands-on software-engineering support across the client’s stack.',
    responsibilities: [
      'Build features and fix bugs across the stack.',
      'Code review and mentor junior contributors.',
      'Write tests and documentation.',
    ],
    requirements: ['2+ years software development', 'Git', 'A primary language at proficiency'],
  },
  'DevOps Backend Engineer': {
    title: 'DevOps Backend Engineer',
    summary:
      'Owns backend services and the infrastructure that runs them — CI/CD, observability, and reliability.',
    responsibilities: [
      'Design and implement backend services and APIs.',
      'Build and maintain CI/CD pipelines.',
      'Monitor, log, and improve reliability.',
      'Manage cloud infrastructure (AWS / GCP).',
    ],
    requirements: ['Strong backend language (Node, Python, Go)', 'Docker', 'Cloud experience'],
    preferred: ['Kubernetes', 'Terraform', 'Observability tools (Datadog, Grafana)'],
  },
  'AI Service Delivery Specialist': {
    title: 'AI Service Delivery Specialist',
    summary:
      'Implements and supports AI-powered services for clients — prompt engineering, integrations, and quality assurance.',
    responsibilities: [
      'Design and refine prompts for client use cases.',
      'Integrate AI services into client workflows.',
      'Monitor output quality and iterate.',
      'Document playbooks and SOPs.',
    ],
    requirements: ['Hands-on with LLM tools (ChatGPT, Claude, Gemini)', 'Prompt engineering'],
  },
  'Client Experience Apprentice': {
    title: 'Client Experience Apprentice',
    summary:
      'Entry-level role focused on learning the Cyberbacker client-experience playbook while supporting the CX team.',
    responsibilities: [
      'Shadow senior CX team members.',
      'Handle Tier-1 client requests.',
      'Document recurring issues.',
    ],
    requirements: ['Coachable mindset', 'Strong communication', 'Reliable work setup'],
  },
  'Facilitator Support - Cyberbacker University': {
    title: 'Facilitator Support — Cyberbacker University',
    summary:
      'Supports CBU facilitators with course delivery, scheduling, and learner success.',
    responsibilities: [
      'Coordinate live training sessions.',
      'Maintain learner records and progress.',
      'Support facilitators during sessions.',
      'Compile feedback and reporting.',
    ],
    requirements: ['Strong organization', 'Comfort speaking on calls', 'LMS familiarity'],
  },
};
