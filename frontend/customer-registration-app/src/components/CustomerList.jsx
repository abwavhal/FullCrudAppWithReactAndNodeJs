import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await fetch('http://localhost:5000/customers');
    const data = await res.json();
    setCustomers(data);
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`http://localhost:5000/customers/${id}`, {
        method: 'DELETE',
      });
      fetchCustomers(); // reload table
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Customer List</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Aadhaar</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.id}>
              <td>{cust.customer_name}</td>
              <td>{cust.aadhaar}</td>
              <td>{cust.email}</td>
              <td>{cust.phone}</td>
              <td>{cust.country}</td>
              <td>{cust.gender}</td>
              <td>
                <Link to={`/edit/${cust.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(cust.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
