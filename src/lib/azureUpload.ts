/**
 * Client-side Azure Blob upload — DISABLED.
 *
 * Uploads are now performed by the backend. These stubs preserve the
 * original module surface so existing imports keep compiling. They return
 * empty values rather than throwing so the wizard can continue and the
 * backend can attach file payloads (multipart) on its own contract.
 *
 * Original implementation kept below for reference.
 */

export interface UploadedBlob {
  url: string;
  name: string;
  originalName: string;
  size: number;
  contentType: string;
}

export async function uploadFileToAzure(
  file: File,
  _folder = '',
): Promise<UploadedBlob> {
  // TODO: backend will handle upload — return placeholder metadata.
  return {
    url: '',
    name: file.name,
    originalName: file.name,
    size: file.size,
    contentType: file.type || 'application/octet-stream',
  };
}

export async function uploadFilesToAzure(
  files: File[],
  folder = '',
): Promise<UploadedBlob[]> {
  return Promise.all(files.map((f) => uploadFileToAzure(f, folder)));
}

export async function uploadOptional(
  file: File | null | undefined,
  _folder = '',
): Promise<{ url: string; name: string }> {
  if (!file) return { url: '', name: '' };
  return { url: '', name: file.name };
}

export function isAzureConfigured(): boolean {
  return false;
}

/*
// ============================================================
// ORIGINAL CLIENT-SIDE AZURE UPLOAD IMPLEMENTATION (DISABLED)
// ============================================================
// import { BlobServiceClient } from '@azure/storage-blob';
//
// const CONN =
//   (import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING as string | undefined) ??
//   (import.meta.env.AZURE_STORAGE_CONNECTION_STRING as string | undefined) ??
//   '';
// const CONTAINER =
//   (import.meta.env.VITE_AZURE_STORAGE_CONTAINER as string | undefined) ??
//   (import.meta.env.AZURE_STORAGE_CONTAINER as string | undefined) ??
//   'affiliate-uploads';
//
// let cachedClient: BlobServiceClient | null = null;
//
// function getClient(): BlobServiceClient {
//   if (!CONN) throw new Error('VITE_AZURE_STORAGE_CONNECTION_STRING is not configured.');
//   if (!cachedClient) cachedClient = BlobServiceClient.fromConnectionString(CONN);
//   return cachedClient;
// }
//
// function safeName(name: string): string {
//   const dot = name.lastIndexOf('.');
//   const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[^a-zA-Z0-9._-]+/g, '-');
//   const ext = dot > 0 ? name.slice(dot) : '';
//   const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//   return `${stamp}-${base}${ext}`.slice(0, 200);
// }
//
// export async function uploadFileToAzure(file: File, folder = ''): Promise<UploadedBlob> {
//   const client = getClient();
//   const container = client.getContainerClient(CONTAINER);
//   const blobName = folder
//     ? `${folder.replace(/\/+$/, '')}/${safeName(file.name)}`
//     : safeName(file.name);
//   const blockBlob = container.getBlockBlobClient(blobName);
//   const buffer = await file.arrayBuffer();
//   await blockBlob.uploadData(buffer, {
//     blobHTTPHeaders: { blobContentType: file.type || 'application/octet-stream' },
//   });
//   return {
//     url: blockBlob.url,
//     name: blobName,
//     originalName: file.name,
//     size: file.size,
//     contentType: file.type || 'application/octet-stream',
//   };
// }
*/
