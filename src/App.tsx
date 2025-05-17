
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-primary"></div>
      </div>
    );
  }

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
                isAuthenticated ? <Navigate to="/" replace /> : <Auth />
              }
            />

            {/* Protected routes */}
            {isAuthenticated ? (
              <>
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  }
                />
                {/* Placeholder routes - we'll implement these later */}
                <Route
                  path="/explore"
                  element={
                    <MainLayout>
                      <div className="timeline-container p-8">
                        <h1 className="text-2xl font-bold">Explore</h1>
                        <p className="mt-4 text-gray-500">Coming soon...</p>
                      </div>
                    </MainLayout>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <MainLayout>
                      <div className="timeline-container p-8">
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="mt-4 text-gray-500">Coming soon...</p>
                      </div>
                    </MainLayout>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <MainLayout>
                      <div className="timeline-container p-8">
                        <h1 className="text-2xl font-bold">Messages</h1>
                        <p className="mt-4 text-gray-500">Coming soon...</p>
                      </div>
                    </MainLayout>
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    <MainLayout>
                      <div className="timeline-container p-8">
                        <h1 className="text-2xl font-bold">Bookmarks</h1>
                        <p className="mt-4 text-gray-500">Coming soon...</p>
                      </div>
                    </MainLayout>
                  }
                />
              </>
            ) : (
              // Redirect all protected routes to login when not authenticated
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
