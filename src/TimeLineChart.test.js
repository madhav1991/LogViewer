import React from 'react';
import { render, screen } from '@testing-library/react';
import TimelineChartSVG, { groupLogsByDateAndHour } from './TimelineChartSVG';

// Sample log data for testing
const sampleLogs = [
  { _time: '2024-09-30T05:00:00Z' },
  { _time: '2024-09-30T05:30:00Z' },
  { _time: '2024-09-30T06:00:00Z' },
  { _time: '2024-09-30T07:00:00Z' },
  { _time: '2024-09-30T07:30:00Z' },
];

describe('TimelineChartSVG Component', () => {
  test('renders without crashing', () => {
    render(<TimelineChartSVG data={sampleLogs} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders "No data to show" when there is no data', () => {
    render(<TimelineChartSVG data={[]} />); 

    const noDataMessage = screen.getByText(/no data to show/i);
    expect(noDataMessage).toBeInTheDocument();
  });

  test('groups logs by date and hour correctly', () => {
    const grouped = groupLogsByDateAndHour(sampleLogs);
    expect(grouped).toEqual([
      { date: '9/30/2024', hour: '5', count: 2 },
      { date: '9/30/2024', hour: '6', count: 1 },
      { date: '9/30/2024', hour: '7', count: 2 },
    ]);
  });

  test('renders the correct number of bars', () => {
    render(<TimelineChartSVG data={sampleLogs} />);
    const bars = screen.getAllByRole('img', { hidden: true });
    expect(bars.length).toBe(3); 
  });

  test('renders x-axis labels correctly', () => {
    render(<TimelineChartSVG data={sampleLogs} />);
    const xAxisLabels = sampleLogs.map(log => {
      const date = new Date(log._time).toLocaleDateString();
      const hour = new Date(log._time).getHours();
      return `${date} ${hour}:00`;
    });

    xAxisLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('has accessible title and description', () => {
    render(<TimelineChartSVG data={sampleLogs} />);
    expect(screen.getByLabelText('Logs Timeline Chart')).toBeInTheDocument();
    expect(screen.getByLabelText(/A bar chart representing logs grouped by date and hour/i)).toBeInTheDocument();
  });
});
