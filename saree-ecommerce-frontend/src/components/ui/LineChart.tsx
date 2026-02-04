import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, options, height = 300 }) => (
  <div className="w-full">
    <Line data={data} options={options} height={height} />
  </div>
);

export default LineChart;
