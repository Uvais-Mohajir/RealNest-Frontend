import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { deleteOwnerProperty, getOwnerDashboard } from "../services/propertyService";

export default function OwnerDashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const properties = await getOwnerDashboard();
      setItems(properties);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load owner dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (!window.confirm("Delete this property?")) return;
    try {
      await deleteOwnerProperty(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "Delete failed.");
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="h4 mb-1">Owner Dashboard</h2>
          <p className="text-secondary mb-0">Manage your properties and send updates for re-approval.</p>
        </div>
        <Link to="/owner/new" className="btn btn-primary">
          Add Property
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-light border">Loading properties...</div>}
      {!loading && !items.length && <div className="alert alert-warning">No owner properties found.</div>}

      <section className="row g-3 g-md-4">
        {items.map((property) => (
          <div key={property.id} className="col-12 col-lg-6">
            <div className="position-relative">
              <PropertyCard property={property} detailPath="/properties" wrapClassName="" />
              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                <Link className="btn btn-sm btn-light border" to={`/owner/properties/${property.id}/edit`}>
                  Edit
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(property.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
