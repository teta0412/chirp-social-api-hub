
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Twitter } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <Twitter className="h-12 w-12 text-twitter-primary mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-twitter-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Hmm...this page doesn't exist. Try searching for something else.
        </p>
        <Button asChild className="bg-twitter-primary hover:bg-twitter-secondary">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
