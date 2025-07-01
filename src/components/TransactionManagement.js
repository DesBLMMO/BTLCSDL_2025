import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load all necessary data
  const fetchData = async () => {
    try {
      const [transRes, prodRes, empRes, suppRes, custRes] = await Promise.all([
        axios.get('http://localhost:8000/transactions'),
        axios.get('http://localhost:8000/products'),
        axios.get('http://localhost:8000/employees'),
        axios.get('http://localhost:8000/suppliers'),
        axios.get('http://localhost:8000/customers'),
      ]);
      setTransactions(transRes.data);
      setProducts(prodRes.data);
      setEmployees(empRes.data);
      setSuppliers(suppRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Thêm hoặc cập nhật giao dịch
  const handleSaveTransaction = async (data) => {
    try {
      if (editingTransaction) {
        await axios.put(`http://localhost:8000/transactions/${editingTransaction.id}`, data);
        alert('Cập nhật giao dịch thành công!');
      } else {
        await axios.post('http://localhost:8000/transactions', data);
        alert('Thêm giao dịch thành công!');
      }
      setModalVisible(false);
      setEditingTransaction(null);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Lỗi không xác định';
      console.error('Lỗi xử lý giao dịch:', error);
      alert(`Không thể lưu giao dịch: ${msg}`);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;
    try {
      await axios.delete(`http://localhost:8000/transactions/${id}`);
      alert('Xóa giao dịch thành công!');
      fetchData();
    } catch (err) {
      alert('Lỗi khi xóa giao dịch.');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Quản lý Giao dịch</h2>
      <button
        onClick={() => {
          setModalVisible(true);
          setEditingTransaction(null);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Thêm giao dịch
      </button>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Loại</th>
            <th className="border p-2">Sản phẩm</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Ngày</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td className="border p-2">{tx.id}</td>
              <td className="border p-2">{tx.type}</td>
              <td className="border p-2">{tx.product_id}</td>
              <td className="border p-2">{tx.quantity}</td>
              <td className="border p-2">{tx.price.toLocaleString()}</td>
              <td className="border p-2">{tx.date}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(tx)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm/sửa */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl">
            <TransactionForm
              transaction={editingTransaction}
              onSave={handleSaveTransaction}
              onCancel={() => {
                setModalVisible(false);
                setEditingTransaction(null);
              }}
              products={products}
              employees={employees}
              suppliers={suppliers}
              customers={customers}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
