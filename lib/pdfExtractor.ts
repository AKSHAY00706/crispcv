// Client-side PDF text extraction
// Uses pdfjs-dist with the correct worker setup for Next.js

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const pdfjsLib = await import("pdfjs-dist");

  // Use the legacy build worker which is bundled with the package
  // This avoids the CDN loading issue
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  const totalPages = Math.min(pdf.numPages, 15);
  const textParts: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => {
        if ("str" in item) return item.str;
        return "";
      })
      .join(" ")
      .replace(/\s{3,}/g, " ")
      .trim();
    if (pageText) textParts.push(pageText);
  }

  const fullText = textParts.join("\n\n").trim();
  if (!fullText || fullText.length < 30) {
    throw new Error("PDF has no readable text. It may be a scanned image — try pasting the text instead.");
  }

  return fullText.slice(0, 8000);
}