import React from "react";
import { groupLogsByDateAndHour } from "./utils/index";

export const TimelineChartSVG = ({ data }) => {
  const groupedData = groupLogsByDateAndHour(data);
  const maxCount = Math.max(...groupedData.map(d => d.count), 0); // Handle case where groupedData might be empty

  const baseWidth = 600; 
  const minBarWidth = 65; 
  const chartHeight = 200;

  const chartWidth = Math.max(baseWidth, Math.min(groupedData.length * minBarWidth, baseWidth * 2));

  const barWidth = Math.max(minBarWidth, chartWidth / groupedData.length); 
  const yAxisTicks = 5; // Number of ticks on the Y-axis
  const tickSpacing = chartHeight / yAxisTicks; // Spacing between Y-axis ticks

  return (
    <svg 
      width={chartWidth + 50} 
      height={chartHeight + 50} 
      role="img" 
      aria-labelledby="chartTitle chartDesc" 
      tabIndex="0"
    >
      <title id="chartTitle">Logs Timeline Chart</title>
      <desc id="chartDesc">A bar chart representing logs grouped by date and hour. Each bar shows the count of logs for a specific hour.</desc>

      {groupedData.length === 0 ? (
        <text
          x={chartWidth / 2 + 50} // Center the text horizontally
          y={chartHeight / 2 + 25} // Center the text vertically
          textAnchor="middle"
          fontSize="16px"
          fill="#777"
        >
          No data to show
        </text>
      ) : (
        <>
          {/* Bars */}
          {groupedData.map((d, i) => {
            const barHeight = (d.count / maxCount) * chartHeight;
            return (
              <rect
                key={i}
                x={i * barWidth + 50} // Adjust x to account for Y-axis
                y={chartHeight - barHeight}
                width={barWidth - 2} // Add spacing between bars
                height={barHeight}
                fill="#4A90E2"
                aria-label={`${d.date} ${d.hour}:00 - ${d.count} logs`}
              />
            );
          })}

          {/* X-axis labels */}
          {groupedData.map((d, i) => (
            <text
              key={i}
              x={i * barWidth + barWidth / 2 + 50} // Adjust x to account for Y-axis
              y={chartHeight + 20} // Position of x-axis labels
              textAnchor="middle"
              fontSize="10px"
              fill="#333"
            >
              {`${d.date} ${d.hour}:00`} {/* Display date and hour */}
            </text>
          ))}

          {/* Y-axis ticks and labels */}
          {[...Array(yAxisTicks + 1)].map((_, i) => {
            const value = Math.round((maxCount / yAxisTicks) * i); // Calculate tick value
            return (
              <g key={i}>
                {/* Y-axis ticks */}
                <line
                  x1="45"
                  y1={chartHeight - i * tickSpacing}
                  x2="50"
                  y2={chartHeight - i * tickSpacing}
                  stroke="black"
                />
                {/* Y-axis labels */}
                <text
                  x="40"
                  y={chartHeight - i * tickSpacing + 4}
                  textAnchor="end"
                  fontSize="12px"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <text
            x="20"
            y={chartHeight / 2}
            textAnchor="middle"
            fontSize="12px"
            transform={`rotate(-90, 20, ${chartHeight / 2})`} // Rotate for vertical label
          >
            Logs Count
          </text>
        </>
      )}
    </svg>
  );
};

export default TimelineChartSVG;
