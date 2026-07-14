import { useState } from 'react';
import { FileText, Image as ImageIcon, Eye } from 'lucide-react';
import FilePreviewModal from './FilePreviewModal';

interface FilePreviewLinkProps {
  url: string;
  name?: string;
  label?: string;
}

const isImageUrl = (u: string) => /\.(png|jpe?g|gif|webp|bmp|avif|svg)(\?.*)?$/i.test(u);

const FilePreviewLink = ({ url, name, label }: FilePreviewLinkProps) => {
  const [open, setOpen] = useState(false);
  const image = isImageUrl(url);
  const display = label || name || url.split('/').pop() || 'View file';
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/40 text-sm text-foreground hover:bg-muted hover:border-primary/40 transition-colors max-w-full"
        title={display}
      >
        {image ? <ImageIcon className="w-4 h-4 text-primary shrink-0" /> : <FileText className="w-4 h-4 text-primary shrink-0" />}
        <span className="truncate">{display}</span>
        <Eye className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>
      <FilePreviewModal open={open} onClose={() => setOpen(false)} url={url} name={display} />
    </>
  );
};

export default FilePreviewLink;
