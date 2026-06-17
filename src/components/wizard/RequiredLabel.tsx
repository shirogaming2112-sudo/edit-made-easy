import type { ReactNode } from 'react';
import FieldTooltip from '@/components/common/FieldTooltip';

export const RequiredAsterisk = () => (
  <span className="text-destructive" aria-hidden="true">*</span>
);

interface RequiredLabelProps {
  children: ReactNode;
  tooltipKey?: string;
  htmlFor?: string;
  optional?: boolean;
}

const RequiredLabel = ({ children, tooltipKey, htmlFor, optional }: RequiredLabelProps) => (
  <label htmlFor={htmlFor} className="form-label inline-flex items-center gap-1.5">
    <span>
      {children} {!optional && <RequiredAsterisk />}
    </span>
    {tooltipKey && <FieldTooltip fieldKey={tooltipKey} />}
  </label>
);

export default RequiredLabel;
