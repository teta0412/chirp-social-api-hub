
import { cn } from "@/lib/utils";
import { 
  Home, 
  Bell,
  Bookmark,
  User,
  Search,
  MessageCircle,
  Twitter,
  MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
};

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to} className={cn("sidebar-item", active && "active")}>
      <Icon size={24} />
      <span>{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const currentPath = window.location.pathname;
  
  return (
    <div className="hidden md:flex flex-col h-screen p-4 sticky top-0 w-64">
      <div className="flex flex-col flex-1 gap-2">
        <Link to="/" className="p-3">
          <Twitter size={30} className="text-twitter-primary" />
        </Link>

        <nav className="mt-4 space-y-2">
          <SidebarItem 
            icon={Home} 
            label="Home" 
            to="/"
            active={currentPath === '/'}
          />
          <SidebarItem 
            icon={Search} 
            label="Explore" 
            to="/explore"
            active={currentPath === '/explore'}
          />
          <SidebarItem 
            icon={Bell} 
            label="Notifications" 
            to="/notifications"
            active={currentPath === '/notifications'}
          />
          <SidebarItem 
            icon={MessageCircle} 
            label="Messages" 
            to="/messages"
            active={currentPath === '/messages'}
          />
          <SidebarItem 
            icon={Bookmark} 
            label="Bookmarks" 
            to="/bookmarks"
            active={currentPath === '/bookmarks'}
          />
          <SidebarItem 
            icon={User} 
            label="Profile" 
            to="/profile"
            active={currentPath === '/profile'}
          />
          <SidebarItem 
            icon={MoreHorizontal} 
            label="More" 
            to="/more"
            active={currentPath === '/more'}
          />
        </nav>

        <Button className="mt-8 w-full bg-twitter-primary hover:bg-twitter-secondary text-white rounded-full py-3">
          Tweet
        </Button>
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-2 p-3 rounded-full hover:bg-gray-200 cursor-pointer">
          <div className="flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop" 
              alt="Profile" 
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Jane Smith</p>
            <p className="text-sm text-gray-500 truncate">@janesmith</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
export default Sidebar;
