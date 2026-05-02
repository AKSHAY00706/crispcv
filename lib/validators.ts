export function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return ["http:", "https:"].includes(u.protocol);
  } catch { return false; }
}

export function sanitiseText(text: string, maxLen = 8000): string {
  return text.replace(/<[^>]*>/g, "").slice(0, maxLen).trim();
}

export const ALLOWED_PDF_MIME = "application/pdf";
export const MAX_PDF_BYTES    = 5 * 1024 * 1024; // 5 MB

export function validatePdfFile(file: File): string | null {
  if (file.type !== ALLOWED_PDF_MIME) return "Only PDF files are allowed.";
  if (file.size > MAX_PDF_BYTES)      return "PDF must be under 5 MB.";
  return null;
}
