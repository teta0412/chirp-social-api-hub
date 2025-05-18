
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Twitter,
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      label: "Messages",
      icon: Mail,
      href: "/messages",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <div className="fixed h-full hidden md:flex flex-col py-4 px-3 gap-6">
      <div className="px-3">
        <Link to="/">
          <Twitter className="h-8 w-8 text-twitter-primary" />
        </Link>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "flex justify-start gap-4 text-lg",
              isActive(item.href) && "font-bold"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className={cn("h-6 w-6")} />
              <span className="hidden xl:inline-block">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
      <Button
        className="hidden xl:flex bg-twitter-primary hover:bg-twitter-secondary text-white rounded-full mt-4"
      >
        <span className="hidden xl:inline-block">Tweet</span>
        <span className="xl:hidden">+</span>
      </Button>
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </div>
  );
}

export default Sidebar;
