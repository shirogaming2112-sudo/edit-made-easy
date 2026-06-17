import { Education } from '@/types/application';
import RequiredLabel from '@/components/wizard/RequiredLabel';

interface EducationStepProps {
  data: Education;
  onChange: (data: Education) => void;
}

const EDUCATION_LEVELS = [
  'High School Graduate',
  'Vocational / Short Course',
  'Some College / Undergraduate',
  'Associate Degree',
  "Bachelor's Degree",
  "Postgraduate Degree (Master's)",
  'Doctorate / PhD',
];

const FIELDS_OF_STUDY = [
  'Accounting & Finance',
  'Architecture',
  'Arts & Design',
  'Business Administration',
  'Communications',
  'Computer Science',
  'Customer Service',
  'Economics',
  'Education',
  'Engineering',
  'Healthcare / Nursing',
  'Hospitality & Tourism',
  'Human Resources',
  'Information Technology (IT)',
  'Law / Legal Studies',
  'Marketing',
  'Mathematics',
  'Office Administration',
  'Psychology',
  'Public Relations',
  'Sales',
  'Social Sciences',
  'Other',
];

const EducationStep = ({ data, onChange }: EducationStepProps) => {
  const update = (field: keyof Education, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground">Highest Level of Education</p>
        <p className="text-sm text-muted-foreground mt-1">
          Select your highest level of education completed. If applicable, include your field of study, school, and year completed to strengthen your professional profile and help clients better understand your educational background. If you did not complete a degree program, you may indicate your undergraduate studies.
        </p>
      </div>
      <div>
        <RequiredLabel>Highest Level of Education</RequiredLabel>
        <div className="space-y-2 mt-2">
          {EDUCATION_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="educationLevel"
                value={level}
                checked={data.highestLevel === level}
                onChange={() => update('highestLevel', level)}
                className="w-4 h-4 text-primary border-border focus:ring-ring"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RequiredLabel>School Name</RequiredLabel>
          <input className="form-input" value={data.schoolName} onChange={(e) => update('schoolName', e.target.value)} />
        </div>
        <div>
          <RequiredLabel>School Location (City/Province/Country)</RequiredLabel>
          <input className="form-input" value={data.schoolLocation} onChange={(e) => update('schoolLocation', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RequiredLabel>Graduation Date (or expected Graduation Date)</RequiredLabel>
          <input type="date" className="form-input" value={data.graduationDate} onChange={(e) => update('graduationDate', e.target.value)} />
        </div>
        {data.highestLevel !== 'High School Graduate' && (
          <div>
            <RequiredLabel>Degree / Field of Study</RequiredLabel>
            <select className="form-select" value={data.degreeField} onChange={(e) => update('degreeField', e.target.value)}>
              <option value="">Select field of study...</option>
              {FIELDS_OF_STUDY.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationStep;
