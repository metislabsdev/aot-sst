/**
 * Formats a number with comma separators for thousands
 * @param number - The number to format
 * @returns A string representation of the number with comma separators
 * @example
 * formatNumber(1234567) // returns "1,234,567"
 * formatNumber(1000) // returns "1,000"
 */
export function formatNumber(number: number) {
  // Convert to string and remove decimal places
  const numStr = Math.floor(number).toString();

  // Add commas using regex
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
