export class DocumentProcessor {
  static async extractText(file: File): Promise<{ text: string; title: string }> {
    const type = file.type;

    if (type === "application/pdf") {
      return await this.extractPDFText(file);
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await this.extractDOCXText(file);
    } else if (type === "text/plain") {
      return await this.extractTXTText(file);
    } else {
      throw new Error(`Unsupported file type: ${type}`);
    }
  }

  private static async extractPDFText(file: File): Promise<{ text: string; title: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import("pdfjs-dist");

    try {
      const workerUrl = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } catch {
      const workerUrl = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        window.location.href
      ).toString();
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      fullText += `[Page ${i}]\n${pageText}\n\n`;
    }

    const title = file.name.replace(/\.pdf$/i, "");
    return { text: fullText, title };
  }

  private static async extractDOCXText(file: File): Promise<{ text: string; title: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await import("mammoth");

    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    const title = file.name.replace(/\.docx$/i, "");
    return { text, title };
  }

  private static async extractTXTText(file: File): Promise<{ text: string; title: string }> {
    const text = await file.text();
    const title = file.name.replace(/\.txt$/i, "");
    return { text, title };
  }
}
