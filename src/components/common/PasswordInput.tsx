import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  leftIcon?: React.ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ leftIcon, className = 'form-input', ...props }, ref) => {
    const [show, setShow] = useState(false);
    const hasLeft = Boolean(leftIcon);
    const padded = `${className} ${hasLeft ? 'pl-9' : ''} pr-10`.trim();

    return (
      <div className="relative">
        {hasLeft && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input ref={ref} type={show ? 'text' : 'password'} className={padded} {...props} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
