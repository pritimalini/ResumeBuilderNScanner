/**
 * Allowed file types for resume uploads
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
];

/**
 * Readable names for file types
 */
export const FILE_TYPE_NAMES: { [key: string]: string } = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC',
  'text/plain': 'TXT'
};

/**
 * Max file size for uploads (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Check if a file is of an allowed type
 */
export const isAllowedFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

/**
 * Check if a file is within the size limit
 */
export const isWithinSizeLimit = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

/**
 * Get file extension from file name
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get a readable file type name
 */
export const getFileTypeName = (file: File): string => {
  return FILE_TYPE_NAMES[file.type] || 'Unknown';
};

/**
 * Validate a file for upload
 * Returns null if valid, or an error message if invalid
 */
export const validateFile = (file: File): string | null => {
  if (!isAllowedFileType(file)) {
    return 'Unsupported file format. Please upload a PDF, DOCX, DOC, or TXT file.';
  }
  
  if (!isWithinSizeLimit(file)) {
    return `File size exceeds the ${formatFileSize(MAX_FILE_SIZE)} limit.`;
  }
  
  return null;
}; 