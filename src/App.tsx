import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminRoute } from "@/components/auth/AdminRoute";
import Index from "./pages/Index";

// Lazy-loaded routes — split into separate chunks to reduce initial bundle
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const AppDashboard = lazy(() => import("./pages/AppDashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Catalog = lazy(() => import("./pages/Catalog"));
const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const Settings = lazy(() => import("./pages/Settings"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Configurator = lazy(() => import("./pages/Configurator"));
const Selection = lazy(() => import("./pages/Selection"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
        <AuthProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute skipOnboardingCheck>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="/packs/:packId/checkout" element={<Navigate to="/configurador" replace />} />
            <Route path="/packs/:packId" element={<Navigate to="/configurador" replace />} />
            <Route path="/packs/:packId/etapa/:stageId" element={<Navigate to="/configurador" replace />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/quienes-somos" element={<AboutUs />} />
            <Route path="/condiciones" element={<TermsOfService />} />
            <Route path="/configurador" element={<Configurator />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/mi-seleccion" element={<Selection />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
