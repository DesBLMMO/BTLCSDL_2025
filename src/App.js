import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';


// Thay đổi giá trị này để kết nối với URL backend thực tế của bạn
// Khi sử dụng FastAPI, mặc định là http://localhost:8000
const API_BASE_URL = 'http://localhost:8000'; 

const api = {
  getProducts: async (searchTerm = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { search: searchTerm }
      });
      return response;
    } catch (error) {
      console.error("API Error fetching products:", error);
      throw error;
    }
  },
  addProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData);
      return response;
    } catch (error) {
      console.error("API Error adding product:", error);
      throw error;
    }
  },
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error("API Error updating product:", error);
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
      return response;
    } catch (error) {
      console.error("API Error deleting product:", error);
      throw error;
    }
  },

  getEmployees: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      return response;
    } catch (error) {
      console.error("API Error fetching employees:", error);
      throw error;
    }
  },
  addEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employees`, employeeData);
      return response;
    } catch (error) {
      console.error("API Error adding employee:", error);
      throw error;
    }
  },
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employeeData);
      return response;
    } catch (error) {
      console.error("API Error updating employee:", error);
      throw error;
    }
  },
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/employees/${id}`);
      return response;
    } catch (error) {
      console.error("API Error deleting employee:", error);
      throw error;
    }
  },

  getTransactions: async (searchTerm = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        params: { search: searchTerm }
      });
      return response;
    } catch (error) {
      console.error("API Error fetching transactions:", error);
      throw error;
    }
  },
addTransaction: async (transactionData) => {
    try {
      // transactionData bây giờ sẽ chứa các key camelCase từ TransactionForm.js (productId, employeeId, v.v.)
      // Chúng ta sẽ gửi trực tiếp đối tượng này. Axios sẽ tự động stringify nó và đặt Content-Type.
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData);
      return response;
    } catch (error) {
      console.error("API Error adding transaction:", error);
      throw error;
    }
  },
  deleteTransaction: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      return response;
    } catch (error) {
      console.error("API Error deleting transaction:", error);
      throw error;
    }
  },

  getSuppliers: async (searchTerm = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers`, {
        params: { search: searchTerm }
      });
      return response;
    } catch (error) {
      console.error("API Error fetching suppliers:", error);
      throw error;
    }
  },
  addSupplier: async (supplierData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/suppliers`, supplierData);
      return response;
    } catch (error) {
      console.error("API Error adding supplier:", error);
      throw error;
    }
  },
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/suppliers/${id}`, supplierData);
      return response;
    } catch (error) {
      console.error("API Error updating supplier:", error);
      throw error;
    }
  },
  deleteSupplier: async (id, setErrorCallback) => { 
    try {
      const response = await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
      return response;
    } catch (err) { 
        console.error("Error deleting supplier:", err);
        if (setErrorCallback) {
          setErrorCallback("Không thể xóa nhà cung cấp. Vui lòng thử lại.");
        }
      }
    }, 
  getInventoryReport: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory-report`);
      return response;
    } catch (error) {
      console.error("API Error fetching inventory report:", error);
      throw error;
    }
  },
  getRevenueReport: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/revenue-report`);
      return response;
    } catch (error) {
      console.error("API Error fetching revenue report:", error);
      throw error;
    }
  },
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard-stats`);
      return response;
    } catch (error) {
      console.error("API Error fetching dashboard stats:", error);
      throw error;
    }
  },
  // New API methods for Customers
  getCustomers: async (searchTerm = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        params: { search: searchTerm }
      });
      return response;
    } catch (error) {
      console.error("API Error fetching customers:", error);
      throw error;
    }
  },
  getCustomerOrders: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/orders`);
      return response;
    } catch (error) {
      console.error(`API Error fetching orders for customer ${customerId}:`, error);
      throw error;
    }
  }
};


// --- Components ---

// ProductForm
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    XuatXu: '',
    stock: 0, // Store as number, initialized to 0
    GiaNhap: 0, // Store as number, initialized to 0
    price: 0,   // Store as number, initialized to 0
    NgaySX: '',
    HanSD: '',
    category: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        XuatXu: product.XuatXu || '',
        // Convert to Number or default to 0 for stock, GiaNhap, price
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
        stock: 0, // Initialize as 0 for new product
        GiaNhap: 0,
        price: 0,
        NgaySX: '',
        HanSD: '',
        category: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value} = e.target;
    let newValue = value;

     
      // Important: Use 0 instead of '' if input is empty for number fields
      // This ensures that `formData.stock` (or GiaNhap/price) always holds a number
      // even if the input field is cleared.
    

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let parsedStock = parseInt(formData.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
        console.log("Invalid stock value, setting it to 0");
        parsedStock = 0; 
    }
    onSave({
      id: product ? product.id : null, // ID sẽ được backend gán cho sản phẩm mới
      ...formData,
      stock: parsedStock,
      GiaNhap: formData.GiaNhap === '' ? 0 : parseFloat(formData.GiaNhap),
      price: formData.price === '' ? 0 : parseFloat(formData.price),
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
          value= {formData.stock} // Convert number to string for display in input
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
          value={String(formData.GiaNhap)} // Convert number to string for display in input
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
          value={String(formData.price)} // Convert number to string for display in input
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


// ProductManagement (Đã cập nhật đầy đủ CRUD)
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts(searchTerm);
      setProducts(response.data);
    } catch (err) {
      console.error("API Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, setLoading, setError, setProducts]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProducts]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (formData.id) { // Nếu có ID, đây là chỉnh sửa
        await api.updateProduct(formData.id, formData);
      } else { // Không có ID, đây là thêm mới
        await api.addProduct(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts(); // Tải lại danh sách sau khi lưu/cập nhật
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
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, mã hoặc loại..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
              onClick={() => fetchProducts()}
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


// EmployeeForm (New)
const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '', // 'Nam', 'Nữ', 'Khác'
    phone: '',
    address: '',
    position: ''
  });

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
      setFormData({
        name: '',
        gender: '',
        phone: '',
        address: '',
        position: ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: employee ? employee.id : null, // ID sẽ được backend gán cho nhân viên mới
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


// EmployeeManagement
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = useCallback(async () => { 
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
  }, [api, setLoading, setError, setEmployees]); 

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); 

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


// TransactionForm (cho phiếu nhập/xuất)
const TransactionForm = ({ transaction, onSave, onCancel, products, employees, suppliers, customers }) => { // Thêm customers
    const [formData, setFormData] = useState({
        type: 'import', // 'import' or 'export'
        productId: '',
        quantity: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        employeeId: '',
        supplierId: '', // For imports
        customerId: '', // For exports
        price: '', // Giá tại thời điểm giao dịch
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: transaction.type || 'import',
                productId: transaction.productId || '',
                quantity: transaction.quantity || '',
                date: transaction.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                employeeId: transaction.employeeId || '',
                supplierId: transaction.supplierId || '',
                customerId: transaction.customerId || '',
                price: transaction.price || ''
            });
        } else {
            setFormData({
                type: 'import',
                productId: '',
                quantity: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                employeeId: '',
                supplierId: '',
                customerId: '',
                price: ''
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price),
        };

        // RẤT QUAN TRỌNG: Đặt các trường ID không liên quan thành null
        if (dataToSave.type === 'import') {
            dataToSave.customerId = null; // Giao dịch nhập không có customerId
            if (!dataToSave.supplierId) { // Nếu supplierId vẫn trống khi là import
              // Bạn có thể thêm xử lý lỗi ở đây nếu supplierId bắt buộc cho import
              // Hiện tại backend sẽ báo 404 nếu không tìm thấy, nhưng đây là kiểm tra frontend tốt
            }
        } else if (dataToSave.type === 'export') {
            dataToSave.supplierId = null; // Giao dịch xuất không có supplierId
            if (!dataToSave.customerId) { // Nếu customerId vẫn trống khi là export
              // Tương tự, có thể thêm xử lý lỗi ở đây
            }
        }

        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{transaction ? 'Chỉnh sửa Phiếu giao dịch' : 'Tạo Phiếu giao dịch Mới'}</h3>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại phiếu</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                >
                    <option value="import">Nhập kho</option>
                    <option value="export">Xuất kho</option>
                </select>
            </div>
            <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Số lượng</label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                    min="1"
                />
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá giao dịch (VNĐ)</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                    min="0"
                    step="0.01"
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Ngày</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Nhân viên thực hiện</label>
                <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                </select>
            </div>
            {formData.type === 'import' && (
                <div>
                    <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                    <select
                        id="supplierId"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        required={formData.type === 'import'} // Bắt buộc chọn nhà cung cấp khi nhập
                    >
                        <option value="">Chọn nhà cung cấp</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                    </select>
                </div>
            )}
            {formData.type === 'export' && (
                <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Khách hàng</label> {/* Thay đổi nhãn */}
                    <select // Thay đổi từ input sang select
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        required={formData.type === 'export'} // Bắt buộc chọn khách hàng khi xuất
                    >
                        <option value="">Chọn khách hàng</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
                    </select>
                </div>
            )}
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

// TransactionManagement
const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Các dữ liệu phụ thuộc cần thiết cho TransactionForm (dropdowns)
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]); // New: state for customers

  // Hàm để lấy các dữ liệu phụ thuộc từ API
  const fetchDependencies = useCallback(async () => {
    try {
      const [productsRes, employeesRes, suppliersRes, customersRes] = await Promise.all([ // Added customers
        api.getProducts(),
        api.getEmployees(),
        api.getSuppliers(),
        api.getCustomers() // Fetch customers
      ]);
      setProducts(productsRes.data);
      setEmployees(employeesRes.data);
      setSuppliers(suppliersRes.data);
      setCustomers(customersRes.data); // Set customers state
    } catch (err) {
      console.error("Error fetching dependencies for transactions:", err);
      setError("Không thể tải dữ liệu phụ thuộc.");
    }
  }, [api, setProducts, setEmployees, setSuppliers, setCustomers, setError]); 

  // Hàm để lấy danh sách giao dịch từ API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getTransactions(searchTerm);
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Không thể tải danh sách giao dịch. Vui lòng thử lại sau.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, setLoading, setError, setTransactions, api]); 

  // Lấy dữ liệu phụ thuộc khi component mount
  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  // Gọi API lấy giao dịch khi searchTerm thay đổi (với debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchTransactions]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTransactionClick = () => {
    setEditingTransaction(null); // Đặt null để form ở chế độ tạo mới
    setShowForm(true); // Hiển thị form
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu giao dịch này?')) {
      try {
        await api.deleteTransaction(id);
        setTransactions(transactions.filter(t => t.id !== id)); // Cập nhật state cục bộ
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError("Không thể xóa phiếu giao dịch. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveTransaction = async (formData) => {
    try {
      // API mock hiện tại không hỗ trợ update transaction, chỉ add mới
      // Nếu là chỉnh sửa trong tương lai, bạn sẽ cần logic để gọi api.updateTransaction
      await api.addTransaction(formData);
      setShowForm(false); // Ẩn form
      setEditingTransaction(null); // Reset trạng thái chỉnh sửa
      fetchTransactions(); // Tải lại danh sách sau khi lưu
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Không thể lưu phiếu giao dịch. Vui lòng thử lại.");
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false); // Ẩn form
    setEditingTransaction(null); // Reset trạng thái chỉnh sửa
  };

  // Hiển thị trạng thái tải hoặc lỗi
  // Chỉ hiển thị "Đang tải..." nếu đang tải và chưa có dữ liệu nào được hiển thị
  if (loading && transactions.length === 0 && !error) return <div className="p-8 text-center text-gray-700">Đang tải danh sách giao dịch...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Giao dịch (Phiếu nhập/xuất)</h2>

      {showForm ? (
        // Hiển thị TransactionForm nếu showForm là true, truyền các dữ liệu phụ thuộc
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={handleCancelEdit}
          products={products}
          employees={employees}
          suppliers={suppliers}
          customers={customers} // Pass customers to form
        />
      ) : (
        // Hiển thị bảng giao dịch và ô tìm kiếm nếu showForm là false
        <>
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phiếu, mã SP, mã NV..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
              onClick={() => fetchTransactions()}
            >
              Tìm kiếm
            </button>
          </div>

          {transactions.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-600 text-lg">Không tìm thấy phiếu giao dịch nào phù hợp.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 rounded-tl-lg">Mã Phiếu</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Loại</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Mã SP</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Số lượng</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Ngày</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Mã NV</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Nhà CC/KH</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Giá Giao dịch (VNĐ)</th>
                    <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600 rounded-tr-lg">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{transaction.id}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 'import' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {transaction.type === 'import' ? 'Nhập' : 'Xuất'}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{transaction.productId}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{transaction.quantity}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{transaction.date}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{transaction.employeeId}</td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">
                        {transaction.type === 'import' ? transaction.supplierId : transaction.customerId}
                      </td>
                      <td className="py-3 px-4 border-b text-sm text-gray-700">{transaction.price ? transaction.price.toLocaleString() : 'N/A'}</td>
                      <td className="py-3 px-4 border-b text-center text-sm">
                        {/* API mock không hỗ trợ PUT cho transaction, nên nút Sửa sẽ không có tác dụng */}
                        {/* <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          Sửa
                        </button> */}
                        <button
                          className="text-red-600 hover:text-red-900 font-medium"
                          onClick={() => handleDeleteTransaction(transaction.id)}
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
              onClick={handleAddTransactionClick}
            >
              Tạo Phiếu mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};


// SupplierForm (New)
const SupplierForm = ({ supplier, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || '',
                contactPerson: supplier.contactPerson || '',
                phone: supplier.phone || '',
                email: supplier.email || '',
                address: supplier.address || ''
            });
        } else {
            setFormData({
                name: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: ''
            });
        }
    }, [supplier]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: supplier ? supplier.id : null, // ID sẽ được backend gán cho nhà cung cấp mới
            ...formData
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{supplier ? 'Chỉnh sửa Nhà cung cấp' : 'Thêm Nhà cung cấp Mới'}</h3>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
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
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Người liên hệ</label>
                <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                />
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    required
                ></textarea>
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

// SupplierManagement
const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Sử dụng useCallback để memoize hàm fetchSuppliers
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSuppliers(searchTerm);
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Không thể tải danh sách nhà cung cấp. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, setLoading, setError, setSuppliers, api]); // api re-added

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuppliers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchSuppliers]); // Thêm fetchSuppliers vào dependency array

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
        // Truyền setError của component vào hàm API
        await api.deleteSupplier(id, setError); 
        setSuppliers(suppliers.filter(s => s.id !== id));
      } catch (err) { 
        // Lỗi đã được xử lý trong hàm api.deleteSupplier, chỉ log nếu có lỗi khác
        console.error("Error during supplier deletion process:", err);
      }
    }
  };

  const handleSaveSupplier = async (formData) => {
    try {
      if (formData.id) { // Nếu có ID, đây là chỉnh sửa
        await api.updateSupplier(formData.id, formData);
      } else { // Không có ID, đây là thêm mới
        await api.addSupplier(formData);
      }
      setShowForm(false);
      setEditingSupplier(null);
      fetchSuppliers(); // Tải lại danh sách sau khi lưu
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
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
              onClick={() => fetchSuppliers()}
            >
              Tìm kiếm
            </button>
          </div>

          {suppliers.length === 0 && !loading && !error ? (
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


// InventoryReport
const InventoryReport = ({ api }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để memoize hàm fetchReport
  const fetchReport = useCallback(async () => {
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
  }, [api, setLoading, setReportData, setError]); 

  useEffect(() => {
    fetchReport();
  }, [fetchReport]); // Thêm fetchReport vào dependency array của useEffect

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


// RevenueReport
const RevenueReport = ({ api }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để memoize hàm fetchReport
  const fetchReport = useCallback(async () => {
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
  }, [api, setLoading, setReportData, setError]); 

  useEffect(() => {
    fetchReport();
  }, [fetchReport]); // Thêm fetchReport vào dependency array của useEffect

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


// CombinedReport
const CombinedReport = ({ api }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenueLastMonth: 0,
    pendingTransactions: 0,
    topSellingProduct: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để memoize hàm fetchStats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching combined report stats:", err);
      setError("Không thể tải dữ liệu báo cáo tổng hợp.");
    } finally {
      setLoading(false);
    }
  }, [api, setLoading, setStats, setError]); 

  useEffect(() => {
    fetchStats();
  }, [fetchStats]); // Thêm fetchStats vào dependency array của useEffect

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải báo cáo tổng hợp...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo Tổng hợp & Thống kê</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-blue-800">Tổng sản phẩm</h3>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalProducts.toLocaleString()}</p>
              </div>
              <span className="text-blue-400 text-5xl">📦</span>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-green-800">Doanh thu tháng trước</h3>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalRevenueLastMonth.toLocaleString()} VNĐ</p>
              </div>
              <span className="text-green-400 text-5xl">💸</span>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Giao dịch đang chờ</h3>
                  <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pendingTransactions.toLocaleString()}</p>
              </div>
              <span className="text-yellow-400 text-5xl">⏳</span>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold text-purple-800">Sản phẩm bán chạy nhất</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.topSellingProduct}</p>
          </div>
      </div>

      <p className="text-center text-gray-600 text-sm mt-8">
        Bạn có thể điều hướng đến "Báo cáo Tồn kho" hoặc "Báo cáo Doanh thu" để xem chi tiết hơn.
      </p>
    </div>
  );
};


// Dashboard
const Dashboard = ({ api }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newOrders: 0,
    totalInventoryValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để memoize hàm fetchDashboardStats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error("API Error fetching dashboard stats:", err);
      setError("Không thể tải dữ liệu tổng quan.");
    } finally {
      setLoading(false);
    }
  }, [api, setLoading, setStats, setError]); 

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

// CustomerManagement Component
const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCustomers(searchTerm);
      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Không thể tải danh sách khách hàng. Vui lòng thử lại sau.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [api, searchTerm]); 

  const fetchCustomerOrders = useCallback(async (customerId) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const response = await api.getCustomerOrders(customerId);
      setSelectedCustomerOrders(response.data);
    } catch (err) {
      console.error(`Error fetching orders for customer ${customerId}:`, err);
      setOrdersError("Không thể tải đơn đặt hàng cho khách hàng này. Vui lòng thử lại.");
      setSelectedCustomerOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [api]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchCustomers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedCustomerId(null); // Clear selected customer when searching
    setSelectedCustomerOrders([]);
  };

  const handleViewOrders = (customerId) => {
    setSelectedCustomerId(customerId);
    fetchCustomerOrders(customerId);
  };

  const handleClearSelectedCustomer = () => {
    setSelectedCustomerId(null);
    setSelectedCustomerOrders([]);
  };

  if (loading) return <div className="p-8 text-center text-gray-700">Đang tải danh sách khách hàng...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Lỗi: {error}</div>;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Khách hàng</h2>

      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng theo tên, số điện thoại..."
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
          onClick={() => fetchCustomers()}
        >
          Tìm kiếm
        </button>
      </div>

      {customers.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-600 text-lg">Không tìm thấy khách hàng nào phù hợp.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mb-8">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Mã KH</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tên KH</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Điện thoại</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Địa chỉ</th>
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{customer.id}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{customer.name}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{customer.phone}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{customer.address}</td>
                  <td className="py-3 px-4 border-b text-center text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-900 font-medium"
                      onClick={() => handleViewOrders(customer.id)}
                    >
                      Xem đơn đặt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCustomerId && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            Đơn đặt hàng của Khách hàng: {selectedCustomer ? selectedCustomer.name : selectedCustomerId}
            <button
              className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-lg shadow-md transition duration-300 text-sm"
              onClick={handleClearSelectedCustomer}
            >
              Ẩn đơn đặt
            </button>
          </h3>
          {ordersLoading ? (
            <div className="text-center text-gray-700">Đang tải đơn đặt hàng...</div>
          ) : ordersError ? (
            <div className="text-red-600 text-center">Lỗi: {ordersError}</div>
          ) : selectedCustomerOrders.length === 0 ? (
            <p className="text-center text-gray-600">Không có đơn đặt hàng nào cho khách hàng này.</p>
          ) : (
            <div className="overflow-x-auto border border-blue-200 rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-blue-700">Mã Đơn</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-blue-700">Mã SP</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-blue-700">Số lượng</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-blue-700">Giá trị</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-blue-700">Ngày đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomerOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{order.id}</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{order.productId}</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{order.quantity}</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{order.totalAmount.toLocaleString()} VNĐ</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// App component chính
function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar (menu bên trái) */}
        <div className="w-64 bg-gray-800 text-gray-200 p-4 shadow-lg flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-6">WMS</h1>
          <nav className="flex-1">
            <ul>
              <li className="mb-2">
                <Link to="/" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">📊</span> Tổng quan
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/san-pham" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">📦</span> Sản phẩm
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/nhan-vien" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">👨‍💼</span> Nhân viên
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/giao-dich" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">📝</span> Giao dịch
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/nha-cung-cap" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">🚚</span> Nhà cung cấp
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/khach-hang" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">👤</span> Khách hàng
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/bo-phan-ql" className="flex items-center py-2 px-3 text-gray-200 hover:bg-gray-700 rounded-md transition duration-150">
                  <span className="mr-3">🏢</span> Bộ phận QL
                </Link>
              </li>
              <li className="mb-2">
                <span className="block py-2 px-3 font-semibold text-gray-200 mt-4 border-t border-gray-700 pt-4">Báo cáo</span>
                <ul className="ml-4">
                  <li className="mb-1">
                    <Link to="/bao-cao-ton-kho" className="block py-1 px-3 text-gray-300 hover:bg-gray-700 rounded-md transition duration-150">
                      <span className="mr-2">📈</span> Báo cáo Tồn kho
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/bao-cao-doanh-thu" className="block py-1 px-3 text-gray-300 hover:bg-gray-700 rounded-md transition duration-150">
                      <span className="mr-2">💸</span> Báo cáo Doanh thu
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/bao-cao-tong-hop" className="block py-1 px-3 text-gray-300 hover:bg-gray-700 rounded-md transition duration-150">
                      <span className="mr-2">📊</span> Báo cáo Tổng hợp
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          {/* Footer hoặc thông tin người dùng có thể ở đây */}
          <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
            <p>Admin User</p>
            <p>Version 1.0</p>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard api={api} />} />
            <Route path="/san-pham" element={<ProductManagement />} />
            <Route path="/nhan-vien" element={<EmployeeManagement />} />
            <Route path="/giao-dich" element={<TransactionManagement />} />
            <Route path="/nha-cung-cap" element={<SupplierManagement />} />
            <Route path="/khach-hang" element={<CustomerManagement />} />
            <Route path="/bo-phan-ql" element={<div className="p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto my-8 text-xl text-gray-800">Trang Bộ phận QL đang được phát triển...</div>} />
            <Route path="/bao-cao-ton-kho" element={<InventoryReport api={api} />} />
            <Route path="/bao-cao-doanh-thu" element={<RevenueReport api={api} />} />
            <Route path="/bao-cao-tong-hop" element={<CombinedReport api={api} />} />
            <Route path="*" element={<div className="p-8 text-red-600 text-center text-2xl font-bold">Trang không tìm thấy (404)</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
