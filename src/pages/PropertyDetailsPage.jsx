import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStoredAuth } from "../auth/authStorage";
import { getCustomerProperty, getPublicProperty } from "../services/propertyService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80";

function formatPrice(price, type) {
  if (price === undefined || price === null) return "Price on request";
  const value = Number(price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return type === "RENT" ? `${value}/month` : value;
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const auth = getStoredAuth();
        const property =
          auth?.role === "CUSTOMER" ? await getCustomerProperty(id) : await getPublicProperty(id);
        if (active) setItem(property);
      } catch (e) {
        if (active) setError(e.response?.data?.message || "Unable to load property.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="alert alert-light border">Loading property details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!item) return <div className="alert alert-warning">Property not found.</div>;

  return (
    <section className="card border-0 shadow-sm overflow-hidden">
      <img className="w-100 detail-hero-image" src={item.imageUrl || FALLBACK_IMAGE} alt={item.title} />
      <div className="card-body p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
          <div>
            <h2 className="h3 mb-1">{item.title}</h2>
            <p className="text-secondary mb-0">
              {item.location}, {item.city}
            </p>
          </div>
          <div className="text-end">
            <p className="h4 text-primary fw-bold mb-1">{formatPrice(item.price, item.type)}</p>
            <span className={`badge ${item.status === "APPROVED" ? "text-bg-success" : "text-bg-warning"}`}>
              {item.status}
            </span>
          </div>
        </div>

        <hr />
        <p className="mb-3">{item.description || "No description available."}</p>

        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <div className="p-2 rounded bg-light small">
              <div className="text-secondary">Type</div>
              <div className="fw-semibold">{item.type}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded bg-light small">
              <div className="text-secondary">Owner</div>
              <div className="fw-semibold">{item.ownerName || "-"}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded bg-light small">
              <div className="text-secondary">Listed On</div>
              <div className="fw-semibold">{item.dateListed?.split("T")[0] || "-"}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded bg-light small">
              <div className="text-secondary">Property ID</div>
              <div className="fw-semibold">{item.id}</div>
            </div>
          </div>
        </div>

        <Link className="btn btn-outline-primary" to="/">
          Back to Listings
        </Link>
      </div>
    </section>
  );
}
