/**
 * Safely format any timestamp variant to a locale date string.
 * Handles: Firestore Timestamp {seconds, nanoseconds}, ISO string, Unix ms number, null/undefined.
 */
export function formatDate(
  timestamp: any,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
): string {
  if (!timestamp) return 'N/A';
  // Firestore Timestamp object
  if (timestamp?.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString(locale, options);
  }
  // toDate() method (firebase Timestamp class instance)
  if (typeof timestamp?.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString(locale, options);
  }
  // Unix milliseconds
  if (typeof timestamp === 'number') {
    return new Date(timestamp).toLocaleDateString(locale, options);
  }
  // ISO String or any stringifiable date
  if (typeof timestamp === 'string') {
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString(locale, options);
  }
  return 'N/A';
}

export function formatTime(timestamp: any): string {
  if (!timestamp) return '';
  if (timestamp?.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  if (typeof timestamp?.toDate === 'function') {
    return timestamp.toDate().toLocaleTimeString();
  }
  if (typeof timestamp === 'number') return new Date(timestamp).toLocaleTimeString();
  if (typeof timestamp === 'string') {
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString();
  }
  return '';
}
