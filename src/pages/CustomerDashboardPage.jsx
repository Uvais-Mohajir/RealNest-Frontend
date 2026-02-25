import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import { getCustomerDashboard } from "../services/propertyService";

const defaultFilters = {
  city: "",
  type: "",
  keyword: "",
};

export default function CustomerDashboardPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(data = filters) {
    setLoading(true);
    setError("");
    try {
      const properties = await getCustomerDashboard(data);
      setItems(properties);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load customer dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(defaultFilters);
  }, []);

  function onChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    load(filters);
  }

  function onReset() {
    setFilters(defaultFilters);
    load(defaultFilters);
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="h4 mb-1">Customer Dashboard</h2>
          <p className="text-secondary mb-0">Browse secure property feeds from `/customer/dashboard`.</p>
        </div>
      </div>

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <PropertyFilters filters={filters} onChange={onChange} onSubmit={onSubmit} onReset={onReset} />
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-light border">Loading dashboard...</div>}
      {!loading && !items.length && <div className="alert alert-warning">No properties found.</div>}

      <section className="row g-3 g-md-4">
        {items.map((property) => (
          <PropertyCard key={property.id} property={property} detailPath="/properties" />
        ))}
      </section>
    </>
  );
}
