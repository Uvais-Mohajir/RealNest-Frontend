import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./AuthService.js";

const ROLE_TABS = [
  { label: "CUSTOMER", value: "CUSTOMER" },
  { label: "OWNER", value: "OWNER" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await registerUser(form);
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-6">
        <section className="card border-0 shadow-sm auth-card">
          <div className="card-body p-4">
            <h2 className="h4 mb-1">Register</h2>
            <p className="text-secondary small mb-3">Create your RealNest account</p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label className="form-label">Role</label>
                <div className="row">
                  <ul className="nav navv nav-tabs">
                    {ROLE_TABS.map((tab) => (
                      <li key={tab.value} className="nav-item nav-items">
                        <button
                          type="button"
                          className={`nav-link ${form.role === tab.value ? "active" : ""}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setForm((prev) => ({ ...prev, role: tab.value }))}
                        >
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  placeholder="Alice Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="alice@realnest.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Creating..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
