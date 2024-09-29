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

const LogViewer = () => {
  const [logs, setLogs] = useState([]); // Store log entries
  const [expandedRow, setExpandedRow] = useState(null); // Manage expanded rows
  const [start, setStart] = useState(0); // Byte start position for range requests
  const chunkSize = 10000; // Fetch 64KB chunks at a time
  const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

  const endOfLogRef = useRef(null); // Ref for the loading element
  const [loading, setLoading] = useState(false); // Loading state
  // const [endOfData, setEndOfData] = useState(false); // Track if we have reached the end of data

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

    // if (newLogs.length < chunkSize) {
    //   console.log("end of data", newLogs.length, chunkSize);
    //   setEndOfData(true); // If fewer logs than requested, we reached the end
    // }

    setLogs((prevLogs) => [...prevLogs, ...newLogs]);
  };

  const fetchLogChunk = async (url, start, end) => {
    const response = await fetch(url, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });
    const text = await response.text();
    return text;
  };

  const fetchLogs = useCallback(async () => {
    // if (loading || endOfData) return; // Prevent fetch if already loading or end of data is reached
    if (loading) return; // Prevent fetch if already loading or end of data is reached

    setLoading(true); // Start loading
    const newChunk = await fetchLogChunk(url, start, start + chunkSize);
    console.log("newChunk", newChunk.length);
    parseNDJSON(newChunk);
    setStart((prev) => prev + chunkSize);
    setLoading(false); // End loading
  }, [url, start, loading]);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchLogs(); // Fetch more logs when the loading element is visible and conditions are met
      }
    });

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
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <LogViewerContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Time</TableHeader>
            <TableHeader>Event</TableHeader>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <LogRow key={index} onClick={() => toggleRow(index)}>
              <TableCell>
                <Chevron expanded={expandedRow === index}>›</Chevron>
                {new Date(log._time).toISOString()}
              </TableCell>
              <TableCell>
                {expandedRow === index ? (
                  <pre>{JSON.stringify(log, null, 2)}</pre>
                ) : (
                  <span>{JSON.stringify(log)}</span>
                )}
              </TableCell>
            </LogRow>
          ))}
        </tbody>
      </StyledTable>
      {loading && <LoadingIndicator>Loading more logs...</LoadingIndicator>}{" "}
      <div ref={endOfLogRef} /> {/* Ref for Intersection Observer */}
    </LogViewerContainer>
  );
};

export default LogViewer;
