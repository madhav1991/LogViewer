import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import TimelineChart from "./TimelineChart";
import * as echarts from "echarts";

jest.mock("echarts", () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    dispose: jest.fn(),
  })),
}));

jest.mock("./utils/index", () => ({
  groupLogsByHour: jest.fn((data) =>
    data.map((d, i) => ({ time: d.time, count: i }))
  ),
}));

describe("TimelineChart component", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test("renders the chart and initializes echarts with the correct options", () => {
    const mockData = [{ time: new Date(), count: 1 }];
    render(<TimelineChart data={mockData} />);

    // Verify echarts was initialized
    expect(echarts.init).toHaveBeenCalled();

    // Verify that setOption was called with the right options
    const mockInstance = echarts.init.mock.results[0].value;
    expect(mockInstance.setOption).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.objectContaining({ text: "Timeline Component" }),
        xAxis: expect.objectContaining({ type: "time" }),
        yAxis: expect.objectContaining({ name: "Event Count" }),
      })
    );
  });

  test("updates the chart when data prop changes", () => {
    const initialData = [{ time: new Date(), count: 1 }];
    const { rerender } = render(<TimelineChart data={initialData} />);

    const mockInstance = echarts.init.mock.results[0].value;

    // Update data
    const updatedData = [
      { time: new Date(), count: 2 },
      { time: new Date(), count: 3 },
    ];
    rerender(<TimelineChart data={updatedData} />);

    // Verify that the chart is updated
    expect(mockInstance.setOption).toHaveBeenCalledTimes(2); // Called initially and after data update
  });

  test("disposes of the chart on unmount", () => {
    const mockData = [{ time: new Date(), count: 1 }];
    const { unmount } = render(<TimelineChart data={mockData} />);

    const mockInstance = echarts.init.mock.results[0].value;
    unmount();

    // Verify that the chart is disposed of
    expect(mockInstance.dispose).toHaveBeenCalled();
  });
});
