/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Dashboard from "./app/dashboard/Dashboard";
import LandingPage from "./app/landing/LandingPage";
import Login from "./app/auth/Login";
import Register from "./app/auth/Register";
import RecoverPassword from "./app/auth/RecoverPassword";
import Onboarding from "./app/onboarding/Onboarding";
import RotinaSemanal from "./app/rotina/RotinaSemanal";
import HabitoDetalhe from "./app/habito/HabitoDetalhe";
import Settings from "./app/settings/Settings";
import Subscription from "./app/subscription/Subscription";
import Success from "./app/subscription/Success";
import Canceled from "./app/subscription/Canceled";
import Profile from "./app/profile/Profile";
import { PageTransition } from "@/components/effects/PageTransition";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
      <Toaster position="bottom-right" />
      <Analytics />
    </ThemeProvider>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition routeKey={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rotina" element={<RotinaSemanal />} />
            <Route path="/habito/:id" element={<HabitoDetalhe />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/planos" element={<Subscription />} />
            <Route path="/sucesso" element={<Success />} />
            <Route path="/cancelado" element={<Canceled />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}
