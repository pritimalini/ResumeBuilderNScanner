/**
 * Format a date as a human-readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format a date with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

/**
 * Get a relative time string (e.g., "2 hours ago")
 */
export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  if (diffInYears > 0) {
    return rtf.format(-diffInYears, 'year');
  } else if (diffInMonths > 0) {
    return rtf.format(-diffInMonths, 'month');
  } else if (diffInDays > 0) {
    return rtf.format(-diffInDays, 'day');
  } else if (diffInHours > 0) {
    return rtf.format(-diffInHours, 'hour');
  } else if (diffInMinutes > 0) {
    return rtf.format(-diffInMinutes, 'minute');
  } else {
    return rtf.format(-diffInSeconds, 'second');
  }
};

/**
 * Calculate days elapsed since a date
 */
export const getDaysElapsed = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Format a date as a sortable string (YYYY-MM-DD)
 */
export const formatSortableDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}; 