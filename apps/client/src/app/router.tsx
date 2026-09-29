import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import DashboardPage from "@/pages/DashboardPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { CreateOrganisationPage, DeleteOrganisationPage } from "@/pages/OrganisationsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/organisations/new" element={<CreateOrganisationPage />} />
        <Route path="/organisations/delete" element={<DeleteOrganisationPage />} />
      </Route>
    </Routes>
  );
}