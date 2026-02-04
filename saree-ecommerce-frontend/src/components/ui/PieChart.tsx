import React from 'react';
import { Pie } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface PieChartProps {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, options, height = 300 }) => (
  <div className="w-full">
    <Pie data={data} options={options} height={height} />
  </div>
);

export default PieChart;
