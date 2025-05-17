
import { Home, Bell, Search, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const currentPath = window.location.pathname;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white flex justify-around items-center p-3 z-10">
      <Link 
        to="/"
        className={cn(
          "flex flex-col items-center text-gray-500",
          currentPath === "/" && "text-twitter-primary"
        )}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>
      
      <Link 
        to="/explore" 
        className={cn(
          "flex flex-col items-center text-gray-500",
          currentPath === "/explore" && "text-twitter-primary"
        )}
      >
        <Search size={24} />
        <span className="text-xs">Explore</span>
      </Link>
      
      <Link 
        to="/notifications" 
        className={cn(
          "flex flex-col items-center text-gray-500",
          currentPath === "/notifications" && "text-twitter-primary"
        )}
      >
        <Bell size={24} />
        <span className="text-xs">Notifications</span>
      </Link>
      
      <Link 
        to="/messages" 
        className={cn(
          "flex flex-col items-center text-gray-500",
          currentPath === "/messages" && "text-twitter-primary"
        )}
      >
        <MessageCircle size={24} />
        <span className="text-xs">Messages</span>
      </Link>

      <Link 
        to="/profile" 
        className={cn(
          "flex flex-col items-center text-gray-500",
          currentPath === "/profile" && "text-twitter-primary"
        )}
      >
        <User size={24} />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
}

export default MobileNav;
