import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
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
import Catalog from "./pages/Catalog";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import Configurator from "./pages/Configurator";
import Selection from "./pages/Selection";
import NotFound from "./pages/NotFound";
import Unsubscribe from "./pages/Unsubscribe";
import SchedulePickup from "./pages/SchedulePickup";
import { useSelectionSync } from "@/hooks/useSelectionSync";
import CookieBanner from "@/components/cookies/CookieBanner";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const queryClient = new QueryClient();

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function SelectionSyncBoot() {
  useSelectionSync();
  useReveal();
  useSmoothScroll();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
        <AuthProvider>
          <SelectionSyncBoot />
          <SentryRoutes>
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
            <Route path="/recogida/:subscriptionId" element={<SchedulePickup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </SentryRoutes>
          <CookieBanner />
        </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
