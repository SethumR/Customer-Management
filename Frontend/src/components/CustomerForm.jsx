import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import customerService from '../services/customerService';
import { toast } from 'react-toastify';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [customer, setCustomer] = useState({
    name: '',
    dateOfBirth: new Date(),
    nic: '',
    mobileNumbers: [],
    addresses: [],
    familyMemberIds: [],
  });

  const [newMobile, setNewMobile] = useState('');
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    cityId: '',
    countryId: '',
  });
  const [newFamilyMemberId, setNewFamilyMemberId] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await customerService.getCustomer(id);
      setCustomer({
        ...response.data,
        dateOfBirth: new Date(response.data.dateOfBirth),
      });
    } catch (error) {
      toast.error('Failed to fetch customer data');
      navigate('/customers');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleDateChange = (date) => {
    setCustomer({ ...customer, dateOfBirth: date });
  };

  const handleAddMobile = () => {
    if (newMobile.trim()) {
      setCustomer({
        ...customer,
        mobileNumbers: [...customer.mobileNumbers, newMobile.trim()],
      });
      setNewMobile('');
    }
  };

  const handleRemoveMobile = (index) => {
    const updatedMobiles = [...customer.mobileNumbers];
    updatedMobiles.splice(index, 1);
    setCustomer({ ...customer, mobileNumbers: updatedMobiles });
  };

  const handleAddAddress = () => {
    if (newAddress.addressLine1.trim()) {
      setCustomer({
        ...customer,
        addresses: [...customer.addresses, { ...newAddress }],
      });
      setNewAddress({
        addressLine1: '',
        addressLine2: '',
        cityId: '',
        countryId: '',
      });
    }
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = [...customer.addresses];
    updatedAddresses.splice(index, 1);
    setCustomer({ ...customer, addresses: updatedAddresses });
  };

  const handleAddFamilyMember = () => {
    if (newFamilyMemberId.trim()) {
      setCustomer({
        ...customer,
        familyMemberIds: [...customer.familyMemberIds, parseInt(newFamilyMemberId)],
      });
      setNewFamilyMemberId('');
    }
  };

  const handleRemoveFamilyMember = (index) => {
    const updatedFamilyMembers = [...customer.familyMemberIds];
    updatedFamilyMembers.splice(index, 1);
    setCustomer({ ...customer, familyMemberIds: updatedFamilyMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...customer,
        dateOfBirth: customer.dateOfBirth.toISOString().split('T')[0],
      };

      if (isEditMode) {
        await customerService.updateCustomer(id, customerData);
        toast.success('Customer updated successfully');
      } else {
        await customerService.createCustomer(customerData);
        toast.success('Customer created successfully');
      }
      navigate('/customers');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save customer'
      );
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={customer.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Birth *</label>
            <DatePicker
              selected={customer.dateOfBirth}
              onChange={handleDateChange}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">NIC *</label>
            <input
              type="text"
              className="form-control"
              name="nic"
              value={customer.nic}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Numbers</label>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={newMobile}
                onChange={(e) => setNewMobile(e.target.value)}
                placeholder="Enter mobile number"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleAddMobile}
              >
                Add
              </button>
            </div>
            {customer.mobileNumbers.length > 0 && (
              <ul className="list-group">
                {customer.mobileNumbers.map((number, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {number}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveMobile(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Addresses</label>
            <div className="card mb-3">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Address Line 1</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country ID</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newAddress.countryId}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          countryId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City ID</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newAddress.cityId}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          cityId: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary mt-3"
                  onClick={handleAddAddress}
                >
                  Add Address
                </button>
              </div>
            </div>
            {customer.addresses.length > 0 && (
              <div className="list-group">
                {customer.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <div>
                        <p className="mb-1">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <small>
                          City ID: {address.cityId}, Country ID: {address.countryId}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Family Members</label>
            <div className="input-group mb-2">
              <input
                type="number"
                className="form-control"
                value={newFamilyMemberId}
                onChange={(e) => setNewFamilyMemberId(e.target.value)}
                placeholder="Enter family member ID"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleAddFamilyMember}
              >
                Add
              </button>
            </div>
            {customer.familyMemberIds.length > 0 && (
              <ul className="list-group">
                {customer.familyMemberIds.map((id, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {id}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveFamilyMember(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              type="button"
              className="btn btn-secondary me-md-2"
              onClick={() => navigate('/customers')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;