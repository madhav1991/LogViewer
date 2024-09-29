// Function to format time to the desired hourly format (e.g., "2024-08-21T09:00:00")
const formatHour = (timestamp) => {
    const date = new Date(timestamp);
    date.setMinutes(0, 0, 0); // Set minutes and seconds to 0 to group by hour
    return date.toISOString();
  };
  
  // Group logs by hourly timestamp and count the occurrences
  export const groupLogsByHour = (logs) => {
    const groupedLogs = {};
    logs.forEach((log) => {
      const hour = formatHour(log._time); // Format the time to hour
      if (groupedLogs[hour]) {
        groupedLogs[hour] += 1; // Increment count if the hour already exists
      } else {
        groupedLogs[hour] = 1; // Initialize count for a new hour
      }
    });
    // Convert the grouped logs object to the desired array format
    return Object.keys(groupedLogs).map((hour) => ({
      time: hour,
      count: groupedLogs[hour],
    }));
  };
  