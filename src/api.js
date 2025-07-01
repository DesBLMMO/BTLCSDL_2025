// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Đảm bảo cổng này khớp với server mock của bạn

const api = {
  // --- Product APIs ---
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

  // --- Employee APIs ---
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

  // --- Transaction APIs ---
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
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData);
      return response;
    } catch (error) {
      console.error("API Error adding transaction:", error);
      throw error;
    }
  },
  // Lưu ý: API mock hiện tại không có updateTransaction. Nếu cần, bạn sẽ cần thêm vào server.js
  deleteTransaction: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      return response;
    } catch (error) {
      console.error("API Error deleting transaction:", error);
      throw error;
    }
  },

  // --- Supplier APIs ---
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
  deleteSupplier: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
      return response;
    } catch (error) {
      console.error("API Error deleting supplier:", error);
      throw error;
    }
  },

  // --- Report & Dashboard APIs ---
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
  }
};

export default api;
