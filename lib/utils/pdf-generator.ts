import fs from 'fs';
import path from 'path';

// Define PDFPage type
type PDFPage = any;

export async function createPDF(content: string, firstName: string): Promise<Uint8Array> {
  // Use require for pdf-lib to avoid build-time issues
  // We're using dynamic import with require to ensure it's only loaded at runtime
  const pdfLib = await new Promise<any>((resolve) => {
    resolve(require('pdf-lib'));
  });
  const { PDFDocument, StandardFonts, rgb } = pdfLib;
  
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Calculate date range
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  const todayStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const endDateStr = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const pageWidth = 612; // Letter size width
  const pageHeight = 792; // Letter size height
  const margin = 50;
  const bottomMargin = 70; // Increased from 50 to provide more space for footer
  const contentWidth = pageWidth - margin * 2;

  // Create the first page
  const firstPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 50;

  // Try to embed the logo from public/orangelogo.png
  try {
    const logoPath = path.join(process.cwd(), 'public', 'orangelogo.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.25);

    // Calculate the x position to center the logo
    const centeredX = (pageWidth - logoDims.width) / 2;

    // Draw the logo with the centered x coordinate
    firstPage.drawImage(logoImage, {
      x: centeredX,
      y: y - logoDims.height,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Adjust y position to avoid overlap with the logo
    y -= logoDims.height + 30;
  } catch (err) {
    console.error('Could not embed orangelogo.png from public folder:', err);
    // If the logo fails to load, the report will continue without the logo
  }

  // Draw the main title
  const mainTitle = 'AstroGenie Report';
  const titleWidth = helveticaBold.widthOfTextAtSize(mainTitle, 28);
  firstPage.drawText(mainTitle, {
    x: (pageWidth - titleWidth) / 2,
    y: y,
    size: 28,
    font: helveticaBold,
    color: rgb(254/255, 142/255, 12/255),
  });
  y -= 35;

  // Draw the subtitle
  const subTitle = 'Comprehensive upcoming 30-Day Focus and Action Plan';
  const subTitleWidth = helvetica.widthOfTextAtSize(subTitle, 14);
  firstPage.drawText(subTitle, {
    x: (pageWidth - subTitleWidth) / 2,
    y: y,
    size: 14,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 25;

  // Date range
  const dateRangeText = `From ${todayStr} to ${endDateStr}`;
  const dateRangeWidth = helvetica.widthOfTextAtSize(dateRangeText, 12);
  firstPage.drawText(dateRangeText, {
    x: (pageWidth - dateRangeWidth) / 2,
    y: y,
    size: 12,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 20;

  // Draw the divider line
  const lineY = y - 10;
  firstPage.drawLine({
    start: { x: margin, y: lineY },
    end: { x: pageWidth - margin, y: lineY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y = lineY - 50;

  // Function to draw footer and page number
  const drawFooterAndPageNumber = (page: PDFPage, pageNumber: number, totalPages: number) => {
    const footerText = "Copyright 2025 - AstroGenie. All Rights Reserved to SensaCall.";
    const footerWidth = helvetica.widthOfTextAtSize(footerText, 10);
    const pageText = `Page ${pageNumber}`;
    
    // Draw footer text
    page.drawText(footerText, {
      x: (pageWidth - footerWidth) / 2,
      y: margin / 2,
      size: 10,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Draw page number
    page.drawText(pageText, {
      x: pageWidth - margin - helvetica.widthOfTextAtSize(pageText, 10),
      y: margin / 2,
      size: 10,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });
  };

  // First pass: calculate total pages needed
  let totalPages = 1;
  let tempY = y;

  for (const line of content.split('\n')) {
    if (tempY < margin + bottomMargin) {
      totalPages++;
      tempY = pageHeight - margin;
    }
    
    if (line.startsWith('# ')) tempY -= 70;
    else if (line.startsWith('## ')) tempY -= 50;
    else if (line.startsWith('- ')) {
      const bulletText = line.substring(2);
      const words = bulletText.split(' ');
      let currentLine = '';
      let xPos = margin + 40;

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = helvetica.widthOfTextAtSize(testLine, 12);
        if (xPos + textWidth > pageWidth - margin) {
          tempY -= 20;
          xPos = margin + 30;
          if (tempY < margin + bottomMargin) {
            totalPages++;
            tempY = pageHeight - margin;
          }
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      tempY -= 30;
    }
    else if (line.trim() === '') tempY -= 20;
    else {
      const words = line.split(' ');
      let currentLine = '';
      let xPos = margin;

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = helvetica.widthOfTextAtSize(testLine, 12);
        if (xPos + textWidth > pageWidth - margin) {
          tempY -= 20;
          xPos = margin;
          if (tempY < margin + bottomMargin) {
            totalPages++;
            tempY = pageHeight - margin;
          }
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      tempY -= 30;
    }
  }

  // Parse and place content
  let currentPage = firstPage;
  const pages = [firstPage];
  const lines = content.split('\n');

  // Function to create new page
  const createNewPage = () => {
    // Draw footer on current page before creating new one
    if (currentPage) {
      drawFooterAndPageNumber(currentPage, pages.length, totalPages);
    }
    
    // Create and setup new page
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    pages.push(currentPage);
    return pageHeight - margin;
  };

  // Function to check if new page is needed
  const needsNewPage = (currentY: number) => {
    // Add extra buffer (80px) to ensure text doesn't get too close to the footer
    return currentY < margin + bottomMargin + 80;
  };

  // Import the page break marker from markdown-cleaner
  const { PAGE_BREAK_MARKER } = await import('./markdown-cleaner');

  for (const line of lines) {
    // Check if this line is a page break marker
    if (line === PAGE_BREAK_MARKER) {
      // Create a new page regardless of current position
      y = createNewPage();
      continue; // Skip to the next line
    }
    
    if (needsNewPage(y)) {
      y = createNewPage();
    }

    if (line.startsWith('# ')) {
      y -= 20; // Reduced from 30 to make better use of page space
      currentPage.drawText(line.substring(2), {
        x: margin,
        y,
        size: 24,
        font: helveticaBold,
        color: rgb(254/255, 142/255, 12/255),
      });
      y -= 30; // Reduced from 40 to make better use of page space
    } else if (line.startsWith('## ')) {
      y -= 20;
      currentPage.drawText(line.substring(3), {
        x: margin,
        y,
        size: 20,
        font: helveticaBold,
        color: rgb(254/255, 142/255, 12/255),
      });
      y -= 25; // Reduced from 30 to make better use of page space
    } else if (line.startsWith('- ')) {
      currentPage.drawText('•', {
        x: margin + 15,
        y,
        size: 12,
        font: helvetica,
        color: rgb(254/255, 142/255, 12/255),
      });

      const bulletText = line.substring(2);
      const words = bulletText.split(' ');
      let currentLine = '';
      let xPos = margin + 40;

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = helvetica.widthOfTextAtSize(testLine, 12);

        if (xPos + textWidth > pageWidth - margin) {
          currentPage.drawText(currentLine, {
            x: xPos,
            y,
            size: 12,
            font: helvetica,
            color: rgb(0, 0, 0),
          });
          currentLine = word + ' ';
          y -= 20;
          xPos = margin + 30;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        currentPage.drawText(currentLine, {
          x: xPos,
          y,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
      }

      y -= 30;
    } else if (line.trim() === '') {
      y -= 20;
    } else {
      let currentLine = '';
      let xPos = margin;
      let isBold = false;
      let text = line;

      // Enhanced markdown character handling
      // First check for bold formatting
      isBold = text.includes('**') || text.startsWith('#');
      
      // Then remove all markdown characters while preserving formatting intent
      text = text.replace(/\*\*/g, ''); // Remove all ** markers
      text = text.replace(/^#+\s*/, ''); // Remove any # markers at start
      text = text.replace(/\[|\]|\*|_/g, ''); // Remove any other markdown characters
      text = text.trim(); // Clean up any remaining whitespace

      const words = text.split(' ');
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = (isBold ? helveticaBold : helvetica).widthOfTextAtSize(testLine, 12);

        if (xPos + textWidth > pageWidth - margin) {
          currentPage.drawText(currentLine, {
            x: xPos,
            y,
            size: 12,
            font: isBold ? helveticaBold : helvetica,
            color: rgb(0, 0, 0),
          });
          currentLine = word + ' ';
          y -= 20;
          xPos = margin;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        currentPage.drawText(currentLine, {
          x: xPos,
          y,
          size: 12,
          font: isBold ? helveticaBold : helvetica,
          color: rgb(0, 0, 0),
        });
      }

      y -= 25; // Reduced from 30 to make better use of page space

      if (needsNewPage(y)) {
        y = createNewPage();
      }
    }
  }

  // Add footer and page numbers to all pages
  pages.forEach((page, index) => {
    drawFooterAndPageNumber(page, index + 1, pages.length);
  });

  return await pdfDoc.save();
}
