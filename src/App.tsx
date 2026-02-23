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
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import AppDashboard from "./pages/AppDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PackDetail from "./pages/PackDetail";
import PackStageRedirect from "./pages/PackStageRedirect";
import PackCheckout from "./pages/PackCheckout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import Configurator from "./pages/Configurator";
import Selection from "./pages/Selection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
        <AuthProvider>
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
            <Route path="/packs/:packId/checkout" element={<PackCheckout />} />
            <Route path="/packs/:packId" element={<PackDetail />} />
            <Route path="/packs/:packId/etapa/:stageId" element={<PackStageRedirect />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/quienes-somos" element={<AboutUs />} />
            <Route path="/condiciones" element={<TermsOfService />} />
            <Route path="/configurador" element={<Configurator />} />
            <Route path="/mi-seleccion" element={<Selection />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
