// src/components/InventoryReport.js
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import api client

const InventoryReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []); // Dependency array rỗng, chỉ chạy một lần khi component mount

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await api.getInventoryReport();
      setReportData(response.data);
    } catch (err) {
      console.error("Error fetching inventory report:", err);
      setError("Không thể tải báo cáo tồn kho.");
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái tải hoặc lỗi
  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải báo cáo tồn kho...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo Tồn kho</h2>

      {reportData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Không có dữ liệu tồn kho để hiển thị.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Mã Kho</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Mã SP</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tên SP</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tồn kho Hiện tại</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tổng Nhập</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tổng Xuất</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.warehouse_id}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.product_id}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.product_name}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.current_stock}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.total_imports}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{row.total_exports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryReport;
