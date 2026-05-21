import pdf from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Service to extract raw text content from uploaded files
 */
export async function parseDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  // 1. Text File
  if (extension === 'txt' || mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  }

  // 2. PDF File
  if (extension === 'pdf' || mimeType === 'application/pdf') {
    try {
      const data = await pdf(buffer);
      return data.text || '';
    } catch (error: any) {
      console.error('PDF parsing error:', error);
      throw new Error(`Failed to parse PDF document: ${error.message}`);
    }
  }

  // 3. DOCX File
  if (
    extension === 'docx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (error: any) {
      console.error('DOCX parsing error:', error);
      throw new Error(`Failed to parse DOCX document: ${error.message}`);
    }
  }

  // Fallback / Unsupported type
  throw new Error(`Unsupported file type: .${extension} (${mimeType})`);
}
