import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TransactionForm = ({ transaction, onSave, onCancel, products, employees, suppliers, customers }) => {
  const initialState = {
    type: 'import',
    product_id: '', // Giữ nguyên tên này để khớp với `name` của select
    quantity: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    employee_id: '', // Giữ nguyên tên này để khớp với `name` của select
    supplier_id: '', // Giữ nguyên tên này để khớp với `name` của select
    customer_id: '', // Giữ nguyên tên này để khớp với `name` của select
    price: '',
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'import',
        product_id: transaction.product_id || '',
        quantity: transaction.quantity || '',
        date: transaction.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        employee_id: transaction.employee_id || '',
        supplier_id: transaction.supplier_id || '',
        customer_id: transaction.customer_id || '',
        price: transaction.price || '',
      });
    } else {
      setFormData(initialState);
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const processId = (idValue) => {
      if (idValue === '' || idValue === null || idValue === undefined) {
        return null;
      }
      return idValue;
    };

    // **** ĐIỂM SỬA ĐỔI QUAN TRỌNG: Đổi tên key sang camelCase để khớp với cách Axios đang gửi ****
    const payload = {
      type: formData.type,
      // Chuyển đổi product_id thành productId
      productId: processId(formData.product_id), 
      quantity: parseInt(formData.quantity, 10),
      date: formData.date,
      // Chuyển đổi employee_id thành employeeId
      employeeId: processId(formData.employee_id),
      // Chuyển đổi supplier_id thành supplierId và customer_id thành customerId
      supplierId: formData.type === 'import' ? processId(formData.supplier_id) : null,
      customerId: formData.type === 'export' ? processId(formData.customer_id) : null,
      price: parseFloat(formData.price),
    };

    // Loại bỏ các trường không áp dụng, giữ nguyên
    if (payload.type === 'import') {
      delete payload.customerId; // Xóa camelCase customerId
    } else if (payload.type === 'export') {
      delete payload.supplierId; // Xóa camelCase supplierId
    }

    console.log("Payload gửi đi (camelCase):", payload); 
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold">{transaction ? 'Chỉnh sửa giao dịch' : 'Tạo giao dịch mới'}</h3>

      <div>
        <label className="block text-sm">Loại giao dịch</label>
        <select name="type" value={formData.type} onChange={handleChange} className="input">
          <option value="import">Nhập kho</option>
          <option value="export">Xuất kho</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">Sản phẩm</label>
        {/* Name của select vẫn là snake_case để cập nhật đúng formData */}
        <select name="product_id" value={formData.product_id} onChange={handleChange} required className="input">
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Số lượng</label>
        <input
          type="number"
          name="quantity"
          min="1"
          required
          value={formData.quantity}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="block text-sm">Giá giao dịch (VNĐ)</label>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          required
          value={formData.price}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="block text-sm">Ngày</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="input"
        />
      </div>

      <div>
        <label className="block text-sm">Nhân viên thực hiện</label>
        {/* Name của select vẫn là snake_case để cập nhật đúng formData */}
        <select name="employee_id" value={formData.employee_id} onChange={handleChange} required className="input">
          <option value="">-- Chọn nhân viên --</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.id})
            </option>
          ))}
        </select>
      </div>

      {formData.type === 'import' && (
        <div>
          <label className="block text-sm">Nhà cung cấp</label>
          {/* Name của select vẫn là snake_case để cập nhật đúng formData */}
          <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} className="input" required>
            <option value="">-- Chọn nhà cung cấp --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id})
              </option>
            ))}
          </select>
        </div>
      )}

      {formData.type === 'export' && (
        <div>
          <label className="block text-sm">Khách hàng</label>
          {/* Name của select vẫn là snake_case để cập nhật đúng formData */}
          <select name="customer_id" value={formData.customer_id} onChange={handleChange} className="input" required>
            <option value="">-- Chọn khách hàng --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Hủy
        </button>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Lưu
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;