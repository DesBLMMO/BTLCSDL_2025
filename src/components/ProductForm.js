import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    XuatXu: '',
    stock: 0, // Lưu trữ dưới dạng số, khởi tạo là 0
    GiaNhap: 0, // Lưu trữ dưới dạng số, khởi tạo là 0
    price: 0,   // Lưu trữ dưới dạng số, khởi tạo là 0
    NgaySX: '',
    HanSD: '',
    category: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        XuatXu: product.XuatXu || '',
        // Chuyển đổi sang Number hoặc mặc định là 0 cho stock, GiaNhap, price
        stock: Number(product.stock) || 0, 
        GiaNhap: Number(product.GiaNhap) || 0, 
        price: Number(product.price) || 0,     
        NgaySX: product.NgaySX ? format(new Date(product.NgaySX), 'yyyy-MM-dd') : '',
        HanSD: product.HanSD ? format(new Date(product.HanSD), 'yyyy-MM-dd') : '',
        category: product.category || '',
      });
    } else {
      setFormData({
        name: '',
        XuatXu: '',
        stock: 0, // Khởi tạo là 0 cho sản phẩm mới
        GiaNhap: 0,
        price: 0,
        NgaySX: '',
        HanSD: '',
        category: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    // Xử lý đúng các input số: chuyển đổi sang float hoặc 0 nếu trống
    if (type === 'number') {
      newValue = value === '' ? 0 : parseFloat(value); 
      // Quan trọng: Sử dụng 0 thay vì '' nếu input trống cho các trường số
      // Điều này đảm bảo rằng `formData.stock` (hoặc GiaNhap/price) luôn giữ một giá trị số
      // ngay cả khi trường input bị xóa.
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Không cần parseInt/parseFloat ở đây nếu handleChange đã đảm bảo kiểu số
    onSave({
      id: product ? product.id : null, // ID sẽ được backend gán cho sản phẩm mới
      ...formData,
      // Các giá trị đã là số do handleChange đã được cập nhật.
      // Chúng ta có thể loại bỏ việc phân tích cú pháp trùng lặp ở đây.
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{product ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Loại sản phẩm</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="XuatXu" className="block text-sm font-medium text-gray-700">Xuất xứ</label>
        <input
          type="text"
          id="XuatXu"
          name="XuatXu"
          value={formData.XuatXu}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Số lượng</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={String(formData.stock)} // Chuyển đổi số sang chuỗi để hiển thị trong input
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="GiaNhap" className="block text-sm font-medium text-gray-700">Giá nhập</label>
        <input
          type="number"
          id="GiaNhap"
          name="GiaNhap"
          value={String(formData.GiaNhap)} // Chuyển đổi số sang chuỗi để hiển thị trong input
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          step="0.01"
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá bán</label>
        <input
          type="number"
          id="price"
          name="price"
          value={String(formData.price)} // Chuyển đổi số sang chuỗi để hiển thị trong input
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          step="0.01"
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="NgaySX" className="block text-sm font-medium text-gray-700">Ngày sản xuất</label>
        <input
          type="date"
          id="NgaySX"
          name="NgaySX"
          value={formData.NgaySX}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="HanSD" className="block text-sm font-medium text-gray-700">Hạn sử dụng</label>
        <input
          type="date"
          id="HanSD"
          name="HanSD"
          value={formData.HanSD}
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

export default ProductForm;
