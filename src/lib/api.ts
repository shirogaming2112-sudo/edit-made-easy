import type { ApplicationData } from '@/types/application';

/**
 * Backend-ready payload (files stripped to metadata for JSON transport).
 * Real file uploads should go through multipart/form-data or a presigned URL flow.
 */
export interface ApplicationPayload {
  email: string;
  personalInfo: Omit<ApplicationData['personalInfo'], 'photo'> & {
    photo: { name: string; size: number; type: string } | null;
  };
  education: ApplicationData['education'];
  professionalBackground: ApplicationData['professionalBackground'];
  workExperiences: ApplicationData['workExperiences'];
  selectedSkills: ApplicationData['selectedSkills'];
  portfolioLink: string;
  portfolioFiles: Array<{ name: string; size: number; type: string }>;
  certifications: Array<
    Omit<ApplicationData['certifications'][number], 'certificate'> & {
      certificate: { name: string; size: number; type: string } | null;
    }
  >;
  workSetup: Omit<ApplicationData['workSetup'], 'documents' | 'deviceScreenshots'> & {
    documents: Array<{ name: string; size: number; type: string }>;
    deviceScreenshots: Array<{ name: string; size: number; type: string }>;
  };
  compliance: {
    authorizeBackgroundCheck: boolean;
    validId: { name: string; size: number; type: string } | null;
    nbiClearance: { name: string; size: number; type: string } | null;
    policeClearance: { name: string; size: number; type: string } | null;
    proofOfSeparation: { name: string; size: number; type: string } | null;
    nbiValidity: string;
    policeValidity: string;
  };
}

const fileMeta = (f: File | null) =>
  f ? { name: f.name, size: f.size, type: f.type } : null;

const filesMeta = (fs: File[]) =>
  fs.map((f) => ({ name: f.name, size: f.size, type: f.type }));

export function toPayload(data: ApplicationData): ApplicationPayload {
  return {
    email: data.email,
    personalInfo: { ...data.personalInfo, photo: fileMeta(data.personalInfo.photo) },
    education: data.education,
    professionalBackground: data.professionalBackground,
    workExperiences: data.workExperiences,
    selectedSkills: data.selectedSkills,
    portfolioLink: data.portfolioLink,
    portfolioFiles: filesMeta(data.portfolioFiles),
    certifications: data.certifications.map((c) => ({
      ...c,
      certificate: fileMeta(c.certificate),
    })),
    workSetup: {
      ...data.workSetup,
      documents: filesMeta(data.workSetup.documents),
      deviceScreenshots: filesMeta(data.workSetup.deviceScreenshots),
    },
    compliance: {
      authorizeBackgroundCheck: data.compliance.authorizeBackgroundCheck,
      validId: fileMeta(data.compliance.validId),
      nbiClearance: fileMeta(data.compliance.nbiClearance),
      policeClearance: fileMeta(data.compliance.policeClearance),
      proofOfSeparation: fileMeta(data.compliance.proofOfSeparation),
      nbiValidity: data.compliance.nbiValidity,
      policeValidity: data.compliance.policeValidity,
    },
  };
}

/**
 * Submit application to backend.
 * Replace API_BASE_URL or swap to supabase.functions.invoke when backend is wired.
 */
export async function submitApplication(
  data: ApplicationData,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const payload = toPayload(data);

  // eslint-disable-next-line no-console
  console.log('[submitApplication] payload ready for backend:', payload);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!API_BASE_URL) {
    // No backend wired yet — succeed locally so existing flow keeps working.
    return { ok: true, id: `local-${Date.now()}` };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const json = await res.json();
    return { ok: true, id: json?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}
