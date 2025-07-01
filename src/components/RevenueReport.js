// src/components/RevenueReport.js
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import api client

const RevenueReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.getRevenueReport();
        setReportData(response.data);
      } catch (err) {
        console.error("Error fetching revenue report:", err);
        setError("Không thể tải báo cáo doanh thu.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải báo cáo doanh thu...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo Doanh thu theo tháng</h2>

      {reportData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Không có dữ liệu doanh thu để hiển thị.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 rounded-tl-lg">Tháng</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 rounded-tr-lg">Tổng Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.month}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.total_revenue.toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;
