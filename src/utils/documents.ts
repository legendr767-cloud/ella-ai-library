import { pdfjs } from 'react-pdf';

export const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE) || 52428800; // 50 MB
export const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5 MB

export type BookFileType = 'pdf' | 'epub';

export function formatBytes(bytes?: number | null): string {
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export async function sha256Hex(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Checks extension, size AND the file's real signature so a renamed .exe is rejected. */
export async function validateBookFile(
  file: File
): Promise<{ ok: true; type: BookFileType } | { ok: false; error: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'pdf' && ext !== 'epub') {
    return { ok: false, error: 'Only PDF and EPUB files are allowed.' };
  }
  if (file.size === 0) return { ok: false, error: 'The file is empty.' };
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: `File is too large (max ${formatBytes(MAX_FILE_SIZE)}).` };
  }
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const asText = String.fromCharCode(...head);
  if (ext === 'pdf' && !asText.startsWith('%PDF')) {
    return { ok: false, error: 'This file is not a valid PDF.' };
  }
  if (ext === 'epub' && !(head[0] === 0x50 && head[1] === 0x4b)) {
    return { ok: false, error: 'This file is not a valid EPUB.' };
  }
  return { ok: true, type: ext };
}

export async function validateCoverFile(file: File): Promise<string | null> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'Cover must be a JPG, PNG or WebP image.';
  }
  if (file.size > MAX_COVER_SIZE) return 'Cover image must be under 5 MB.';
  return null;
}

/** Reads the real page count from a PDF (returns null for EPUB or on failure). */
export async function getPdfPageCount(file: File): Promise<number | null> {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString();
    const data = new Uint8Array(await file.arrayBuffer());
    const doc = await pdfjs.getDocument({ data }).promise;
    const pages = doc.numPages;
    await doc.destroy();
    return pages;
  } catch {
    return null;
  }
}

export function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-80);
}
