import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import HomePage from "./pages/HomePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import OwnerPropertyFormPage from "./pages/OwnerPropertyFormPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RoleRoute from "./components/RoleRoute";
import NotFoundPage from "./pages/NotFoundPage";
import { clearAuth, getStoredAuth, saveAuth } from "./auth/authStorage";

export default function App() {
  const [auth, setAuth] = useState(getStoredAuth());

  function handleLogin(authDto) {
    const payload = {
      token: authDto.token,
      userId: authDto.userId,
      name: authDto.name,
      email: authDto.email,
      role: authDto.role,
    };
    saveAuth(payload);
    setAuth(payload);
  }

  function handleLogout() {
    clearAuth();
    setAuth(null);
  }

  return (
    <BrowserRouter>
      <Layout auth={auth} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/customer/dashboard"
            element={
              <RoleRoute auth={auth} allowedRoles={["CUSTOMER"]}>
                <CustomerDashboardPage />
              </RoleRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <RoleRoute auth={auth} allowedRoles={["OWNER"]}>
                <OwnerDashboardPage />
              </RoleRoute>
            }
          />
          <Route
            path="/owner/new"
            element={
              <RoleRoute auth={auth} allowedRoles={["OWNER"]}>
                <OwnerPropertyFormPage />
              </RoleRoute>
            }
          />
          <Route
            path="/owner/properties/:id/edit"
            element={
              <RoleRoute auth={auth} allowedRoles={["OWNER"]}>
                <OwnerPropertyFormPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute auth={auth} allowedRoles={["ADMIN"]}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
