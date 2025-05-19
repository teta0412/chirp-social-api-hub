import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./hooks/use-toast";
import { API_BASE_URL, notificationApi } from "./lib/api";
import { websocketService } from "./service/websocket";
import { Notification } from "./types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  mentionsCount: number;
  markAllAsRead: () => void;
  markMentionsAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  mentionsCount: 0,
  markAllAsRead: () => {},
  markMentionsAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mentionsCount, setMentionsCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial notifications
    const fetchNotifications = async () => {
      try {
        const data = await notificationApi.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    // Get user data to get initial counts
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUnreadCount(user.notificationsCount || 0);
        setMentionsCount(user.mentionsCount || 0);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchNotifications();
    fetchUserData();

    onclose

    // Set up notification listeners
    const notificationHandler = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast({
        title: getNotificationTitle(notification),
        description: getNotificationDescription(notification),
        duration: 5000,
      });
    };

    // Set up mention listeners
    const mentionHandler = () => {
      setMentionsCount(prev => prev + 1);
    };

    websocketService.onNotification(notificationHandler);
    websocketService.onMention(mentionHandler);

    // Clean up listeners when component unmounts
    return () => {
      websocketService.unsubscribe(`/topic/notifications/${localStorage.getItem("user-id")}`, notificationHandler);
      websocketService.unsubscribe(`/topic/mentions/${localStorage.getItem("user-id")}`, mentionHandler);
    };
  }, [toast]);

  const markAllAsRead = async () => {
    try {
      // This would typically call an API endpoint to mark notifications as read
      // For now, we'll just update the state
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const markMentionsAsRead = async () => {
    try {
      // This would typically call an API endpoint to mark mentions as read
      // For now, we'll just update the state
      setMentionsCount(0);
    } catch (error) {
      console.error("Failed to mark mentions as read:", error);
    }
  };

  const getNotificationTitle = (notification: Notification): string => {
    switch (notification.notificationType) {
      case "LIKE":
        return "New Like";
      case "RETWEET":
        return "New Retweet";
      case "REPLY":
        return "New Reply";
      case "FOLLOW":
        return "New Follower";
      case "MENTION":
        return "New Mention";
      case "TWEET":
        return "New Tweet";
      case "LISTS":
        return "List Update";
      default:
        return "New Notification";
    }
  };

  const getNotificationDescription = (notification: Notification): string => {
    const username = notification.user.username;
    
    switch (notification.notificationType) {
      case "LIKE":
        return `@${username} liked your tweet`;
      case "RETWEET":
        return `@${username} retweeted your tweet`;
      case "REPLY":
        return `@${username} replied to your tweet`;
      case "FOLLOW":
        return `@${username} followed you`;
      case "MENTION":
        return `@${username} mentioned you in a tweet`;
      case "TWEET":
        return `@${username} posted a new tweet`;
      case "LISTS":
        return notification.isAddedToList 
          ? `@${username} added you to list ${notification.list?.listName}`
          : `@${username} removed you from list ${notification.list?.listName}`;
      default:
        return "You have a new notification";
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        mentionsCount,
        markAllAsRead,
        markMentionsAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};