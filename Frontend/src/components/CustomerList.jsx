import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../services/customerService';
import { toast } from 'react-toastify';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch customers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer List</h2>
        <div>
          <Link to="/customers/new" className="btn btn-primary me-2">
            Add Customer
          </Link>
          <Link to="/bulk-upload" className="btn btn-secondary">
            Bulk Upload
          </Link>
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>NIC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.dateOfBirth}</td>
              <td>{customer.nic}</td>
              <td>
                <Link
                  to={`/customers/${customer.id}`}
                  className="btn btn-info btn-sm me-2"
                >
                  View
                </Link>
                <Link
                  to={`/customers/${customer.id}/edit`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;