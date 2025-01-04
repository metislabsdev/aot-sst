/**
 * Converts a timestamp to ISO 8601 format
 * @param timestamp - Unix timestamp in seconds or milliseconds
 * @returns ISO 8601 formatted date string
 */
export const convertTimestampToISO = (timestamp: number) => {
  // Handle both millisecond and second timestamps
  const normalizedTimestamp =
    timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  return new Date(normalizedTimestamp).toISOString();
};

/**
 * Adds specified minutes to a timestamp and returns ISO 8601 format
 * @param timestamp - Unix timestamp in seconds or milliseconds
 * @param minutes - Number of minutes to add
 * @returns ISO 8601 formatted date string with added minutes
 */
export const addMinutesToTimestamp = (timestamp: number, minutes: number) => {
  // Normalize timestamp to milliseconds
  const normalizedTimestamp =
    timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;

  // Add minutes (convert minutes to milliseconds)
  const newTimestamp = normalizedTimestamp + minutes * 60 * 1000;

  // Return as ISO string
  return new Date(newTimestamp).toISOString();
};
