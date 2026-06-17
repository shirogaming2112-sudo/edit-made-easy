import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TOOLTIPS } from '@/data/tooltips';

interface FieldTooltipProps {
  fieldKey: string;
  className?: string;
}

const FieldTooltip = ({ fieldKey, className }: FieldTooltipProps) => {
  const entry = TOOLTIPS[fieldKey];
  if (!entry) return null;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Help"
            className={`inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors ${className ?? ''}`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {entry.title && <p className="font-semibold mb-1">{entry.title}</p>}
          <p className="text-xs leading-relaxed">{entry.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FieldTooltip;
