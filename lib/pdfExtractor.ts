// Client-side PDF text extraction using pdf.js
// Called from InputPanel when user drops a PDF

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import pdfjs to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const pdf   = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = pdf.numPages;
  const texts: string[] = [];

  for (let i = 1; i <= Math.min(pages, 10); i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    texts.push(pageText);
  }

  return texts.join("\n").replace(/\s{3,}/g, "\n").trim().slice(0, 8000);
}
