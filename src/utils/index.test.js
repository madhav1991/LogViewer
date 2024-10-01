import { groupLogsByDateAndHour} from "./index";
  
  describe('groupLogsByDateAndHour', () => {
    test('correctly groups logs by date and hour', () => {
      const logs = [
        { _time: '2024-09-30T05:00:00Z' },
        { _time: '2024-09-30T05:30:00Z' },
        { _time: '2024-09-30T06:00:00Z' },
        { _time: '2024-09-30T07:00:00Z' },
        { _time: '2024-09-30T07:30:00Z' },
      ];
  
      const result = groupLogsByDateAndHour(logs);
  
      expect(result).toEqual([
        { date: '9/30/2024', hour: '1', count: 2 },
        { date: '9/30/2024', hour: '2', count: 1 },
        { date: '9/30/2024', hour: '3', count: 2 },
      ]);
    });
  
    test('returns empty array for empty input', () => {
      const result = groupLogsByDateAndHour([]);
      expect(result).toEqual([]);
    });
  
    test('handles multiple dates', () => {
      const logs = [
        { _time: '2024-09-30T05:00:00Z' },
        { _time: '2024-09-30T05:30:00Z' },
        { _time: '2024-09-30T06:00:00Z' },
        { _time: '2024-10-01T07:00:00Z' },
        { _time: '2024-10-01T07:30:00Z' },
      ];
  
      const result = groupLogsByDateAndHour(logs);
  
      expect(result).toEqual([
        { date: '9/30/2024', hour: '1', count: 2 },
        { date: '9/30/2024', hour: '2', count: 1 },
        { date: '10/1/2024', hour: '3', count: 2 },
      ]);
    });
  });
  