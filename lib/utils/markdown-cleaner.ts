/**
 * Utility functions for cleaning and processing markdown content for PDF generation
 */

// Special marker to indicate where page breaks should occur in the PDF
export const PAGE_BREAK_MARKER = '===PAGE_BREAK===';

/**
 * Cleans markdown content for PDF generation
 * - Removes excessive whitespace
 * - Normalizes headings
 * - Handles special characters
 * - Adds page breaks where needed
 */
export function cleanReportContent(content: string): string {
  if (!content) return '';
  
  // Normalize line endings
  let cleanedContent = content.replace(/\r\n/g, '\n');
  
  // Remove any HTML tags that might have been included
  cleanedContent = cleanedContent.replace(/<[^>]*>/g, '');
  
  // Replace multiple consecutive blank lines with a single blank line
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
  
  // Add page breaks after major sections
  cleanedContent = cleanedContent.replace(/^# (.+)$/gm, (match, title) => {
    // Don't add page break before the first title
    if (cleanedContent.indexOf(match) === 0) {
      return match;
    }
    return `${PAGE_BREAK_MARKER}\n${match}`;
  });
  
  // Ensure proper spacing around headings
  cleanedContent = cleanedContent.replace(/^(#+) (.+)$/gm, (match, hashes, title) => {
    return `\n${hashes} ${title}\n`;
  });
  
  // Normalize bullet points
  cleanedContent = cleanedContent.replace(/^\s*[•*-]\s+/gm, '- ');
  
  // Simple character replacements for common special characters
  cleanedContent = cleanedContent
    .replace(/—/g, '-')    // em dash
    .replace(/–/g, '-')    // en dash
    .replace(/'/g, "'")    // curly single quote (open)
    .replace(/'/g, "'")    // curly single quote (close)
    .replace(/"/g, '"')    // curly double quote (open)
    .replace(/"/g, '"')    // curly double quote (close)
    .replace(/…/g, '...') // ellipsis
    .replace(/•/g, '-')    // bullet
    .replace(/°/g, ' degrees ') // degree symbol
    .replace(/×/g, 'x')    // multiplication
    .replace(/÷/g, '/')    // division
    .replace(/©/g, '(c)') // copyright
    .replace(/®/g, '(R)') // registered trademark
    .replace(/™/g, '(TM)'); // trademark
  
  // Ensure the document ends with a newline
  if (!cleanedContent.endsWith('\n')) {
    cleanedContent += '\n';
  }
  
  return cleanedContent;
}
