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
import { Notifications } from "./pages/Notification";
import { NotificationProvider } from "./NotificationContext"
import { websocketService } from "./service/websocket";

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

// Add a new component to manage WebSocket connection
const WebSocketManager = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Connect to WebSocket when component mounts (user is authenticated)
    websocketService.connect();
    
    // Disconnect when component unmounts (user logs out)
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
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
            <Route element={
              <AuthCheck>
                <WebSocketManager>
                  <MainLayout />
                </WebSocketManager>
              </AuthCheck>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
