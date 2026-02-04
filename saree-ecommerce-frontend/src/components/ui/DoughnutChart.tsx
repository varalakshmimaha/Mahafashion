import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  height?: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options, height = 300 }) => (
  <div className="w-full">
    <Doughnut data={data} options={options} height={height} />
  </div>
);

export default DoughnutChart;
