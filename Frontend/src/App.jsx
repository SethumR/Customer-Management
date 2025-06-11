import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerView from './components/CustomerView';
import BulkUpload from './components/BulkUpload';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerView />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;