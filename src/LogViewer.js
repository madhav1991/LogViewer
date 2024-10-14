import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LogViewerContainer,
  StyledTable,
  TableHeader,
  TableCell,
  Chevron,
  LogRow,
  LoadingIndicator,
} from "./StyledLogViewer";
import {TimelineChartSVG} from './TimelineChartSVG'

const LogViewer = () => {
  const [logs, setLogs] = useState([]); // Store log entries
  const [expandedRows, setExpandedRows] = useState([]); // Manage expanded rows
  const [start, setStart] = useState(0); // Byte start position for range requests
  const chunkSize = 10000; // Fetch 10KB chunks at a time
  const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

  const endOfLogRef = useRef(null); // Ref for the loading element
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const parseNDJSON = (data) => {
    const lines = data.split("\n").filter((line) => line.trim() !== "");
    const newLogs = [];

    lines.forEach((line) => {
      if (line.trim() !== "") {
        try {
          const logEntry = JSON.parse(line);
          newLogs.push(logEntry);
        } catch (error) {
          console.error("Failed to parse line:", line, error);
        }
      }
    });
    setLogs((prevLogs) => [...prevLogs, ...newLogs]);
  };

  const fetchLogChunk = async (url, start, end) => {
    try {
      const response = await fetch(url, {
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }

      const text = await response.text();
      return text;
    } catch (error) {
      setLoading(false);
      setError("Failed to load logs. Please try again.");
      throw error;
    }
  };

  const fetchLogs = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const newChunk = await fetchLogChunk(url, start, start + chunkSize);
    parseNDJSON(newChunk);
    setStart((prev) => prev + chunkSize);
    setLoading(false);
  }, [url, start, loading]);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchLogs(); // Fetch more logs when the loading element is visible and conditions are met
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the loading element is visible
      }
    );

    if (endOfLogRef.current) {
      observer.observe(endOfLogRef.current);
    }

    return () => {
      if (endOfLogRef.current) {
        observer.unobserve(endOfLogRef.current);
      }
    };
  }, [fetchLogs, loading]);

  const toggleRow = (index) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(index)
        ? prevExpandedRows.filter((row) => row !== index)
        : [...prevExpandedRows, index]
    );
  };

  return (
    <>
      {<TimelineChartSVG data={logs} data-testid="timeline-chart"/>}
      <LogViewerContainer>
        <StyledTable>
          <thead>
            <tr>
              <TableHeader scope="col">Time</TableHeader>
              <TableHeader scope="col">Event</TableHeader>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <LogRow
                key={index}
                onClick={() => toggleRow(index)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleRow(index);
                  }
                }}
                role="button"
              >
                <TableCell>
                  <Chevron expanded={expandedRows.includes(index)}>
                    {expandedRows.includes(index) ? "⌄" : "›"}
                  </Chevron>
                  {new Date(log._time).toISOString()}
                </TableCell>
                <TableCell>
                  {expandedRows.includes(index) ? (
                    <pre>{JSON.stringify(log, null, 2)}</pre>
                  ) : (
                    <span>{JSON.stringify(log)}</span>
                  )}
                </TableCell>
              </LogRow>
            ))}
          </tbody>
        </StyledTable>
        {loading && <LoadingIndicator>Loading more logs...</LoadingIndicator>}
        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}
        <div ref={endOfLogRef} /> {/* Ref for Intersection Observer */}
      </LogViewerContainer>
    </>
  );
};

export default LogViewer;
