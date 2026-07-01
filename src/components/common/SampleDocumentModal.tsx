import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SampleDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  title: string;
  description?: string;
}

const SampleDocumentModal = ({ open, onOpenChange, src, title, description }: SampleDocumentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-2">
          <img
            src={src}
            alt={title}
            className="w-full h-auto rounded-lg border border-border"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SampleDocumentModal;
