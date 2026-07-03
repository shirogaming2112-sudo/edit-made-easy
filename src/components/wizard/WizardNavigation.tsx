import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  showAddMore?: boolean;
  onAddMore?: () => void;
  isSubmitting?: boolean;
  /** When > 0, disable Next and show "Try again in {N}s". */
  cooldownSeconds?: number;
  /** Label shown while `isSubmitting` (defaults to "Saving..."). */
  checkingLabel?: string;
  /** Optional override for the primary button label when idle. */
  nextLabel?: string;
}

const WizardNavigation = ({
  onPrevious,
  onNext,
  isFirst,
  isLast,
  showAddMore,
  onAddMore,
  isSubmitting,
  cooldownSeconds = 0,
  checkingLabel,
  nextLabel,
}: WizardNavigationProps) => {
  const cooling = cooldownSeconds > 0;
  const disabled = !!isSubmitting || cooling;

  let label: string;
  if (isSubmitting) {
    label = checkingLabel ?? (isLast ? 'Submitting...' : 'Saving...');
  } else if (cooling) {
    label = `Try again in ${cooldownSeconds}s`;
  } else {
    label = nextLabel ?? (isLast ? 'Submit' : 'Next');
  }

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className="btn-outline gap-2 disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-3">
        {showAddMore && onAddMore && (
          <button onClick={onAddMore} className="btn-outline gap-2">
            <Plus className="w-4 h-4" />
            Add More
          </button>
        )}
        <button
          onClick={onNext}
          disabled={disabled}
          className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(isSubmitting || cooling) && <Loader2 className="w-4 h-4 animate-spin" />}
          {label}
          {!isLast && !isSubmitting && !cooling && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default WizardNavigation;
