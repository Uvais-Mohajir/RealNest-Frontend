import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOwnerProperty, getOwnerDashboard, updateOwnerProperty } from "../services/propertyService";

const initialForm = {
  title: "",
  description: "",
  price: "",
  type: "RENT",
  city: "",
  location: "",
  imageUrl: "",
};

export default function OwnerPropertyFormPage() {
  const { id } = useParams();
  const editing = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;

    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const items = await getOwnerDashboard();
        const found = items.find((item) => String(item.id) === String(id));
        if (!found) {
          setError("Property not found in your owner dashboard.");
          return;
        }
        if (active) {
          setForm({
            title: found.title || "",
            description: found.description || "",
            price: found.price || "",
            type: found.type || "RENT",
            city: found.city || "",
            location: found.location || "",
            imageUrl: found.imageUrl || "",
          });
        }
      } catch (e) {
        if (active) setError(e.response?.data?.message || "Unable to load property form.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [editing, id]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateOwnerProperty(id, form);
      } else {
        await createOwnerProperty(form);
      }
      navigate("/owner/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to save property.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">{editing ? "Edit Property" : "Create Property"}</h2>
          <Link to="/owner/dashboard" className="btn btn-outline-secondary btn-sm">
            Back
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="alert alert-light border">Loading form...</div>
        ) : (
          <form className="row g-3" onSubmit={onSubmit}>
            <div className="col-12">
              <label className="form-label">Title</label>
              <input
                name="title"
                className="form-control"
                value={form.title}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={onChange}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Price</label>
              <input
                name="price"
                type="number"
                min="1"
                className="form-control"
                value={form.price}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Type</label>
              <select name="type" className="form-select" value={form.type} onChange={onChange}>
                <option value="RENT">RENT</option>
                <option value="SALE">SALE</option>
              </select>
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">City</label>
              <input
                name="city"
                className="form-control"
                value={form.city}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Location</label>
              <input
                name="location"
                className="form-control"
                value={form.location}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Image URL</label>
              <input
                name="imageUrl"
                className="form-control"
                value={form.imageUrl}
                onChange={onChange}
                placeholder="https://example.com/property.jpg"
              />
              <div className="form-text">Optional. Public image URL for property preview.</div>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Property" : "Create Property"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
