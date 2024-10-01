// Group logs by date and hour
export const groupLogsByDateAndHour = (data) => {
    const grouped = {};
    data.forEach(log => {
      const date = new Date(log._time).toLocaleDateString(); // Get the date
      const hour = new Date(log._time).getHours(); // Get the hour
      const key = `${date} ${hour}`; // Create a key combining date and hour
      grouped[key] = (grouped[key] || 0) + 1; // Increment the count
    });
    return Object.keys(grouped).map(key => {
      const [date, hour] = key.split(" ");
      return {
        date,
        hour,
        count: grouped[key]
      };
    });
  };