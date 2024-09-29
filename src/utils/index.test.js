import { formatHour, groupLogsByHour } from "./timeUtils";

describe("formatHour", () => {
  it("should format the timestamp to the start of the hour", () => {
    const timestamp = "2024-08-21T09:45:00Z";
    const result = formatHour(timestamp);
    expect(result).toBe("2024-08-21T09:00:00.000Z");
  });

  it("should handle timestamps with seconds and milliseconds correctly", () => {
    const timestamp = "2024-08-21T09:45:30.123Z";
    const result = formatHour(timestamp);
    expect(result).toBe("2024-08-21T09:00:00.000Z");
  });

  it("should format timestamps in different time zones correctly", () => {
    const timestamp = "2024-08-21T13:45:00+04:00"; // UTC+4
    const result = formatHour(timestamp);
    expect(result).toBe("2024-08-21T09:00:00.000Z"); // Should return UTC+0 time
  });

  it("should return a correctly formatted hour even for early times in the day", () => {
    const timestamp = "2024-08-21T00:15:00Z";
    const result = formatHour(timestamp);
    expect(result).toBe("2024-08-21T00:00:00.000Z");
  });
});

// Test cases for groupLogsByHour
describe("groupLogsByHour", () => {
  it("should group logs by hour and count occurrences", () => {
    const logs = [
      { _time: "2024-08-21T09:15:00Z" },
      { _time: "2024-08-21T09:45:00Z" },
      { _time: "2024-08-21T10:00:00Z" },
      { _time: "2024-08-21T10:30:00Z" },
    ];
    const result = groupLogsByHour(logs);
    expect(result).toEqual([
      { time: "2024-08-21T09:00:00.000Z", count: 2 },
      { time: "2024-08-21T10:00:00.000Z", count: 2 },
    ]);
  });

  it("should return an empty array when no logs are passed", () => {
    const logs = [];
    const result = groupLogsByHour(logs);
    expect(result).toEqual([]);
  });

  it("should handle logs with times in different hours correctly", () => {
    const logs = [
      { _time: "2024-08-21T09:15:00Z" },
      { _time: "2024-08-21T10:00:00Z" },
      { _time: "2024-08-21T11:30:00Z" },
      { _time: "2024-08-21T11:45:00Z" },
    ];
    const result = groupLogsByHour(logs);
    expect(result).toEqual([
      { time: "2024-08-21T09:00:00.000Z", count: 1 },
      { time: "2024-08-21T10:00:00.000Z", count: 1 },
      { time: "2024-08-21T11:00:00.000Z", count: 2 },
    ]);
  });

  it("should handle single log entries", () => {
    const logs = [{ _time: "2024-08-21T09:45:00Z" }];
    const result = groupLogsByHour(logs);
    expect(result).toEqual([{ time: "2024-08-21T09:00:00.000Z", count: 1 }]);
  });
});
