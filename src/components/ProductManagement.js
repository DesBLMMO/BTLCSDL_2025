import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ useCallback giúp ổn định tham chiếu hàm
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts(searchTerm);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // ✅ useEffect dùng fetchProducts đúng cách
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (formData.id) {
        await api.updateProduct(formData.id, formData);
      } else {
        await api.addProduct(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Không thể lưu sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải danh sách sản phẩm...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Sản phẩm</h2>

      {showForm ? (
        <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCancelEdit} />
      ) : (
        <>
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, mã hoặc loại..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
              onClick={fetchProducts}
            >
              Tìm kiếm
            </button>
          </div>

          {products.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-600 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 rounded-tl-lg">Mã SP</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tên SP</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Loại</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Giá (VNĐ)</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tồn kho</th>
                    <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600 rounded-tr-lg">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{product.id}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{product.name}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{product.category}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{product.price.toLocaleString()}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{product.stock}</td>
                      <td className="py-3 px-4 border-b text-center text-sm">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                          onClick={() => handleEditProductClick(product)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 font-medium"
                          onClick={() => handleDeleteProduct(product.id)}
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
              onClick={handleAddProductClick}
            >
              Thêm Sản phẩm mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManagement;
