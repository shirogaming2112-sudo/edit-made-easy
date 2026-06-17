import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe2, ShieldAlert, CalendarX } from 'lucide-react';

type Variant = 'location' | 'nbi' | 'nbiFail' | 'underage';

interface EligibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: Variant;
  onYes?: () => void;
  onNo?: () => void;
  onClose?: () => void;
}

const HoldMessage = () => (
  <div className="space-y-3 text-sm text-foreground/90 leading-relaxed">
    <p>
      We're currently in the process of exploring opportunities to expand our
      ability to hire in your location.
    </p>
    <p>
      At the moment, we are not yet authorized to onboard applicants from your
      country, but we're actively working on the necessary documentation and
      legal requirements to make this possible.
    </p>
    <p>
      If you wish to proceed with the application, we would be happy to securely
      store your information and keep it on file. Once all requirements are in
      place, we'll be glad to revisit your application as one of our early
      candidates.
    </p>
    <p>
      We truly appreciate your enthusiasm and patience as we work toward
      expanding our reach. Stay tuned for updates!
    </p>
  </div>
);

const EligibilityModal = ({
  open,
  onOpenChange,
  variant,
  onYes,
  onNo,
  onClose,
}: EligibilityModalProps) => {
  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  const iconFor: Record<Variant, JSX.Element> = {
    location: <Globe2 className="w-5 h-5 text-primary" />,
    nbi: <ShieldAlert className="w-5 h-5 text-primary" />,
    nbiFail: <Globe2 className="w-5 h-5 text-primary" />,
    underage: <CalendarX className="w-5 h-5 text-primary" />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border bg-primary/5">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                {iconFor[variant]}
              </span>
              <DialogTitle className="text-base sm:text-lg font-semibold text-foreground">
                Thank you for your interest in joining Cyberbacker!
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          {variant === 'location' && (
            <>
              <HoldMessage />
              <DialogFooter className="mt-6">
                <Button onClick={handleClose} className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}

          {variant === 'nbi' && (
            <div className="space-y-5">
              <p className="text-sm font-medium text-foreground">
                Will you be able to secure an NBI clearance?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => onNo?.()}
                >
                  No
                </Button>
                <Button
                  onClick={() => {
                    onYes?.();
                    onOpenChange(false);
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          )}

          {variant === 'nbiFail' && (
            <>
              <HoldMessage />
              <DialogFooter className="mt-6">
                <Button onClick={handleClose} className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}

          {variant === 'underage' && (
            <div className="space-y-3 text-sm text-foreground/90 leading-relaxed">
              <p>
                We appreciate your enthusiasm and excitement to be part of our
                team. However, based on your declared birthdate, you are currently
                below 18 years old.
              </p>
              <p>
                As part of our application process, we require an NBI Clearance,
                which reflects your official legal information—including your
                birthdate. This is to ensure full transparency and compliance with
                our company policies and legal requirements.
              </p>
              <p>
                Unfortunately, we are only able to move forward with applicants
                who are 18 years old or above.
              </p>
              <p>
                We truly appreciate your interest and would be happy to welcome
                your application once you reach the legal age. We look forward to
                hearing from you again when the time is right!
              </p>
              <DialogFooter className="mt-6">
                <Button onClick={handleClose} className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EligibilityModal;
