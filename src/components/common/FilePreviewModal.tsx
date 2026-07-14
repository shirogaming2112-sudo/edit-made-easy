import { FileText, Image as ImageIcon, X, ExternalLink } from 'lucide-react';

export interface FilePreviewModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  name?: string;
}

const isImageUrl = (u: string) => /\.(png|jpe?g|gif|webp|bmp|avif|svg)(\?.*)?$/i.test(u);
const isPdfUrl = (u: string) => /\.pdf(\?.*)?$/i.test(u);

const FilePreviewModal = ({ open, onClose, url, name }: FilePreviewModalProps) => {
  if (!open) return null;
  const image = isImageUrl(url);
  const pdf = isPdfUrl(url);
  const label = name || url.split('/').pop() || 'File';
  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            {image ? (
              <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <p className="text-sm font-medium text-foreground truncate">{label}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-muted">
          {image ? (
            <img src={url} alt={label} className="w-full h-auto" />
          ) : pdf ? (
            <iframe src={url} title={label} className="w-full h-[75vh] bg-card" />
          ) : (
            <div className="p-10 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-foreground mb-3">Preview not available for this file type.</p>
              <a href={url} target="_blank" rel="noreferrer" className="btn-outline text-xs inline-flex">
                Open file
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
