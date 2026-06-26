import type { RoleName } from './roleDescriptions';

/**
 * Suggested tools/platforms per role. Sourced from the official Role/Tools
 * matrix and lightly extended with commonly-used companions per role.
 *
 * Note: the matrix uses "Bookkeeper" while the app uses "Bookkeeper Backer".
 * We key off the app's RoleName for direct lookup.
 */
export const ROLE_TOOLS: Record<RoleName, string[]> = {
  Growthbacker: [
    'HubSpot CRM', 'GoHighLevel', 'Apollo.io', 'LinkedIn Sales Navigator', 'Calendly',
    'Salesforce', 'Zoho CRM', 'Pipedrive', 'Clay', 'ZoomInfo', 'Hunter.io', 'Lemlist',
    'Outreach.io', 'Salesloft', 'Google Workspace', 'ChatGPT', 'Gmail',
  ],
  Cyberbacker: [
    'Google Workspace', 'Microsoft 365', 'Slack', 'Zoom', 'ClickUp', 'Notion', 'Trello',
    'Asana', 'Calendly', 'Dropbox', 'Google Drive', 'Loom', 'DocuSign', 'LastPass',
    'Microsoft Teams', 'ChatGPT', 'Canva',
  ],
  'Marketing Backer': [
    'Canva', 'Meta Business Suite', 'Mailchimp', 'HubSpot Marketing Hub', 'Google Analytics 4',
    'Google Tag Manager', 'SEMrush', 'Ahrefs', 'Buffer', 'Hootsuite', 'Adobe Express',
    'Klaviyo', 'WordPress', 'Google Ads', 'CapCut', 'ChatGPT', 'Notion', 'Figma',
  ],
  'Appointment Setter': [
    'Calendly', 'HubSpot CRM', 'GoHighLevel', 'Aircall', 'Zoom', 'RingCentral', 'Dialpad',
    'Google Calendar', 'Microsoft Outlook', 'Apollo.io', 'Salesloft', 'Outreach.io',
    'ZoomInfo', 'Slack', 'Microsoft Teams', 'Gmail', 'ChatGPT',
  ],
  'Cyber Recruiter': [
    'LinkedIn Recruiter', 'Indeed', 'Greenhouse', 'BambooHR', 'Calendly', 'Workable', 'Lever',
    'JazzHR', 'ZipRecruiter', 'SmartRecruiters', 'Ashby', 'Rippling', 'Google Workspace',
    'Microsoft Teams', 'DocuSign', 'Notion', 'Slack', 'ChatGPT',
  ],
  'Listing Backer': [
    'MLS', 'Zillow', 'Realtor.com', 'Canva', 'Dotloop', 'ShowingTime', 'Flexmls', 'Cloud CMA',
    'Matterport', 'DocuSign', 'Google Drive', 'SkySlope', 'Canva Pro', 'Adobe Express',
    'Dropbox', 'Zillow Premier Agent', 'Notion',
  ],
  'Property Management Backer': [
    'AppFolio', 'Buildium', 'RentRedi', 'DocuSign', 'QuickBooks Online', 'TenantCloud',
    'Yardi Breeze', 'Propertyware', 'MRI Software', 'Google Workspace', 'Dropbox', 'ClickUp',
    'Slack', 'Microsoft Excel', 'Zillow Rental Manager', 'Notion', 'Zoom',
  ],
  'Web Developer': [
    'Visual Studio Code', 'GitHub', 'GitHub Desktop', 'Git', 'Next.js', 'React', 'Node.js',
    'Vercel', 'Postman', 'Docker', 'Figma', 'Chrome DevTools', 'npm', 'Tailwind CSS',
    'Azure Static Web Apps', 'GitHub Copilot', 'Supabase', 'ChatGPT',
  ],
  'Social Media Backer': [
    'Canva', 'Buffer', 'Hootsuite', 'Meta Business Suite', 'CapCut', 'Adobe Express', 'Later',
    'Sprout Social', 'Metricool', 'TikTok Business Center', 'YouTube Studio',
    'Google Analytics 4', 'ChatGPT', 'Loomly', 'VistaCreate', 'Notion', 'Trello',
  ],
  'Transaction Backer': [
    'Dotloop', 'DocuSign', 'SkySlope', 'Google Drive', 'Trello', 'Asana', 'Dropbox',
    'Adobe Acrobat Pro', 'ZipForm', 'Notion', 'ClickUp', 'Microsoft Excel', 'Google Workspace',
    'Slack', 'Calendly', 'DocuSign Rooms', 'Microsoft Teams',
  ],
  'Productivity Backer': [
    'ClickUp', 'Notion', 'Google Workspace', 'Zapier', 'Slack', 'Asana', 'Monday.com', 'Trello',
    'Airtable', 'Microsoft 365', 'Loom', 'Miro', 'Make.com', 'Todoist', 'Google Calendar',
    'ChatGPT', 'Calendly',
  ],
  'Lead Backer': [
    'Apollo.io', 'ZoomInfo', 'Clay', 'HubSpot CRM', 'LinkedIn Sales Navigator', 'Hunter.io',
    'Lusha', 'Seamless.AI', 'RocketReach', 'Lemlist', 'Instantly.ai', 'Outreach.io',
    'Salesloft', 'Google Sheets', 'Notion', 'ChatGPT', 'Calendly',
  ],
  'Bookkeeper Backer': [
    'QuickBooks Online', 'Xero', 'Bill.com', 'Expensify', 'Microsoft Excel', 'Google Sheets',
    'Dext', 'FreshBooks', 'Wave Accounting', 'Sage Accounting', 'Zoho Books',
    'Stripe Dashboard', 'PayPal Business', 'Gusto', 'ADP', 'Hubdoc', 'Microsoft Teams',
  ],
  'Video Editor': [
    'Adobe Premiere Pro', 'DaVinci Resolve', 'CapCut', 'Adobe After Effects', 'Frame.io',
    'Adobe Audition', 'Final Cut Pro', 'Descript', 'Canva', 'Wondershare Filmora', 'OBS Studio',
    'Riverside', 'HandBrake', 'Media Encoder', 'Envato Elements', 'ChatGPT', 'Notion',
  ],
  'Concierge Backer': [
    'Calendly', 'Google Workspace', 'Zendesk', 'Slack', 'Zoom', 'Microsoft Teams', 'Freshdesk',
    'Intercom', 'HubSpot Service Hub', 'Google Calendar', 'Loom', 'ClickUp', 'Notion',
    'RingCentral', 'DocuSign', 'ChatGPT', 'Asana',
  ],
  'Software Backer': [
    'GitHub', 'Jira', 'Docker', 'Postman', 'Swagger', 'GitLab', 'Azure DevOps',
    'Visual Studio Code', 'Insomnia', 'Jenkins', 'SonarQube', 'Sentry', 'Figma', 'Confluence',
    'Notion', 'ChatGPT', 'npm',
  ],
  'DevOps Backend Engineer': [
    'Docker', 'Kubernetes', 'GitHub Actions', 'FastAPI', 'Azure DevOps', 'Azure App Service',
    'Azure Container Registry', 'Terraform', 'Helm', 'Nginx', 'Redis', 'PostgreSQL', 'Grafana',
    'Prometheus', 'Postman', 'GitHub', 'AWS CLI',
  ],
  'AI Service Delivery Specialist': [
    'OpenAI API', 'n8n', 'LangChain', 'Pinecone', 'Postman', 'Anthropic Claude API',
    'Google Gemini API', 'OpenRouter', 'Make.com', 'Zapier AI', 'Langfuse', 'Weaviate',
    'ChromaDB', 'Supabase', 'Ollama', 'ChatGPT', 'Hugging Face',
  ],
  'Client Experience Apprentice': [
    'HubSpot Service Hub', 'Zendesk', 'Intercom', 'Slack', 'Google Workspace', 'Freshdesk',
    'Salesforce Service Cloud', 'Help Scout', 'Calendly', 'Loom', 'Notion', 'Zoom',
    'Microsoft Teams', 'SurveyMonkey', 'Typeform', 'ChatGPT', 'Asana',
  ],
  'Facilitator Support - Cyberbacker University': [
    'Google Classroom', 'Moodle', 'Zoom', 'Google Workspace', 'Notion', 'Microsoft Teams',
    'Canvas LMS', 'Loom', 'Kahoot!', 'Mentimeter', 'Canva', 'Google Forms',
    'Microsoft PowerPoint', 'ClickUp', 'Trello', 'Padlet', 'ChatGPT',
  ],
};

/**
 * Return the deduplicated union of suggested tools for the given role names,
 * preserving order: roles in selection order, tools in matrix order.
 * Dedup is case-insensitive but keeps the first canonical spelling seen.
 */
export function getSuggestedToolsForRoles(roles: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const role of roles) {
    const tools = ROLE_TOOLS[role as RoleName];
    if (!tools) continue;
    for (const t of tools) {
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
  }
  return out;
}
