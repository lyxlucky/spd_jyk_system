/**
 * Triggers a file download in the browser from a Blob object.
 *
 * @param {Blob} blob - The Blob object representing the file content.
 * @param {string} fileName - The desired name for the downloaded file.
 * @param {string} [defaultFileName='download'] - A fallback filename if fileName is empty or null.
 */
export function downloadBlob(blob, fileName, defaultFileName = 'download') {
    // Validate inputs
    if (!(blob instanceof Blob)) {
      console.error('downloadBlob requires a Blob object as the first argument.');
      return;
    }
    if (!fileName || typeof fileName !== 'string') {
        fileName = defaultFileName;
    }
    // Create a URL for the blob
    // URL.createObjectURL() creates a DOMString containing a URL representing the object given in the parameter.
    // This URL lifetime is tied to the document in the window on which it was created.
    const blobUrl = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName; // Set the download attribute to the desired filename
    // Append the link to the body temporarily, click it, and then remove it
    // Appending to body is sometimes required for the click() method to work in all browsers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM
    // Release the object URL
    // It's important to revoke the object URL when it's no longer needed to release memory resources.
    // A short timeout is sometimes used to ensure the download is initiated before the URL is revoked.
    setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
  }
  
  // Example of getting filename from Content-Disposition header (Optional helper)
  /**
   * Extracts the filename from the Content-Disposition header of an HTTP response.
   * Assumes header format is like: attachment; filename="example.xlsx" or filename*=UTF-8''example.xlsx
   * @param {Response} response - The fetch Response object.
   * @returns {string | null} The extracted filename, or null if not found.
   */
  export function getFileNameFromResponseHeaders(response) {
    const contentDisposition = response.headers['Content-Disposition'];
    if (!contentDisposition) {
      return null;
    }
    const parts = contentDisposition.split(';');
    for (const part of parts) {
      const trimmedPart = part.trim();
      if (trimmedPart.startsWith('filename=')) {
        // Handles simple filename="filename.ext"
        const filenameMatch = trimmedPart.match(/filename="?([^"]+)"?$/);
        if (filenameMatch && filenameMatch[1]) {
          return filenameMatch[1];
        }
      } else if (trimmedPart.startsWith('filename*=')) {
          // Handles filename*=UTF-8''encodedfilename.ext (RFC 6266)
           try {
               const filenameEncodedMatch = trimmedPart.match(/filename\*=UTF-8''(.+)$/i);
               if(filenameEncodedMatch && filenameEncodedMatch[1]) {
                   // Decode the URL-encoded filename
                   return decodeURIComponent(filenameEncodedMatch[1]);
               }
           } catch(e) {
               console.error("Failed to decode filename*:", e);
           }
      }
    }
    return null;
  }