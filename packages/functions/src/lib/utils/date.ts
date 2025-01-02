export const convertTimestampToISO = (timestamp: number) => {
  // Handle both millisecond and second timestamps
  const normalizedTimestamp =
    timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  return new Date(normalizedTimestamp).toISOString();
};

export const addMinutesToTimestamp = (timestamp: number, minutes: number) => {
  // Normalize timestamp to milliseconds
  const normalizedTimestamp =
    timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;

  // Add minutes (convert minutes to milliseconds)
  const newTimestamp = normalizedTimestamp + minutes * 60 * 1000;

  // Return as ISO string
  return new Date(newTimestamp).toISOString();
};
