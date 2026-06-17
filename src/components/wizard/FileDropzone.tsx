import { Upload, FileText, Image as ImageIcon, Eye, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FileDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  maxFiles?: number;
  imagesOnly?: boolean;
}

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  isImage: boolean;
}

const FileDropzone = ({
  onFilesSelected,
  accept,
  multiple = true,
  label,
  maxFiles = 10,
  imagesOnly = true,
}: FileDropzoneProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [previewing, setPreviewing] = useState<UploadedFile | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (incoming: File[]) => {
      if (!incoming.length) return;

      let accepted = incoming;
      if (imagesOnly) {
        const rejected = accepted.filter((f) => !f.type.startsWith('image/'));
        accepted = accepted.filter((f) => f.type.startsWith('image/'));
        if (rejected.length) {
          toast.error('Only image files (JPG, PNG, WEBP, etc.) are allowed.');
        }
        if (!accepted.length) return;
      }

      const remaining = Math.max(0, maxFiles - files.length);
      if (multiple && accepted.length > remaining) {
        toast.error(`You can upload up to ${maxFiles} files. ${remaining} slot(s) left.`);
        accepted = accepted.slice(0, remaining);
        if (!accepted.length) return;
      }

      const mapped: UploadedFile[] = accepted.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        url: URL.createObjectURL(file),
        isImage: file.type.startsWith('image/'),
      }));
      const next = multiple ? [...files, ...mapped] : mapped;
      // Revoke any replaced single-file URLs
      if (!multiple) files.forEach((f) => URL.revokeObjectURL(f.url));
      setFiles(next);
      onFilesSelected?.(next.map((f) => f.file));
    },
    [files, multiple, onFilesSelected, maxFiles, imagesOnly]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(Array.from(e.target.files));
      // reset value so the same file can be re-picked
      e.target.value = '';
    },
    [addFiles]
  );

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target) URL.revokeObjectURL(target.url);
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onFilesSelected?.(next.map((f) => f.file));
  };

  return (
    <div>
      <div
        className="file-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept ?? (imagesOnly ? 'image/*' : undefined)}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          id={`dropzone-${label}`}
        />
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Drag & Drop</p>
        <p className="text-xs text-muted-foreground mb-1">
          {imagesOnly ? 'Images only — JPG, PNG, WEBP, GIF' : accept || 'Any file type'}
        </p>
        {multiple && (
          <p className="text-xs text-muted-foreground mb-3">Up to {maxFiles} files</p>
        )}
        <p className="text-xs text-muted-foreground mb-3">— OR —</p>
        <label
          htmlFor={`dropzone-${label}`}
          className="btn-outline text-xs cursor-pointer"
        >
          BROWSE FILES
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Uploaded ({files.length})
          </p>
          <div className="space-y-2">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-2 border border-border rounded-lg bg-muted/40">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                  {f.isImage ? (
                    <img src={f.url} alt={f.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{f.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(f.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewing(f)}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewing && (
        <div
          className="fixed inset-0 z-50 bg-foreground/70 flex items-center justify-center p-4"
          onClick={() => setPreviewing(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2 min-w-0">
                {previewing.isImage ? (
                  <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <p className="text-sm font-medium text-foreground truncate">{previewing.file.name}</p>
              </div>
              <button
                onClick={() => setPreviewing(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-muted">
              {previewing.isImage ? (
                <img src={previewing.url} alt={previewing.file.name} className="w-full h-auto" />
              ) : previewing.file.type === 'application/pdf' ? (
                <iframe src={previewing.url} title={previewing.file.name} className="w-full h-[75vh] bg-card" />
              ) : (
                <div className="p-10 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground mb-3">Preview not available for this file type.</p>
                  <a
                    href={previewing.url}
                    download={previewing.file.name}
                    className="btn-outline text-xs inline-flex"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
