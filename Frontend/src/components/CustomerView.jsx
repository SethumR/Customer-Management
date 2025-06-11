import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import customerService from '../services/customerService';
import { toast } from 'react-toastify';

const CustomerView = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await customerService.getCustomer(id);
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch customer data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!customer) {
    return <div className="alert alert-danger mt-4">Customer not found</div>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2>Customer Details</h2>
        <div>
          <Link to={`/customers/${id}/edit`} className="btn btn-warning me-2">
            Edit
          </Link>
          <Link to="/customers" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <h5>Basic Information</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{customer.name}</td>
                </tr>
                <tr>
                  <th>Date of Birth</th>
                  <td>{customer.dateOfBirth}</td>
                </tr>
                <tr>
                  <th>NIC</th>
                  <td>{customer.nic}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <h5>Mobile Numbers</h5>
            {customer.mobileNumbers.length > 0 ? (
              <ul className="list-group">
                {customer.mobileNumbers.map((number, index) => (
                  <li key={index} className="list-group-item">
                    {number}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No mobile numbers</p>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <h5>Addresses</h5>
            {customer.addresses.length > 0 ? (
              <div className="row">
                {customer.addresses.map((address, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {address.addressLine1}
                          {address.addressLine2 && (
                            <>, {address.addressLine2}</>
                          )}
                        </p>
                        <p className="card-text">
                          City ID: {address.cityId}, Country ID: {address.countryId}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No addresses</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5>Family Members</h5>
            {customer.familyMemberIds.length > 0 ? (
              <ul className="list-group">
                {customer.familyMemberIds.map((id, index) => (
                  <li key={index} className="list-group-item">
                    <Link to={`/customers/${id}`}>Customer ID: {id}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No family members</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;