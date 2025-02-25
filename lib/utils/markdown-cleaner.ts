/**
 * Utility functions to clean and format markdown content before PDF generation
 */

interface FormattingInfo {
  isBold: boolean;
  text: string;
}

// Special marker to indicate a page break in the PDF
export const PAGE_BREAK_MARKER = '<!--PAGE_BREAK-->';

export function cleanMarkdown(content: string): string {
  // Split content into lines for processing
  const lines = content.split('\n');
  const cleanedLines = lines.map(line => {
    // Handle headings
    if (line.startsWith('# ')) {
      return line; // Keep heading markers for PDF generation
    }
    if (line.startsWith('## ')) {
      return line; // Keep subheading markers for PDF generation
    }
    if (line.startsWith('### ')) {
      return line; // Keep sub-subheading markers for PDF generation
    }

    // Handle bullet points
    if (line.startsWith('- ')) {
      return line; // Keep bullet point markers for PDF generation
    }

    // Clean up markdown formatting while preserving intended styles
    return cleanTextContent(line);
  });

  return cleanedLines.join('\n');
}

function cleanTextContent(text: string): string {
  // Remove any extra whitespace
  text = text.trim();

  // Handle bold text
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove ** markers but track for PDF generation

  // Remove any remaining markdown characters
  text = text.replace(/[_*`~]/g, ''); // Remove other markdown formatting characters
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Clean up links, keep text
  text = text.replace(/\s+/g, ' '); // Normalize whitespace

  return text;
}

export function parseFormattingInfo(text: string): FormattingInfo {
  const isBold = text.includes('**') || text.startsWith('#');
  const cleanedText = cleanTextContent(text);

  return {
    isBold,
    text: cleanedText
  };
}

/**
 * Spell check common misspellings in the report content
 */
function correctSpellings(text: string): string {
  const corrections: Record<string, string> = {
    'astrolgical': 'astrological',
    'astrolgy': 'astrology',
    'retrograd': 'retrograde',
    'conjuction': 'conjunction',
    'oppositon': 'opposition',
    'jupter': 'Jupiter',
    'mercry': 'Mercury',
    'vnus': 'Venus',
    'marrs': 'Mars',
    'satrun': 'Saturn',
    'uranis': 'Uranus',
    'neptne': 'Neptune',
    'plto': 'Pluto',
    'chrion': 'Chiron',
    'piscs': 'Pisces',
    'aquaris': 'Aquarius',
    'capricorn': 'Capricorn',
    'sagitarius': 'Sagittarius',
    'scorpio': 'Scorpio',
    'libra': 'Libra',
    'virgo': 'Virgo',
    'leo': 'Leo',
    'cancer': 'Cancer',
    'gemini': 'Gemini',
    'taurus': 'Taurus',
    'aries': 'Aries',
    'fullmoon': 'full moon',
    'full_moon': 'full moon',
    'newmoon': 'new moon',
    'lunareclipse': 'lunar eclipse',
    'solareclipse' : 'solar eclipse',
    // Add more common astrological misspellings as needed
  };

  let correctedText = text;
  
  // Apply corrections for whole words only (using word boundaries)
  Object.entries(corrections).forEach(([misspelled, correct]) => {
    const regex = new RegExp(`\\b${misspelled}\\b`, 'gi');
    correctedText = correctedText.replace(regex, correct);
  });

  return correctedText;
}

export function cleanReportContent(content: string): string {
  // Special handling for report-specific formatting
  let cleanedContent = content;

  // Remove all double asterisks (bold markers)
  cleanedContent = cleanedContent.replace(/\*\*/g, '');
  cleanedContent = cleanedContent.replace(/\*\*/g, '');

  // Add page break markers before each main heading
  cleanedContent = cleanedContent.replace(/^# /gm, `${PAGE_BREAK_MARKER}\n# `);
  
  // Ensure the first heading doesn't have a page break before it
  cleanedContent = cleanedContent.replace(`${PAGE_BREAK_MARKER}\n# `, '# ');
  
  // Add page break markers before each secondary heading to prevent content overflow
  //cleanedContent = cleanedContent.replace(/^## /gm, `${PAGE_BREAK_MARKER}\n## `);

  // Clean up section titles while preserving hierarchy and removing any markdown
  cleanedContent = cleanedContent.replace(/^(#+)\s*([^#\n]+)/gm, (_, hashes, title) => {
    const cleanTitle = title
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers and keep content
      .replace(/[*_`~\[\]]/g, '') // Remove other markdown characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    return `${hashes} ${cleanTitle}`;
  });

  // Clean up list items while preserving bullets and removing any markdown
  cleanedContent = cleanedContent.replace(/^(\s*-\s*)([^\n]+)/gm, (_, bullet, item) => {
    const cleanItem = item
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers and keep content
      .replace(/[*_`~\[\]]/g, '') // Remove other markdown characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    return `${bullet}${cleanItem}`;
  });

  // Clean up any remaining markdown in regular text
  cleanedContent = cleanedContent.split('\n').map(line => {
    // Skip lines that are already handled (headings and list items)
    if (line.match(/^#+\s/) || line.match(/^\s*-\s/) || line === PAGE_BREAK_MARKER) {
      return line;
    }
    
    // Clean up regular text lines
    return line
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers and keep content
      .replace(/[*_`~\[\]]/g, '') // Remove other markdown characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }).join('\n');

  // Remove any empty lines that might have been created
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
  
  // Apply spelling corrections
  cleanedContent = correctSpellings(cleanedContent);

  return cleanedContent;
}
