import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80";

function formatPrice(price, type) {
  if (price === undefined || price === null) return "Price on request";
  const value = Number(price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return type === "RENT" ? `${value}/month` : value;
}

export default function PropertyCard({
  property,
  detailPath = "/properties",
  wrapClassName = "col-12 col-md-6 col-xl-4",
  showMeta = true,
}) {
  const card = (
    <article className="card property-card border-0 shadow-sm h-100">
      <img
        src={property.imageUrl || FALLBACK_IMAGE}
        className="card-img-top property-card-image"
        alt={property.title}
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2 align-items-start mb-2">
          <h5 className="card-title mb-0 text-truncate">{property.title}</h5>
          <span className="badge badge-soft">{property.type}</span>
        </div>
        <p className="small text-secondary mb-2">
          {property.location}, {property.city}
        </p>
        <h6 className="fw-bold text-primary mb-2">{formatPrice(property.price, property.type)}</h6>
        <p className="card-text text-secondary small flex-grow-1">
          {property.description || "No description available."}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {showMeta ? (
            <span
              className={`badge ${property.status === "APPROVED" ? "text-bg-success" : "text-bg-warning"}`}
            >
              {property.status || "APPROVED"}
            </span>
          ) : (
            <span />
          )}
          <Link to={`${detailPath}/${property.id}`} className="btn btn-sm btn-outline-primary">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );

  if (!wrapClassName) return card;
  return <div className={wrapClassName}>{card}</div>;
}
