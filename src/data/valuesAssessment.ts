/**
 * Values Assessment — questions and score explanations.
 *
 * Edit this file to tweak the assessment content. The wizard randomly
 * selects 15 questions from the pool and shuffles option order per question.
 */

export type DriverKey =
  | 'aesthetic'
  | 'altruistic'
  | 'individualistic'
  | 'theoretical'
  | 'economic'
  | 'political'
  | 'regulatory';

export interface AssessmentOption {
  type: string;
  value: DriverKey;
}

export interface AssessmentQuestion {
  question: string;
  reference: string;
  options: AssessmentOption[];
}

/** Number of questions presented to the candidate. */
export const QUESTION_COUNT = 15;

/** Points awarded by rank position (index 0 = top rank). */
export const RANK_POINTS = [7, 6, 5, 4, 3, 2, 1];

export const QUESTION_POOL: AssessmentQuestion[] = [
  {
    question: 'Given equal cost and resources, which would you prefer to do?',
    reference: 'Kung bibigyan ng pantay na gastos at mapagkukunan, alin ang mas gusto mong gawin?',
    options: [
      { type: "Relax and 'rebalance' in beautiful surroundings", value: 'aesthetic' },
      { type: 'Volunteer for a charity or cause', value: 'altruistic' },
      { type: 'Choose something unique and different from the crowd', value: 'individualistic' },
      { type: 'Learn about a new technology or scientific idea', value: 'theoretical' },
      { type: 'Learn about money-making opportunities', value: 'economic' },
      { type: 'Participate in a patriotic or community event', value: 'political' },
      { type: 'Be elected to a local government office', value: 'regulatory' },
    ],
  },
  {
    question: 'Which would you read first?',
    reference: 'Alin ang unang babasahin mo?',
    options: [
      { type: 'A New Spirit of Volunteering Emerges', value: 'altruistic' },
      { type: 'Creating Balance in Work and Home Life', value: 'aesthetic' },
      { type: 'New Breakthrough Theory Revealed', value: 'theoretical' },
      { type: 'Traditional Methods to Increase Effectiveness', value: 'regulatory' },
      { type: 'Discovering Your Unique Edge', value: 'individualistic' },
      { type: 'Breaking News in Market Condition', value: 'economic' },
      { type: 'The Psychology of Negotiating to win', value: 'political' },
    ],
  },
  {
    question: 'At a conference, in which order would you attend these exhibits?',
    reference: 'Sa isang pagpupulong, saang pagkakasunud-sunod ang pupuntahan mo sa mga exhibit na ito?',
    options: [
      { type: 'Money-making opportunities', value: 'economic' },
      { type: 'Unique vacations', value: 'individualistic' },
      { type: 'Volunteer opportunities', value: 'altruistic' },
      { type: 'Scientific equipment', value: 'theoretical' },
      { type: 'Quality improvement systems', value: 'political' },
      { type: 'Leadership resources', value: 'regulatory' },
      { type: 'Ideas on recycling and artwork', value: 'aesthetic' },
    ],
  },
  {
    question: 'If salaries and benefits are equal, would you prefer the work of..',
    reference: 'Kung ang sweldo at benepisyo ay pantay, mas gugustuhin mo ba ang gawain ng ..',
    options: [
      { type: 'Designer, architect, artist', value: 'aesthetic' },
      { type: 'Advertising, marketing', value: 'individualistic' },
      { type: 'High paid executive', value: 'economic' },
      { type: 'Social worker, relief aid worker', value: 'altruistic' },
      { type: 'Researcher, scientist', value: 'theoretical' },
      { type: 'Law enforcement, lawyer', value: 'regulatory' },
      { type: 'Business owner, workplace leader', value: 'political' },
    ],
  },
  {
    question: 'An advantage of being in charge is:',
    reference: 'Isang kalamangan sa pagiging namumuno ay:',
    options: [
      { type: 'Helping others grow and develop', value: 'altruistic' },
      { type: 'Freedom to be unique and different', value: 'individualistic' },
      { type: 'Money and financial rewards', value: 'economic' },
      { type: 'Choosing the design, colors, and layout of the area', value: 'aesthetic' },
      { type: 'Strategizing and generating new ideas', value: 'theoretical' },
      { type: 'Being able to set standards', value: 'regulatory' },
      { type: 'Influence and authority', value: 'political' },
    ],
  },
  {
    question: 'In which order would you explore these topics?',
    reference: 'Sa aling pagkakasunud-sunod mo matutuklasan ang mga paksang ito?',
    options: [
      { type: 'Environmental conservation or green efforts', value: 'aesthetic' },
      { type: 'Maintain creative freedom, uniqueness', value: 'individualistic' },
      { type: 'Building wealth, investments', value: 'economic' },
      { type: 'Volunteerism, helping others', value: 'altruistic' },
      { type: 'Philosophy, theories, technology', value: 'theoretical' },
      { type: 'Organization, regulation', value: 'regulatory' },
      { type: 'Power, control, influencing', value: 'political' },
    ],
  },
  {
    question: 'In which order would you attend presentations on these topics?',
    reference: 'Saang pagkakasunud-sunod ang pupuntahan mo sa mga pagtatanghal sa mga paksang ito?',
    options: [
      { type: 'How to march to your own drummer', value: 'individualistic' },
      { type: 'Creating balance and harmony in life and work', value: 'aesthetic' },
      { type: 'Increasing your financial return', value: 'economic' },
      { type: 'Persuading and influencing others', value: 'political' },
      { type: 'Effective ways of learning for retention', value: 'theoretical' },
      { type: 'Encouraging better citizenship and ethics', value: 'regulatory' },
      { type: 'Helping others to help themselves', value: 'altruistic' },
    ],
  },
  {
    question: 'Rank the order of importance of these statements…',
    reference: 'Ayusin ang pagkakasunud-sunod ng kahalagahan ng mga pahayag na ito…',
    options: [
      { type: 'Aesthetics are meant to enhance our surroundings', value: 'aesthetic' },
      { type: 'Individuality is meant to express uniqueness', value: 'individualistic' },
      { type: 'Ideas are meant to be studied', value: 'theoretical' },
      { type: 'Charity is meant to help society', value: 'altruistic' },
      { type: 'Rules are made to be re-written', value: 'political' },
      { type: 'Money is best used to make more money', value: 'economic' },
      { type: 'Rules are made to be followed', value: 'regulatory' },
    ],
  },
  {
    question: 'Rank order the importance of these concepts…',
    reference: 'Ayusin ang kahalagahan ng mga konseptong ito ...',
    options: [
      { type: 'I like to be unique and individual', value: 'individualistic' },
      { type: 'I like helping others and volunteering', value: 'altruistic' },
      { type: 'I like form, harmony, and creative design', value: 'aesthetic' },
      { type: 'I like financial incentives', value: 'economic' },
      { type: "I like things I trust, new doesn't always mean better", value: 'regulatory' },
      { type: 'I respect leadership and the ability to influence', value: 'political' },
      { type: 'I have an appetite for learning new things', value: 'theoretical' },
    ],
  },
  {
    question: 'Which would you read first?',
    reference: 'Alin ang unang babasahin mo?',
    options: [
      { type: 'Getting Beyond the Work-Life Balance', value: 'aesthetic' },
      { type: "How Volunteering Around the Globe Changed One Family's Lives Forever", value: 'altruistic' },
      { type: 'Finding Your Edge', value: 'individualistic' },
      { type: 'An Introduction to Theories of Human Development', value: 'theoretical' },
      { type: 'True Measures of Money', value: 'economic' },
      { type: 'The Psychology of Negotiating to win', value: 'political' },
      { type: 'A Comparative Study on the Effectiveness: Traditional and Methodical', value: 'regulatory' },
    ],
  },
  {
    question: 'If salaries and benefits are equal, would you prefer the work of..',
    reference: 'Kung ang sweldo at benepisyo ay pantay, mas gugustuhin mo ba ang gawain ng ..',
    options: [
      { type: 'Interior designer', value: 'aesthetic' },
      { type: 'Humanitarian worker', value: 'altruistic' },
      { type: 'Media Coordinator', value: 'individualistic' },
      { type: 'Analyst', value: 'theoretical' },
      { type: 'Chief Executive Officer or similar', value: 'economic' },
      { type: 'Team leader', value: 'political' },
      { type: 'Paralegal', value: 'regulatory' },
    ],
  },
  {
    question: 'At a conference, in which order would you attend these exhibits?',
    reference: 'Sa isang pagpupulong, saang pagkakasunud-sunod ang pupuntahan mo sa mga exhibit na ito?',
    options: [
      { type: 'Places to go for vacation', value: 'aesthetic' },
      { type: 'Charitable organizations', value: 'altruistic' },
      { type: 'Products to make you look good', value: 'individualistic' },
      { type: 'Experiments', value: 'theoretical' },
      { type: 'Business opportunities', value: 'economic' },
      { type: 'Leadership Training', value: 'political' },
      { type: 'Systems to improve quality', value: 'regulatory' },
    ],
  },
  {
    question: 'Given equal cost and resources, which would you prefer to do?',
    reference: 'Kung bibigyan ng pantay na gastos at mapagkukunan, alin ang mas gusto mong gawin?',
    options: [
      { type: 'Take time off and enjoy vacation', value: 'aesthetic' },
      { type: 'Donate to organization or people in need', value: 'altruistic' },
      { type: 'Choose something unique that will stand out from the crowd', value: 'individualistic' },
      { type: 'Study methods and technology', value: 'theoretical' },
      { type: 'Learn how to increase assets and finances', value: 'economic' },
      { type: 'Join community event that you can lead', value: 'political' },
      { type: 'Run for election in an organization or government', value: 'regulatory' },
    ],
  },
  {
    question: 'An advantage of being in charge is:',
    reference: 'Isang kalamangan sa pagiging namumuno ay:',
    options: [
      { type: 'Selecting the layout of the area', value: 'aesthetic' },
      { type: 'Helping others who are in need', value: 'altruistic' },
      { type: 'Freedom to be unique from others', value: 'individualistic' },
      { type: 'Analyzing ideas', value: 'theoretical' },
      { type: 'Increasing investments', value: 'economic' },
      { type: 'Authority and leading people', value: 'political' },
      { type: 'Setting standards and procedures', value: 'regulatory' },
    ],
  },
  {
    question: 'In which order would you explore these topics?',
    reference: 'Sa aling pagkakasunud-sunod mo matutuklasan ang mga paksang ito?',
    options: [
      { type: 'How to conserve our environment', value: 'aesthetic' },
      { type: 'Charity and reform', value: 'altruistic' },
      { type: 'Distinctive individual', value: 'individualistic' },
      { type: 'Hyphotesis and methods', value: 'theoretical' },
      { type: 'Building wealth and investments', value: 'economic' },
      { type: 'Influencing others', value: 'political' },
      { type: 'Process and regulation', value: 'regulatory' },
    ],
  },
  {
    question: 'Rank order the importance of these concepts…',
    reference: 'Ayusin ang kahalagahan ng mga konseptong ito ...',
    options: [
      { type: 'I love harmony and creativity.', value: 'aesthetic' },
      { type: 'I choose to help others and volunteer.', value: 'altruistic' },
      { type: 'I like to thrive and be extraordinary', value: 'individualistic' },
      { type: 'I take pleasure in learning new things', value: 'theoretical' },
      { type: 'I want to get incentives and bonuses.', value: 'economic' },
      { type: 'I want to influence others and lead them to be better.', value: 'political' },
      { type: 'I like when there are procedures I can follow.', value: 'regulatory' },
    ],
  },
  {
    question: 'Rank the order of importance of these statements…',
    reference: 'Ayusin ang pagkakasunud-sunod ng kahalagahan ng mga pahayag na ito…',
    options: [
      { type: 'Everyone should spend time in nature and appreciate its beauty.', value: 'aesthetic' },
      { type: 'We have to provide help and raise money for those in need', value: 'altruistic' },
      { type: 'Establish something that distinguishes you from others of the same kind', value: 'individualistic' },
      { type: 'Analyze the process carefully before making actions.', value: 'theoretical' },
      { type: 'Wealth consists not in having great possessions, but in having few wants', value: 'economic' },
      { type: 'A leader should create rules.', value: 'political' },
      { type: 'Processes are made to be followed', value: 'regulatory' },
    ],
  },
  {
    question: 'In which order would you attend presentations on these topics?',
    reference: 'Saang pagkakasunud-sunod ang pupuntahan mo sa mga pagtatanghal sa mga paksang ito?',
    options: [
      { type: 'Having balance between personal life and work', value: 'aesthetic' },
      { type: 'Helping other people', value: 'altruistic' },
      { type: 'Marching to the beat of a different drummer', value: 'individualistic' },
      { type: 'Effective ways of analyzing systems', value: 'theoretical' },
      { type: 'Having a return on investment', value: 'economic' },
      { type: 'Persuading others', value: 'political' },
      { type: 'Encouraging patriotism and ethics', value: 'regulatory' },
    ],
  },
  {
    question: 'Rank the order of importance of these statements…',
    reference: 'Ayusin ang pagkakasunud-sunod ng kahalagahan ng mga pahayag na ito…',
    options: [
      { type: 'Aesthetics are designed to be pleasing', value: 'aesthetic' },
      { type: 'Helping other people in our society', value: 'altruistic' },
      { type: 'Be a unique version of yourself', value: 'individualistic' },
      { type: 'Ideas are meant to be examined before execution', value: 'theoretical' },
      { type: 'Money plays an important role', value: 'economic' },
      { type: 'Rules are made to be improved', value: 'political' },
      { type: 'Systematic approach', value: 'regulatory' },
    ],
  },
  {
    question: 'In which order would you attend presentations on these topics?',
    reference: 'Saang pagkakasunud-sunod ang pupuntahan mo sa mga pagtatanghal sa mga paksang ito?',
    options: [
      { type: 'Creating a work-life balance', value: 'aesthetic' },
      { type: 'Support other people', value: 'altruistic' },
      { type: 'How to be someone who does not conform to the standard', value: 'individualistic' },
      { type: 'Studying effective ways of retention', value: 'theoretical' },
      { type: 'Study how to invest money', value: 'economic' },
      { type: 'Influence other people', value: 'political' },
      { type: 'Persuade people to obey the law', value: 'regulatory' },
    ],
  },
  {
    question: 'In which order would you explore these topics?',
    reference: 'Sa aling pagkakasunud-sunod mo matutuklasan ang mga paksang ito?',
    options: [
      { type: 'Concern for the environment', value: 'aesthetic' },
      { type: 'Take part in helping others', value: 'altruistic' },
      { type: 'Maintain creative freedom and uniqueness', value: 'individualistic' },
      { type: 'Philosophy, theories, and technology', value: 'theoretical' },
      { type: 'Venture into investments', value: 'economic' },
      { type: 'Power, control, and influence', value: 'political' },
      { type: 'Systematic, ruling', value: 'regulatory' },
    ],
  },
  {
    question: 'An advantage of being in charge is:',
    reference: 'Isang kalamangan sa pagiging namumuno ay:',
    options: [
      { type: 'Be creative', value: 'aesthetic' },
      { type: 'Helping others to grow and develop', value: 'altruistic' },
      { type: 'Freedom to be unique and different', value: 'individualistic' },
      { type: 'Creating new ideas', value: 'theoretical' },
      { type: 'Monetary bonuses', value: 'economic' },
      { type: 'Influence and control', value: 'political' },
      { type: 'Being able to set quality standards', value: 'regulatory' },
    ],
  },
  {
    question: 'Rank order the importance of these concepts…',
    reference: 'Ayusin ang kahalagahan ng mga konseptong ito ...',
    options: [
      { type: 'I like things that are pleasing to the eye', value: 'aesthetic' },
      { type: 'I like to help people', value: 'altruistic' },
      { type: 'I like to be different and individual', value: 'individualistic' },
      { type: 'I have the urge to learn new things', value: 'theoretical' },
      { type: 'I want to have financial incentives', value: 'economic' },
      { type: 'I choose to lead and influence others', value: 'political' },
      { type: 'I want a structured system', value: 'regulatory' },
    ],
  },
  {
    question: 'At a conference, in which order would you attend these exhibits?',
    reference: 'Sa isang pagpupulong, saang pagkakasunud-sunod ang pupuntahan mo sa mga exhibit na ito?',
    options: [
      { type: 'Different places to go', value: 'aesthetic' },
      { type: 'Venture into opportunities', value: 'altruistic' },
      { type: 'Be creative', value: 'individualistic' },
      { type: 'Scientific Instruments Trade Shows', value: 'theoretical' },
      { type: 'Explore money-making opportunities', value: 'economic' },
      { type: 'How to develop and demonstrate leadership skills', value: 'political' },
      { type: 'Development of quality systems', value: 'regulatory' },
    ],
  },
  {
    question: 'Which would you read first?',
    reference: 'Alin ang unang babasahin mo?',
    options: [
      { type: 'Having a Work-life Balance', value: 'aesthetic' },
      { type: 'The Power of Volunteering', value: 'altruistic' },
      { type: 'Uncover Something Unique in You', value: 'individualistic' },
      { type: 'Theories in Methods and Sociology', value: 'theoretical' },
      { type: 'Breaking News in Market Condition', value: 'economic' },
      { type: 'The Psychology of Negotiating to Win', value: 'political' },
      { type: 'Traditional Methods to Increase Effectiveness', value: 'regulatory' },
    ],
  },
  {
    question: 'Given equal cost and resources, which would you prefer to do?',
    reference: 'Kung bibigyan ng pantay na gastos at mapagkukunan, alin ang mas gusto mong gawin?',
    options: [
      { type: 'Unwind and enjoy time off', value: 'aesthetic' },
      { type: 'Initiate a helping hand for people in need', value: 'altruistic' },
      { type: 'Have something unique and different from the crowd', value: 'individualistic' },
      { type: 'Be knowledgeable about innovative technology and scientific ideas', value: 'theoretical' },
      { type: 'Know more about money-making opportunities', value: 'economic' },
      { type: 'Take part in a patriotic or community event', value: 'political' },
      { type: 'Be a public officer in a local government office', value: 'regulatory' },
    ],
  },
  {
    question: 'If salaries and benefits are equal, would you prefer the work of..',
    reference: 'Kung ang sweldo at benepisyo ay pantay, mas gugustuhin mo ba ang gawain ng ..',
    options: [
      { type: 'Events planner', value: 'aesthetic' },
      { type: 'Health Care worker', value: 'altruistic' },
      { type: 'Tattoo Artist', value: 'individualistic' },
      { type: 'Forensic scientist', value: 'theoretical' },
      { type: 'Stockholder', value: 'economic' },
      { type: 'Managerial Role', value: 'political' },
      { type: 'Judge or Prosecutor', value: 'regulatory' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Score interpretation
// ---------------------------------------------------------------------------

export type ScoreLevel = 'dominant' | 'high' | 'moderate' | 'low';

export const DRIVER_LABELS: Record<DriverKey, string> = {
  aesthetic: 'Aesthetic',
  altruistic: 'Altruistic',
  individualistic: 'Individualistic',
  theoretical: 'Theoretical',
  economic: 'Economic',
  political: 'Political',
  regulatory: 'Regulatory',
};

/** Visual palette used by the result chart and table accents. */
export const DRIVER_COLORS: Record<DriverKey, string> = {
  aesthetic: '#0088FE',
  altruistic: '#00C49F',
  individualistic: '#FFBB28',
  theoretical: '#FF8042',
  economic: '#AF19FF',
  political: '#FF4560',
  regulatory: '#775DD0',
};

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return 'dominant';
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export const SCORE_EXPLANATIONS: Record<DriverKey, Record<ScoreLevel, string>> = {
  aesthetic: {
    dominant:
      'You are strongly motivated by harmony, balance, and the overall "feel" of your environment. You value form as much as function and are sensitive to how spaces, systems, and experiences are designed. High scorers often prioritize work-life balance and well-being and may struggle in high-stress, chaotic, or visually and emotionally unappealing environments.',
    high:
      'You need a "feel-good" environment. You value form as much as function. High scorers often prioritize work-life balance and may struggle in high-stress, "ugly," or chaotic workspaces.',
    moderate:
      "You appreciate beauty and harmony but won't let a lack of it stop you from getting the job done. You are balanced between \"the experience\" and \"the result.\"",
    low: 'You are purely utilitarian. You view aesthetics as a distraction. You care about whether something works, not how it looks or feels.',
  },
  economic: {
    dominant:
      'You are highly results-oriented and focused on efficiency, return on investment, and practical outcomes. Time and resources matter. High scorers thrive in environments where performance is measurable and rewarded, and may lose motivation in roles that feel inefficient, vague, or disconnected from tangible results.',
    high:
      'You are driven by "the win," money, and efficiency. You constantly ask, "Is this worth my time?" You are highly competitive and goal-oriented.',
    moderate:
      "You want to be successful and paid well, but it isn't your only motivation. You can work on projects that don't have an immediate financial payoff.",
    low: 'You are unmotivated by money or competition. You may focus on the "mission" or "learning" to the point where you ignore costs or efficiency.',
  },
  individualistic: {
    dominant:
      'You value independence, autonomy, and personal identity. You want the freedom to express your ideas and do things your own way. High scorers prefer roles with flexibility and ownership and may struggle in rigid hierarchies, micromanaged environments, or situations where individuality is suppressed.',
    high:
      'You want to stand out and be unique. You hate "cookie-cutter" roles and micromanagement. You want to be recognized for your individual contribution.',
    moderate:
      "You enjoy being part of a team but still want some level of autonomy. You don't need to be the \"star\" all the time, but you don't want to be invisible either.",
    low: 'You are the ultimate "team player." You prefer to blend in and support the group\'s identity rather than seeking individual credit.',
  },
  political: {
    dominant:
      'You are motivated by influence, leadership, and the ability to shape decisions. Having a voice matters to you. High scorers are energized by responsibility and decision-making authority and may feel constrained or undervalued in passive roles with little influence or upward mobility.',
    high: 'You are driven by power, control, and status. You want to be the one making the decisions and moving the pieces. You seek positions of authority.',
    moderate:
      "You can lead when asked, but you don't \"crave\" the spotlight or the title. You are comfortable taking orders as long as you respect the leader.",
    low: 'You have no interest in "climbing the ladder" or office politics. You prefer to do your work and stay out of the power struggles.',
  },
  altruistic: {
    dominant:
      'You are strongly motivated by helping others and making a positive impact. Purpose matters more to you than personal gain. High scorers feel most fulfilled when their work benefits people or society and may feel drained or disengaged in environments that are overly competitive, transactional, or self-serving.',
    high: 'You are driven by helping others. You may sacrifice your own time or resources to ensure someone else succeeds. You find fulfillment in "giving back."',
    moderate:
      'You are helpful, but you have firm boundaries. You believe in helping people who also help themselves (the "teach a man to fish" philosophy).',
    low: 'You believe in self-reliance and "tough love." You may view helping others as a distraction from the actual work or believe people should solve their own problems.',
  },
  regulatory: {
    dominant:
      'You value structure, clarity, and consistency. Rules and processes create a sense of stability and fairness. High scorers perform best in organized environments with clear expectations and may struggle in chaotic, constantly changing, or poorly defined systems.',
    high: 'You love "the system." You find comfort in rules, protocols, and tradition. You believe there is a "right way" to do things and want to preserve it.',
    moderate: 'You follow rules that make sense but are willing to bend them if they become an obstacle. You are "flexible-structured."',
    low: 'You are a "maverick." You find rules stifling and would rather "wing it." You value freedom and innovation over consistency and tradition.',
  },
  theoretical: {
    dominant:
      'You are driven by learning, logic, and understanding how things work. Knowledge itself is motivating. High scorers enjoy problem-solving, research, and analysis and may feel frustrated in roles that lack intellectual challenge or where decisions are made without clear reasoning or evidence.',
    high: 'You are a "truth-seeker." You want to know the "why" and "how" of everything. You value data, research, and becoming an expert in your field.',
    moderate:
      'You value enough information to make a decision, but you won\'t get "paralysis by analysis." You learn what you need to know and move on.',
    low: 'You are "intuitive" or "action-biased." You don\'t care about the theory or the data—you care about what works in the moment. You prefer "doing" over "studying."',
  },
};

export function getExplanation(driver: DriverKey, score: number): string {
  return SCORE_EXPLANATIONS[driver][getScoreLevel(score)];
}
