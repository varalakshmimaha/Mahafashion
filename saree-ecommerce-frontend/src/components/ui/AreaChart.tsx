import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface AreaChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  height?: number;
}

// Area chart is a line chart with fill
const AreaChart: React.FC<AreaChartProps> = ({ data, options, height = 300 }) => {
  const areaOptions: ChartOptions<'line'> = {
    ...options,
    elements: {
      line: { fill: true },
      ...(options?.elements || {}),
    },
  };
  return (
    <div className="w-full">
      <Line data={data} options={areaOptions} height={height} />
    </div>
  );
};

export default AreaChart;
