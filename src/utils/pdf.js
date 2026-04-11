import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

/**
 * Extracts text from a PDF ArrayBuffer
 */
export async function extractTextFromPDF(arrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Iterate through all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    // Clean up text (remove excessive whitespace)
    const cleanedText = fullText.replace(/\s+/g, ' ').trim();
    
    // Truncate to reasonable limits to avoid API token blowouts (e.g. max 5000 chars)
    return cleanedText.length > 5000 ? cleanedText.substring(0, 5000) + '...' : cleanedText;
    
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Could not parse PDF file. Ensure it is a valid text-based PDF.");
  }
}
