import { Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "./auth/AuthContext.jsx"
import ProtectedRoute from "./auth/ProtectedRoute.jsx"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Breadcrumbs from "./components/Breadcrumbs.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import ShopPage from "./pages/ShopPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import DonationsPage from "./pages/DonationsPage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import ContactPage from "./pages/ContactPage.jsx"
import SupportPage from "./pages/SupportPage.jsx"
import PrivacyPage from "./pages/PrivacyPage.jsx"
import TermsPage from "./pages/TermsPage.jsx"
import CookiesPage from "./pages/CookiesPage.jsx"
import GDPRPage from "./pages/GDPRPage.jsx"
import ShopEditPage from "./pages/ShopEditPage.jsx"
import HelpPage from "./pages/HelpPage.jsx"

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shops/:id" element={<ShopPage />} />
            <Route path="/shops/:id/edit" element={
              <ProtectedRoute>
                <ShopEditPage />
              </ProtectedRoute>
            } />
            <Route path="/donate" element={<DonationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/gdpr" element={<GDPRPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
