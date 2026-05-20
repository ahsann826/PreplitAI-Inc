const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');
const mammoth = require('mammoth');
const fs = require('fs').promises;

class DocumentParser {
  /**
   * Extract text from PDF file
   */
  async parsePDF(filePath) {
    try {
      console.log('parsePDF reading:', filePath);
      const dataBuffer = await fs.readFile(filePath);
      console.log('parsePDF buffer length:', dataBuffer.length);
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(dataBuffer) });
      const pdfDoc = await loadingTask.promise;
      let text = '';
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((it) => it.str).join(' ');
        text += pageText + '\n';
      }
      return text;
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX file
   */
  async parseDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX parsing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from TXT file
   */
  async parseTXT(filePath) {
    try {
      const text = await fs.readFile(filePath, 'utf-8');
      return text;
    } catch (error) {
      throw new Error(`TXT parsing failed: ${error.message}`);
    }
  }

  /**
   * Main parser - detects file type and extracts text
   */
  async parseDocument(filePath, mimeType) {
    let text = '';

    console.log('parseDocument:', { filePath, mimeType });

    if (mimeType === 'application/pdf') {
      text = await this.parsePDF(filePath);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      text = await this.parseDOCX(filePath);
    } else if (mimeType === 'text/plain') {
      text = await this.parseTXT(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    if (!text || text.length < 50) {
      throw new Error('Document appears to be empty or too short');
    }

    return text;
  }
}

module.exports = new DocumentParser();
