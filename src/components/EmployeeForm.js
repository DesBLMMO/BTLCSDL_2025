// src/components/EmployeeForm.js
import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', // Tên nhân viên
    gender: '', // Giới tính: 'Nam', 'Nữ', 'Khác'
    phone: '', // Số điện thoại
    address: '', // Địa chỉ
    position: '' // Chức vụ
  });

  // Cập nhật form data khi prop 'employee' thay đổi (khi chỉnh sửa nhân viên hiện có)
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        gender: employee.gender || '',
        phone: employee.phone || '',
        address: employee.address || '',
        position: employee.position || ''
      });
    } else {
      // Reset form cho trường hợp thêm nhân viên mới
      setFormData({
        name: '',
        gender: '',
        phone: '',
        address: '',
        position: ''
      });
    }
  }, [employee]);

  // Xử lý thay đổi input của form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: employee ? employee.id : null, // Gửi ID nếu đang chỉnh sửa, null nếu là nhân viên mới (backend sẽ tạo ID)
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{employee ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên Mới'}</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên nhân viên</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Điện thoại</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Chức vụ</label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
