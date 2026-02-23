import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

function App() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    const res = await api.get("/products/");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      description: "",
      price: "",
      quantity: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      id: Number(form.id),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    if (editId) {
      await api.put(`/products/${editId}`, payload);
    } else {
      await api.post("/products/", payload);
    }

    fetchProducts();
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Sasi S & Co</h2>
        <p>Inventory System</p>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Product Management</h1>
          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Product
          </button>
        </header>

        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="price">₹{p.price}</div>
              <div className="qty">Stock: {p.quantity}</div>
              <div className="card-actions">
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              {!editId && (
                <input
                  type="number"
                  name="id"
                  placeholder="ID"
                  value={form.id}
                  onChange={handleChange}
                  required
                />
              )}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit">
                  {editId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;