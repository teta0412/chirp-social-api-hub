
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to home or login page based on authentication status
  const token = localStorage.getItem("token");
  
  // Auto-login for demo purposes (remove in production)
  useEffect(() => {
    if (!token) {
      // Set mock data for demo purposes
      const mockUser = {
        id: 1,
        email: "user@example.com",
        fullName: "Demo User",
        username: "demouser",
        avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop",
        followersCount: 128,
        followingCount: 97,
        tweetCount: 24
      };
      
      localStorage.setItem("token", "mock-token-for-demo");
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      // Force a reload to update auth state in App.tsx
      window.location.href = "/";
    }
  }, [token]);

  return <Navigate to={token ? "/" : "/login"} replace />;
};

export default Index;
