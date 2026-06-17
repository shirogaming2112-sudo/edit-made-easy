import RequiredLabel from '@/components/wizard/RequiredLabel';

interface ValuePropositionStepProps {
  value: string;
  onChange: (value: string) => void;
}

const ValuePropositionStep = ({ value, onChange }: ValuePropositionStepProps) => {
  const charCount = value.length;
  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground">Value Proposition</p>
        <p className="text-sm text-muted-foreground mt-1">
          Focus on the value you bring. Write this as if you are introducing yourself directly to a potential client.
          Highlight what makes you unique by emphasizing your strengths, reliability, communication style, adaptability, and the results you consistently deliver.
          Keep your response professional, confident, and client-focused.
        </p>
      </div>

      <div>
        <RequiredLabel>Value Proposition</RequiredLabel>
        <p className="text-xs text-muted-foreground mb-2">
          Why should a client choose you as their Cyberbacker?
        </p>
        <textarea
          className="form-input min-h-[180px] resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Share the distinct value, perspective, and outcomes you bring to your future clients..."
          maxLength={1500}
        />
        <p className="mt-1 text-xs text-muted-foreground text-right">{charCount}/1500</p>
      </div>

    </div>
  );
};

export default ValuePropositionStep;
