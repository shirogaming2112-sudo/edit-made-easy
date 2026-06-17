import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ROLE_DESCRIPTIONS, ROLE_OPTIONS, RoleName } from '@/data/roleDescriptions';
import { useEffect, useState } from 'react';

interface RoleInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional starting role; when omitted, the user can browse all roles. */
  initialRole?: RoleName;
}

const RoleInfoModal = ({ open, onOpenChange, initialRole }: RoleInfoModalProps) => {
  const [selected, setSelected] = useState<RoleName>(initialRole || ROLE_OPTIONS[0]);

  // Sync to the role the user clicked each time the modal opens — even if
  // initialRole is the same reference as last open (e.g. clicking the same
  // chip again after browsing other roles inside the modal).
  useEffect(() => {
    if (open) setSelected(initialRole || ROLE_OPTIONS[0]);
  }, [open, initialRole]);

  const role = ROLE_DESCRIPTIONS[selected];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Role descriptions</DialogTitle>
          <DialogDescription>
            Browse Cyberbacker roles. Click a role to read its full description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-[200px_1fr] gap-4 overflow-hidden">
          <div className="overflow-y-auto border border-border rounded-lg p-1 max-h-[55vh]">
            {ROLE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelected(r)}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  selected === r
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="overflow-y-auto pr-1 max-h-[55vh] space-y-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">{role.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{role.summary}</p>
            </div>
            {role.responsibilities && (
              <Section title="Responsibilities" items={role.responsibilities} />
            )}
            {role.requirements && <Section title="Requirements" items={role.requirements} />}
            {role.optional && <Section title="Optional" items={role.optional} />}
            {role.preferred && <Section title="Preferred" items={role.preferred} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-foreground mb-1">{title}</p>
    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  </div>
);

export default RoleInfoModal;
