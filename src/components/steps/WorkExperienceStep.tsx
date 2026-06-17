import { useState } from 'react';
import { WorkExperience } from '@/types/application';
import { Trash2 } from 'lucide-react';
import RequiredLabel from '@/components/wizard/RequiredLabel';

interface WorkExperienceStepProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
  onSkip?: () => void;
}

const emptyExperience = (): WorkExperience => ({
  id: crypto.randomUUID(),
  title: '',
  employer: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: '',
  toolsPlatforms: '',
});

const WorkExperienceStep = ({ data, onChange, onSkip }: WorkExperienceStepProps) => {
  // Default to "yes" view if the user already has any saved experience entries.
  const [hasExperience, setHasExperience] = useState<boolean | null>(
    data.length > 0 ? true : null,
  );

  const experiences = data.length ? data : [emptyExperience()];

  const updateExp = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addExperience = () => {
    onChange([...experiences, emptyExperience()]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length <= 1) return;
    onChange(experiences.filter((_, i) => i !== index));
  };

  if (hasExperience === null) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-foreground">Work Experience</p>
          <p className="text-sm text-muted-foreground mt-1">
            Sharing your prior work experience helps potential clients understand your background and the value you bring. If you don't have any yet, that's perfectly fine — you can continue without it.
          </p>
        </div>

        <div className="border border-border rounded-xl p-8 text-center space-y-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Do you have prior work experience you'd like to include?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setHasExperience(true)}
              className="btn-primary px-6"
            >
              Yes, I have work experience
            </button>
            <button
              type="button"
              onClick={() => {
                onChange([]);
                setHasExperience(false);
                onSkip?.();
              }}
              className="btn-outline px-6"
            >
              No, I don't have any yet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Work Experience</p>
          <p className="text-sm text-muted-foreground mt-1">
            Provide your professional work experience starting with your most recent role. Include positions that best reflect your skills, responsibilities, achievements, and the value you can bring to potential clients. Be clear and specific when describing your responsibilities and accomplishments. Focus on measurable results and relevant experience that demonstrates your professionalism and readiness to support clients. If you have held multiple roles within the same company, begin with your most recent position, then add your previous roles separately.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHasExperience(null)}
          className="text-xs text-primary hover:underline font-medium whitespace-nowrap"
        >
          Change answer
        </button>
      </div>
      {experiences.map((exp, index) => (
        <div key={exp.id} className="relative border border-border rounded-xl p-6">
          {experiences.length > 1 && (
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <RequiredLabel>Title</RequiredLabel>
              <input className="form-input" value={exp.title} onChange={(e) => updateExp(index, 'title', e.target.value)} />
            </div>
            <div>
              <RequiredLabel>Employer / Company Name</RequiredLabel>
              <input className="form-input" value={exp.employer} onChange={(e) => updateExp(index, 'employer', e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <RequiredLabel>Location (Country / Remote)</RequiredLabel>
            <input className="form-input" value={exp.location} onChange={(e) => updateExp(index, 'location', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <RequiredLabel>Start Date (Month / Year)</RequiredLabel>
              <input type="month" className="form-input" value={exp.startDate} onChange={(e) => updateExp(index, 'startDate', e.target.value)} />
            </div>
            <div>
              <RequiredLabel>End Date (Month / Year)</RequiredLabel>
              <input type="month" className="form-input" disabled={exp.currentlyWorking} value={exp.endDate} onChange={(e) => updateExp(index, 'endDate', e.target.value)} />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.currentlyWorking}
                  onChange={(e) => updateExp(index, 'currentlyWorking', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
                <span className="text-xs text-muted-foreground">Currently working here</span>
              </label>
            </div>
          </div>

          <div>
            <RequiredLabel>Key Responsibilities</RequiredLabel>
            <textarea className="form-input min-h-[80px] resize-y" value={exp.responsibilities} onChange={(e) => updateExp(index, 'responsibilities', e.target.value)} />
          </div>
        </div>
      ))}

      {experiences.length < 5 ? (
        <button onClick={addExperience} className="btn-outline w-full">+ Add Another Experience ({experiences.length}/5)</button>
      ) : (
        <p className="text-xs text-muted-foreground text-center">Maximum of 5 work experiences reached.</p>
      )}
    </div>
  );
};

export default WorkExperienceStep;
