import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-5 fw-bold mb-2">404</h1>
      <p className="text-secondary mb-3">Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}
