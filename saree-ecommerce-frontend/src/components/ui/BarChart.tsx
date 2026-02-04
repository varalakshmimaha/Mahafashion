import React from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, options, height = 300 }) => (
  <div className="w-full">
    <Bar data={data} options={options} height={height} />
  </div>
);

export default BarChart;
