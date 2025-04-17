import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditCustomer() {
  const { id } = useParams(); // Get the customer ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    aadhaar: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    gender: '',
    password: '',
  });

  // Fetch customer data by ID
  useEffect(() => {
    fetch(`http://localhost:5000/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          customerName: data.customer_name,
          aadhaar: data.aadhaar,
          email: data.email,
          phone: data.phone,
          address1: data.address1,
          address2: data.address2,
          country: data.country,
          state: data.state,
          gender: data.gender,
          password: data.password,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      navigate('/customers'); // back to table
    } else {
      alert('Update failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input type="text" name="customerName" className="form-control" value={formData.customerName} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Aadhaar</label>
          <input type="text" name="aadhaar" className="form-control" value={formData.aadhaar} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 1</label>
          <input type="text" name="address1" className="form-control" value={formData.address1} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 2</label>
          <input type="text" name="address2" className="form-control" value={formData.address2} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input type="text" name="country" className="form-control" value={formData.country} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="text" name="password" className="form-control" value={formData.password} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-success">Update</button>
      </form>
    </div>
  );
}
