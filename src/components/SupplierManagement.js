import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import SupplierForm from './SupplierForm';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // ✅ Dùng useCallback để ổn định tham chiếu
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSuppliers(searchTerm);
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Không thể tải danh sách nhà cung cấp. Vui lòng thử lại sau.");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuppliers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchSuppliers]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddSupplierClick = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplierClick = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      try {
        await api.deleteSupplier(id);
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error("Error deleting supplier:", err);
        setError("Không thể xóa nhà cung cấp. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveSupplier = async (formData) => {
    try {
      if (formData.id) {
        await api.updateSupplier(formData.id, formData);
      } else {
        await api.addSupplier(formData);
      }
      setShowForm(false);
      setEditingSupplier(null);
      fetchSuppliers(); // Là useCallback nên gọi lại được an toàn
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError("Không thể lưu nhà cung cấp. Vui lòng thử lại.");
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải danh sách nhà cung cấp...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Nhà cung cấp</h2>

      {showForm ? (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm nhà cung cấp theo tên..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
              onClick={fetchSuppliers}
            >
              Tìm kiếm
            </button>
          </div>

          {suppliers.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Không tìm thấy nhà cung cấp nào phù hợp.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 rounded-tl-lg">Mã NCC</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tên NCC</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Người LH</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Điện thoại</th>
                    <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600 rounded-tr-lg">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{supplier.id}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{supplier.name}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{supplier.contactPerson}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{supplier.phone}</td>
                      <td className="py-3 px-4 border-b text-center text-sm">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                          onClick={() => handleEditSupplierClick(supplier)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 font-medium"
                          onClick={() => handleDeleteSupplier(supplier.id)}
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
              onClick={handleAddSupplierClick}
            >
              Thêm Nhà cung cấp mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SupplierManagement;
