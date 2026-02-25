import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import {
  approveProperty,
  closeProperty,
  deleteAdminProperty,
  deleteAdminUser,
  getAdminUsers,
  getClosedProperties,
  getPendingProperties,
  updateAdminUser,
} from "../services/propertyService";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [pendingProps, setPendingProps] = useState([]);
  const [closedProps, setClosedProps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [userList, pendingList, closedList] = await Promise.all([
        getAdminUsers(),
        getPendingProperties(),
        getClosedProperties(),
      ]);
      setUsers(userList);
      setPendingProps(pendingList);
      setClosedProps(closedList);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onApprove(id) {
    try {
      await approveProperty(id);
      setPendingProps((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "Approve failed.");
    }
  }

  async function onMarkClosed(propertyId) {
    const userId = window.prompt("Buyer/Tenant User ID");
    if (!userId) return;
    const status = window.prompt("Status (SOLD or TENANTED)", "SOLD");
    if (!status) return;

    try {
      const closure = await closeProperty(propertyId, { userId: Number(userId), status });
      setPendingProps((prev) => prev.filter((item) => item.id !== propertyId));
      if (closure) setClosedProps((prev) => [closure, ...prev]);
    } catch (e) {
      setError(e.response?.data?.message || "Close property failed.");
    }
  }

  async function onDeleteProperty(id) {
    if (!window.confirm("Delete this pending property?")) return;
    try {
      await deleteAdminProperty(id);
      setPendingProps((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "Delete failed.");
    }
  }

  async function onDeleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "User delete failed.");
    }
  }

  async function onEditUser(user) {
    const name = window.prompt("New name", user.name || "");
    if (name === null) return;
    const email = window.prompt("New email", user.email || "");
    if (email === null) return;
    try {
      const updated = await updateAdminUser(user.id, { name, email });
      setUsers((prev) => prev.map((item) => (item.id === user.id ? updated : item)));
    } catch (e) {
      setError(e.response?.data?.message || "User update failed.");
    }
  }

  return (
    <>
      <div className="mb-3">
        <h2 className="h4 mb-1">Admin Dashboard</h2>
        <p className="text-secondary mb-0">Moderate listings, users, and closed deals.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-light border">Loading admin data...</div>}

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <h3 className="h5 mb-3">Users</h3>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => onEditUser(user)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && !loading && (
                  <tr>
                    <td colSpan="5" className="text-secondary">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <h3 className="h5 mb-3">Pending Properties</h3>
        {!pendingProps.length && !loading && <div className="alert alert-warning">No pending properties.</div>}
        <div className="row g-3 g-md-4">
          {pendingProps.map((property) => (
            <div key={property.id} className="col-12 col-lg-6">
              <div className="position-relative">
                <PropertyCard property={property} detailPath="/properties" wrapClassName="" />
                <div className="position-absolute top-0 end-0 p-2 d-flex flex-wrap gap-2 justify-content-end">
                  <button className="btn btn-sm btn-success" onClick={() => onApprove(property.id)}>
                    Approve
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={() => onMarkClosed(property.id)}>
                    Mark Closed
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDeleteProperty(property.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <h3 className="h5 mb-3">Closed Properties</h3>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Property ID</th>
                  <th>User ID</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Closed At</th>
                </tr>
              </thead>
              <tbody>
                {closedProps.map((row) => (
                  <tr key={`${row.propertyId}-${row.closedAt}`}>
                    <td>{row.propertyId}</td>
                    <td>{row.userId}</td>
                    <td>{Number(row.price || 0).toLocaleString("en-IN")}</td>
                    <td>{row.location}</td>
                    <td>{row.status}</td>
                    <td>{row.closedAt?.split("T")[0]}</td>
                  </tr>
                ))}
                {!closedProps.length && !loading && (
                  <tr>
                    <td colSpan="6" className="text-secondary">
                      No closed properties yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
