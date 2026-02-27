import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import "./Landing.css"; 

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/customers/?query=${search}&page=${page}`)
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, [search, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/api/customers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setShowForm(false);
      setSearch("");
      setPage(1);
      setForm({ first_name: "", last_name: "", email: "" });
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      fetch(`http://127.0.0.1:5000/api/customers/${id}`, {
        method: "DELETE",
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          setCustomers(customers.filter(c => c.customer_id !== id));
        }
      });
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: "100vh", color: "white", padding: "20px" }}>
      <div className="landing-top">
        <h1 style={{ color: "#d4af37" }}>Customer Directory</h1>
        <Link to="/" className="search-button">← Back to Home</Link>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ 
            padding: "10px", 
            width: "300px", 
            background: "#1a1a1a", 
            color: "white", 
            border: "1px solid #d4af37",
            borderRadius: "5px"
          }}
        />

        <button onClick={() => setShowForm(!showForm)} className="search-button">
          {showForm ? "Cancel" : "+ Add New Customer"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ margin: "20px 0", background: "#1a1a1a", padding: "20px", border: "1px solid #d4af37", borderRadius: "10px" }}>
          <h3 style={{ color: "#d4af37", marginTop: 0 }}>New Customer Details</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required style={inputStyle} />
            <input placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required style={inputStyle} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={inputStyle} />
          </div>
          <button type="submit" className="search-button">Save Customer</button>
        </form>
      )}

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse", color: "white" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #d4af37", color: "#d4af37" }}>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>First Name</th>
            <th style={cellStyle}>Last Name</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.customer_id} style={{ borderBottom: "1px solid #333" }}>
              <td style={cellStyle}>{c.customer_id}</td>
              <td style={cellStyle}>{c.first_name}</td>
              <td style={cellStyle}>{c.last_name}</td>
              <td style={cellStyle}>{c.email}</td>
              <td style={cellStyle}>
                <button 
                  onClick={() => handleDelete(c.customer_id)}
                  className="search-button"
                  style={{ borderColor: "#8b0000", color: "#ff4d4d", fontSize: "12px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "30px", display: "flex", alignItems: "center", gap: "20px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="search-button">Previous</button>
        <span style={{ color: "#d4af37", fontWeight: "bold" }}>Page {page}</span>
        <button onClick={() => setPage(page + 1)} className="search-button">Next</button>
      </div>
    </div>
  );
}

const cellStyle = { padding: "15px", textAlign: "left" };
const inputStyle = { padding: "10px", flex: 1, background: "#333", border: "1px solid #555", color: "white", borderRadius: "5px" };

export default CustomerPage;