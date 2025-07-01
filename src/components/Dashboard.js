// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import api from '../api'; // Import api client

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newOrders: 0,
    totalInventoryValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để memoize hàm fetchDashboardStats
  // Hàm này sẽ chỉ được tạo lại khi các setters 'setLoading', 'setStats', 'setError' thay đổi.
  // Đối tượng 'api' là một tham chiếu ổn định, nên không cần đưa vào dependency array.
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Không thể tải dữ liệu tổng quan.");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setStats, setError]); // Đã loại bỏ 'api' khỏi dependencies

  // Gọi hàm fetchDashboardStats trong useEffect
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]); // Thêm fetchDashboardStats vào dependency array của useEffect

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải dữ liệu tổng quan...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Tổng quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tổng số sản phẩm</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalProducts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Đơn hàng mới</h3>
            <p className="text-3xl font-bold text-green-600">{stats.newOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Giá trị tồn kho</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalInventoryValue.toLocaleString()} VNĐ</p>
        </div>
      </div>
      <p className="text-center text-gray-600 text-sm mt-8">
        Chào mừng bạn trở lại hệ thống quản lý kho. Sử dụng menu bên trái để điều hướng.
      </p>
    </div>
  );
};

export default Dashboard;
