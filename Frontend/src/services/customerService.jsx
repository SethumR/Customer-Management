import axios from 'axios';

const API_URL = 'http://localhost:8080/api/customers';

const getAllCustomers = () => {
  return axios.get(API_URL);
};

const getCustomer = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createCustomer = (customerData) => {
  return axios.post(API_URL, customerData);
};

const updateCustomer = (id, customerData) => {
  return axios.put(`${API_URL}/${id}`, customerData);
};

const deleteCustomer = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const bulkUploadCustomers = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/bulk-upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkUploadCustomers,
};