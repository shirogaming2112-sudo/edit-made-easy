import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  showAddMore?: boolean;
  onAddMore?: () => void;
  isSubmitting?: boolean;
}

const WizardNavigation = ({
  onPrevious,
  onNext,
  isFirst,
  isLast,
  showAddMore,
  onAddMore,
  isSubmitting,
}: WizardNavigationProps) => {
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
          disabled={isSubmitting}
          className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLast ? (isSubmitting ? 'Submitting...' : 'Submit') : (isSubmitting ? 'Saving...' : 'Next')}
          {!isLast && !isSubmitting && <ChevronRight className="w-4 h-4" />}
        </button>

      </div>
    </div>
  );
};

export default WizardNavigation;
