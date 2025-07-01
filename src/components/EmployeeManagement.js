// src/components/EmployeeManagement.js
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import api client
import EmployeeForm from './EmployeeForm'; // Import EmployeeForm

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Không thể tải danh sách nhân viên.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployeeClick = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployeeClick = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await api.deleteEmployee(id);
        setEmployees(employees.filter(e => e.id !== id));
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("Không thể xóa nhân viên. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      if (formData.id) { // Nếu có ID, đây là chỉnh sửa
        await api.updateEmployee(formData.id, formData);
      } else { // Không có ID, đây là thêm mới
        await api.addEmployee(formData);
      }
      setShowForm(false);
      setEditingEmployee(null);
      fetchEmployees(); // Tải lại danh sách sau khi lưu/cập nhật
    } catch (err) {
      console.error("Error saving employee:", err);
      setError("Không thể lưu nhân viên. Vui lòng thử lại.");
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải danh sách nhân viên...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Nhân viên</h2>

      {showForm ? (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {employees.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-600 text-lg">Không có dữ liệu nhân viên để hiển thị.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 rounded-tl-lg">Mã NV</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tên NV</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Giới tính</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Điện thoại</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Chức vụ</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Doanh thu đóng góp</th>
                    <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600 rounded-tr-lg">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{employee.id}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{employee.name}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{employee.gender}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{employee.phone}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{employee.position}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{employee.revenue_contribution.toLocaleString()} VNĐ</td>
                      <td className="py-3 px-4 border-b text-center text-sm">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                          onClick={() => handleEditEmployeeClick(employee)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 font-medium"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 text-right">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
              onClick={handleAddEmployeeClick}
            >
              Thêm Nhân viên mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeManagement;
