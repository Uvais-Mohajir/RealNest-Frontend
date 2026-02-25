import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import { getPublicProperties } from "../services/propertyService";

const defaultFilters = {
  city: "",
  type: "",
  keyword: "",
};

export default function HomePage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(data = filters) {
    setLoading(true);
    setError("");
    try {
      const properties = await getPublicProperties(data);
      setItems(properties);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load properties.");
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
      <section className="hero-banner rounded-4 p-4 p-md-5 mb-4 text-white">
        <p className="text-uppercase fw-semibold small mb-2 letter-spaced">RealNest Listings</p>
        <h1 className="display-6 fw-bold mb-2">Find homes to rent and buy</h1>
        <p className="mb-0 col-lg-7">
          Browse verified listings from your live RealNest backend with fast filters and mobile-first cards.
        </p>
      </section>

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <PropertyFilters filters={filters} onChange={onChange} onSubmit={onSubmit} onReset={onReset} />
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-light border">Loading properties...</div>}
      {!loading && !items.length && <div className="alert alert-warning">No properties found.</div>}

      <section className="row g-3 g-md-4">
        {items.map((property) => (
          <PropertyCard key={property.id} property={property} detailPath="/properties" />
        ))}
      </section>
    </>
  );
}
