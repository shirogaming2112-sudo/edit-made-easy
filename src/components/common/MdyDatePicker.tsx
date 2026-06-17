import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDateMDY, parseDateMDY } from '@/lib/date';

export interface MdyDatePickerProps {
  /** MM/DD/YYYY string. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  className?: string;
  id?: string;
}

const MdyDatePicker = ({
  value,
  onChange,
  placeholder = 'MM/DD/YYYY',
  disabled,
  className,
  id,
}: MdyDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const date = parseDateMDY(value) ?? undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal h-auto py-2.5',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <span>{value || placeholder}</span>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onChange(formatDateMDY(d ?? null));
            setOpen(false);
          }}
          disabled={disabled}
          initialFocus
          className={cn('p-3 pointer-events-auto')}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MdyDatePicker;
