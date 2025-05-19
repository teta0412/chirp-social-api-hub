import React from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/NotificationContext";

interface NotificationBadgeProps {
  onClick?: () => void;
}

export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  return (
    <button 
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}