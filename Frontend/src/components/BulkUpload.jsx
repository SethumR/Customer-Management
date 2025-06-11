import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import { toast } from 'react-toastify';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const response = await customerService.bulkUploadCustomers(file);
      setResult(response.data);
      toast.success('Bulk upload completed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Bulk Customer Upload</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Excel File</label>
            <input
              type="file"
              className="form-control"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <div className="form-text">
              Upload an Excel file with customer data. Required columns: Name, Date of Birth, NIC
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              type="button"
              className="btn btn-secondary me-md-2"
              onClick={() => navigate('/customers')}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !file}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4">
            <h4>Upload Results</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Total Records</th>
                  <td>{result.totalRecords}</td>
                </tr>
                <tr>
                  <th>Success Count</th>
                  <td>{result.successCount}</td>
                </tr>
                <tr>
                  <th>Failure Count</th>
                  <td>{result.failureCount}</td>
                </tr>
              </tbody>
            </table>
            {result.message && (
              <div className="alert alert-info">{result.message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;