import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LogViewer from "./LogViewer";

global.IntersectionObserver = class {
  constructor(callback) {
      this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe("LogViewer component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays logs correctly", async () => {
    // Mock fetch call to return sample log data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        text: () =>
          Promise.resolve(
            `{"_time": "2024-01-01T12:00:00Z", "event": "Test event"}`
          ),
      })
    );

    const { getByText } = render(<LogViewer />);

    // Check if the fetched log is rendered in the table
    await waitFor(() => getByText("2024-01-01T12:00:00.000Z"));
    expect(getByText(/Test event/)).toBeInTheDocument();
  });

  test("toggles row expansion to show log details", async () => {
    // Mock fetch call to return sample log data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        text: () =>
          Promise.resolve(
            `{"_time": "2024-01-01T12:00:00Z", "event": "Test event"}`
          ),
      })
    );

    render(<LogViewer />);

    // Wait for log to be rendered
    await waitFor(() => screen.getByText("2024-01-01T12:00:00.000Z"));

    // Click the row to expand
    fireEvent.click(screen.getByText("2024-01-01T12:00:00.000Z"));

    // Check if the detailed log is shown
    expect(screen.getByText(/"event": "Test event"/)).toBeInTheDocument();
  });

  test("shows loading indicator when fetching logs", async () => {
    // Mock fetch call to simulate loading state
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              ok: true,
              statusText: "OK",
              text: () =>
                Promise.resolve(
                  `{"_time": "2024-01-01T12:00:00Z", "event": "Test event"}`
                ),
            });
          }, 500)
        )
    );

    render(<LogViewer />);

    // Loading indicator should be visible during fetch
    expect(screen.getByText(/Loading more logs/)).toBeInTheDocument();

    // Wait for fetch to complete and loading indicator to disappear
    await waitFor(() =>
      expect(screen.queryByText(/Loading more logs/)).not.toBeInTheDocument()
    );
  });


});
