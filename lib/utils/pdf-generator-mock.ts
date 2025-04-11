/**
 * Mock implementation of PDF generation for build process
 * This file is used during the build process to avoid issues with pdf-lib
 */

export async function createPDF(content: string, firstName: string): Promise<Uint8Array> {
  console.log('Mock PDF generation called');
  // Return an empty Uint8Array
  return new Uint8Array(0);
}
