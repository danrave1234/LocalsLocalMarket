import { Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"
import "./App.css"
import { AuthProvider } from "./auth/AuthContext.jsx"
import ProtectedRoute from "./auth/ProtectedRoute.jsx"
import EnhancedProtectedRoute from "./components/EnhancedProtectedRoute.jsx"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Breadcrumbs from "./components/Breadcrumbs.jsx"
import ErrorBoundary from "./components/ErrorBoundary.jsx"

// Route-based code splitting
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"))
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"))
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"))
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"))
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"))
const ShopPage = lazy(() => import("./pages/ShopPage.jsx"))
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"))
const DonationsPage = lazy(() => import("./pages/DonationsPage.jsx"))
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"))
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"))
const SupportPage = lazy(() => import("./pages/SupportPage.jsx"))
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"))
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"))
const CookiesPage = lazy(() => import("./pages/CookiesPage.jsx"))
const GDPRPage = lazy(() => import("./pages/GDPRPage.jsx"))
const ShopEditPage = lazy(() => import("./pages/ShopEditPage.jsx"))
const ShopCreatePage = lazy(() => import("./pages/ShopCreatePage.jsx"))
const HelpPage = lazy(() => import("./pages/HelpPage.jsx"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"))
const ProductManagementPage = lazy(() => import("./pages/ProductManagementPage.jsx"))
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.jsx"))

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Breadcrumbs />
          <ErrorBoundary>
            <Suspense fallback={<div className="page-loading">Loading...</div>}>
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/shops/create" element={
                <ProtectedRoute>
                  <ShopCreatePage />
                </ProtectedRoute>
              } />
              <Route path="/shops/:slug/edit" element={
                <ProtectedRoute>
                  <ShopEditPage />
                </ProtectedRoute>
              } />
              <Route path="/shops/:slug" element={<ShopPage />} />
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
              <Route
                path="/admin"
                element={
                  <EnhancedProtectedRoute requiredRoles={['ADMIN']}>
                    <AdminDashboard />
                  </EnhancedProtectedRoute>
                }
              />
              <Route
                path="/product-management/:shopId"
                element={
                  <ProtectedRoute>
                    <ProductManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
