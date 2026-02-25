import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./AuthService.js";

const ROLE_TABS = [
  { label: "CUSTOMER", value: "CUSTOMER" },
  { label: "OWNER", value: "OWNER" },
  { label: "ADMIN", value: "ADMIN" },
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "CUSTOMER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: form.role,
      };
      const res = await loginUser(payload);
      onLogin(res.data.data);
      if (res.data?.data?.role === "OWNER") navigate("/owner/dashboard");
      else if (res.data?.data?.role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <section className="card border-0 shadow-sm auth-card">
          <div className="card-body p-4">
            <h2 className="h4 mb-1">Login</h2>
            <p className="text-secondary small mb-3">Access your RealNest account</p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="d-grid gap-3">
              <div>
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
              <div>
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  value={form.email}
                  required
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={handleChange}
                  value={form.password}
                  required
                />
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
