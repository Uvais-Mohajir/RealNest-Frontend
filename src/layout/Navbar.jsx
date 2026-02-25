import { Link, NavLink } from "react-router-dom";

function linksByRole(role) {
  if (role === "CUSTOMER") return [{ to: "/customer/dashboard", label: "Dashboard" }];
  if (role === "OWNER") {
    return [
      { to: "/owner/dashboard", label: "Owner Dashboard" },
      { to: "/owner/new", label: "Add Property" },
    ];
  }
  if (role === "ADMIN") return [{ to: "/admin/dashboard", label: "Admin Dashboard" }];
  return [];
}

export default function Navbar({ auth, onLogout }) {
  const roleLinks = linksByRole(auth?.role);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          RealNest
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Buy/Rent
              </NavLink>
            </li>
            {roleLinks.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink className="nav-link" to={item.to}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {auth ? (
              <>
                <span className="badge rounded-pill text-bg-light border px-3 py-2">{auth.role}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-outline-primary btn-sm" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary btn-sm" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
