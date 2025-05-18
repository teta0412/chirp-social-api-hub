
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Authentication wrapper component
const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && location.pathname !== "/login") {
      navigate("/login");
    } else {
      setIsAuthenticated(!!token);
    }
  }, [location, navigate]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route
              path="/login"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to="/" replace />
                ) : (
                  <Auth />
                )
              }
            />

            {/* Protected routes */}
            <Route element={<AuthCheck><MainLayout /></AuthCheck>}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              
              <Route
                path="/notifications"
                element={
                  <div className="timeline-container p-8">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="mt-4 text-gray-500">Coming soon...</p>
                  </div>
                }
              />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
