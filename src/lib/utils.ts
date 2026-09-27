/**
 * Helpful utility functions for UI styling and text formatting.
 */

// Simple class names combiner for clean conditional styling
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Format date into human-readable string
export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Convert English numbers to Bengali numerals (e.g. 16 -> ১৬)
export function toBengaliDigits(input: number | string): string {
  const englishToBengaliMap: Record<string, string> = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };

  return String(input).replace(/[0-9]/g, (digit) => englishToBengaliMap[digit] || digit);
}

// Truncate long strings safely
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
