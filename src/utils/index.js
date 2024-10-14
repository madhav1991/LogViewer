// Group logs by date and hour
export const groupLogsByDateAndHour = (data) => {
    const grouped = {};
    data.forEach(log => {
      const date = new Date(log._time).toLocaleDateString();
      const hour = new Date(log._time).getHours(); 
      const key = `${date} ${hour}`; 
      grouped[key] = (grouped[key] || 0) + 1;
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