import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, auth, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar auth={auth} onLogout={onLogout} />
      <main className="container py-4 py-md-5">{children}</main>
      <Footer />
    </div>
  );
}
