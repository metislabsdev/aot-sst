export function formatNumber(number: number) {
  // Convert to string and remove decimal places
  const numStr = Math.floor(number).toString();

  // Add commas using regex
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
