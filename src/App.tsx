/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
const Dashboard = React.lazy(() => import("./app/dashboard/Dashboard"));
const LandingPage = React.lazy(() => import("./app/landing/LandingPage"));
const Login = React.lazy(() => import("./app/auth/Login"));
const Register = React.lazy(() => import("./app/auth/Register"));
const RecoverPassword = React.lazy(() => import("./app/auth/RecoverPassword"));
const ResetPassword = React.lazy(() => import("./app/auth/ResetPassword"));
const Onboarding = React.lazy(() => import("./app/onboarding/Onboarding"));
const RotinaSemanal = React.lazy(() => import("./app/rotina/RotinaSemanal"));
const HabitoDetalhe = React.lazy(() => import("./app/habito/HabitoDetalhe"));
const Settings = React.lazy(() => import("./app/settings/Settings"));
const Subscription = React.lazy(() => import("./app/subscription/Subscription"));
const Success = React.lazy(() => import("./app/subscription/Success"));
const Canceled = React.lazy(() => import("./app/subscription/Canceled"));
const Profile = React.lazy(() => import("./app/profile/Profile"));
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
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-4 border-foreground border-t-transparent animate-spin"></div></div>}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-senha" element={<RecoverPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/sucesso" element={<Success />} />
            <Route path="/cancelado" element={<Canceled />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rotina" element={<RotinaSemanal />} />
              <Route path="/habito/:id" element={<HabitoDetalhe />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/planos" element={<Subscription />} />
              <Route path="/perfil" element={<Profile />} />
            </Route>
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}
