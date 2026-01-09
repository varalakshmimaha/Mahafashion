import React, { useState, useEffect } from 'react';
import { salesReportAPI } from '../services/api';

interface SalesSummary {
  total_sales: number;
  total_orders: number;
  average_order_value: number;
}

interface DailySale {
  date: string;
  sales: number;
}

interface TopSellingProduct {
  product_name: string;
  quantity_sold: number;
  revenue: number;
}

interface SalesReportData {
  summary: SalesSummary;
  daily_sales: DailySale[];
  top_selling_products: TopSellingProduct[];
}

const SalesReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await salesReportAPI.getReport();
        setReportData(data);
      } catch (err) {
        setError('Failed to fetch sales report. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading sales report...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!reportData) {
    return <div className="p-6 text-center">No sales data available.</div>;
  }

  const { summary, top_selling_products } = reportData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales Report</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-800">₹{summary.total_sales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800">{summary.total_orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-gray-800">₹{summary.average_order_value.toFixed(2)}</p>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Sales</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">Chart will be displayed here.</p>
        </div>
      </div>

      {/* Top-Selling Products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top-Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">Quantity Sold</th>
                <th className="p-4 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {top_selling_products.length > 0 ? (
                top_selling_products.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product.product_name}</td>
                    <td className="p-4">{product.quantity_sold}</td>
                    <td className="p-4">₹{product.revenue.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No top-selling products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage;