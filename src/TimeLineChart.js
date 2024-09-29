import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { groupLogsByHour } from "./utils/index";

export const TimelineChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const options = {
      title: {
        text: "Timeline Component",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        axisLabel: {
          formatter: (value) => new Date(value).toLocaleTimeString(),
        },
      },
      yAxis: {
        type: "value",
        name: "Event Count",
      },
      series: [
        {
          type: "bar",
          data: groupLogsByHour(data).map((d) => [
            new Date(d.time).getTime(),
            d.count,
          ]),
          barWidth: "60%",
          emphasis: {
            focus: "series", // Improves accessibility when elements are focused
          },
        },
      ],
    };

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  return (
    <div
      role="img"
      aria-labelledby="Timeline Chart"
      aria-describedby="This chart shows you events logged over time"
      ref={chartRef}
      style={{ width: "100%", height: "200px" }}
      tabIndex={0}
    >
      <h2 id="chartTitle" style={{ display: "none" }}>
        Timeline Component
      </h2>
      <p id="chartDescription" style={{ display: "none" }}>
        This chart displays log events grouped by hour.
      </p>
      <p id="chartTooltip" style={{ display: "none" }}>
        Hover over the bars to see event counts at specific times.
      </p>
    </div>
  );
};

export default TimelineChart;
