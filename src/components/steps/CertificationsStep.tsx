import { Certification } from '@/types/application';
import FileDropzone from '@/components/wizard/FileDropzone';
import { Trash2 } from 'lucide-react';
import RequiredLabel from '@/components/wizard/RequiredLabel';

interface CertificationsStepProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

const emptyCert = (): Certification => ({
  id: crypto.randomUUID(),
  type: '',
  title: '',
  organization: '',
  dateCompleted: '',
  expirationDate: '',
  credentialId: '',
  certificate: null,
});

const CertificationsStep = ({ data, onChange }: CertificationsStepProps) => {
  const certs = data.length ? data : [emptyCert()];

  const updateCert = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const updateCertFile = (index: number, files: File[]) => {
    const updated = [...certs];
    updated[index] = { ...updated[index], certificate: files[0] ?? null };
    onChange(updated);
  };

  const addCert = () => onChange([...certs, emptyCert()]);

  const removeCert = (index: number) => {
    if (certs.length <= 1) return;
    onChange(certs.filter((_, i) => i !== index));
  };

  const MAX_CERTS = 5;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground">Showcase your certifications and trainings.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Include any completed courses, certifications, internal trainings, or workshops that strengthen your qualifications. Limit to 5 entries.
        </p>
      </div>
      <h3 className="text-lg font-heading font-semibold text-foreground">Certifications / Trainings</h3>

      {certs.map((cert, index) => (
        <div key={cert.id} className="relative border border-border rounded-xl p-6">
          {certs.length > 1 && (
            <button onClick={() => removeCert(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <RequiredLabel optional>Certification / Course Title / Training</RequiredLabel>
              <input className="form-input" value={cert.title} onChange={(e) => updateCert(index, 'title', e.target.value)} />
            </div>
            <div>
              <RequiredLabel optional>Issuing Organization / Provider</RequiredLabel>
              <input className="form-input" value={cert.organization} onChange={(e) => updateCert(index, 'organization', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="form-label">Date Completed</label>
              <input type="date" className="form-input" value={cert.dateCompleted} onChange={(e) => updateCert(index, 'dateCompleted', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Expiration Date (if applicable)</label>
              <input type="date" className="form-input" value={cert.expirationDate} onChange={(e) => updateCert(index, 'expirationDate', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Credential ID / Certificate Number</label>
              <input className="form-input" value={cert.credentialId} onChange={(e) => updateCert(index, 'credentialId', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="form-label">Upload Certificate / Proof of Completion</label>
            <FileDropzone onFilesSelected={(files) => updateCertFile(index, files)} label={`cert-${cert.id}`} multiple={false} />
          </div>
        </div>
      ))}

      {certs.length < MAX_CERTS ? (
        <button onClick={addCert} className="btn-outline w-full">+ Add Another Certification ({certs.length}/{MAX_CERTS})</button>
      ) : (
        <p className="text-xs text-muted-foreground text-center">Maximum of {MAX_CERTS} certifications reached.</p>
      )}
    </div>
  );
};

export default CertificationsStep;
