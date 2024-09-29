import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LogViewer from "./LogViewer";
import { TimelineChart } from "./TimelineChart";

// Mock dependencies
jest.mock("./TimelineChart", () => ({
  TimelineChart: jest.fn(() => <div data-testid="timeline-chart" />),
}));

jest.mock("./StyledLogViewer", () => ({
  LogViewerContainer: jest.fn(({ children }) => <div>{children}</div>),
  StyledTable: jest.fn(({ children }) => <table>{children}</table>),
  TableHeader: jest.fn(({ children }) => <th>{children}</th>),
  TableCell: jest.fn(({ children }) => <td>{children}</td>),
  Chevron: jest.fn(({ expanded }) => <span>{expanded ? "▼" : "›"}</span>),
  LogRow: jest.fn(({ children, onClick }) => (
    <tr onClick={onClick}>{children}</tr>
  )),
  LoadingIndicator: jest.fn(({ children }) => <div>{children}</div>),
}));

describe("LogViewer component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders TimelineChart and table correctly", async () => {
    // Mock fetch call to return sample log data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () =>
          Promise.resolve(
            `{"_time": "2024-01-01T12:00:00Z", "event": "Test event"}`
          ),
      })
    );

    render(<LogViewer />);

    // Check if TimelineChart is rendered
    expect(screen.getByTestId("timeline-chart")).toBeInTheDocument();

    // Wait for logs to load and render in the table
    await waitFor(() =>
      expect(screen.getByText("2024-01-01T12:00:00.000Z")).toBeInTheDocument()
    );
    expect(screen.getByText(/Test event/)).toBeInTheDocument();
  });

  test("fetches and displays logs correctly", async () => {
    // Mock fetch call to return sample log data
    global.fetch = jest.fn(() =>
      Promise.resolve({
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

  test("fetches more logs when scrolling to end of list", async () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
    });
    global.IntersectionObserver = mockIntersectionObserver;

    // Mock fetch call to return logs for multiple chunks
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        text: () =>
          Promise.resolve(
            `{"_time": "2024-01-01T12:00:00Z", "event": "First event"}`
          ),
      })
      .mockResolvedValueOnce({
        text: () =>
          Promise.resolve(
            `{"_time": "2024-01-01T12:05:00Z", "event": "Second event"}`
          ),
      });

    render(<LogViewer />);

    // Check if the first chunk of logs is rendered
    await waitFor(() => screen.getByText("2024-01-01T12:00:00.000Z"));

    // Simulate the intersection observer triggering load more logs
    await waitFor(() => {
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });
  });
});
