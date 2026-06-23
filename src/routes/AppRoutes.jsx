import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../Components/layout/PublicLayout";
import AdminLayout from "../Components/layout/AdminLayout";
import AuthLayout from "../Components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicAuthRoute from "./PublicRoute";

import LandingPage from "../pages/public/LandingPage";
import FlightSearchPage from "../pages/public/FlightSearchPage";
import FlightOfferPage from "../pages/public/FlightOfferPage";
import VerifyTicketPage from "../pages/public/VerifyTicketPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminFlightSearchPage from "../pages/admin/AdminFlightSearchPage";
import BookingsListPage from "../pages/admin/BookingsListPage";
import BookingCreatePage from "../pages/admin/BookingCreatePage";
import BookingDetailPage from "../pages/admin/BookingDetailPage";
import CustomersListPage from "../pages/admin/CustomersListPage";
import CustomerDetailPage from "../pages/admin/CustomerDetailPage";
import TicketDetailPage from "../pages/admin/TicketDetailPage";
import TicketPrintPage from "../pages/admin/TicketPrintPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/flights" element={<FlightSearchPage />} />
        <Route path="/flights/:offerId" element={<FlightOfferPage />} />
        <Route path="/verify-ticket" element={<VerifyTicketPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route element={<PublicAuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="flights" element={<AdminFlightSearchPage />} />
          <Route path="bookings" element={<BookingsListPage />} />
          <Route path="bookings/new" element={<BookingCreatePage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
          <Route path="customers" element={<CustomersListPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="tickets/:id/print" element={<TicketPrintPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
