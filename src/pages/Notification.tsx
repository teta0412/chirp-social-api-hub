import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { NotificationList } from "../components/notification/NotificationList";
import { notificationApi } from "../lib/api";
import { Notification, Tweet } from "../types";
import { TweetCard } from "../components/tweet/TweetCard";
import { useNotifications } from "@/NotificationContext";

export function Notifications() {
  const { markAllAsRead, markMentionsAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mentions, setMentions] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [notificationsData, mentionsData] = await Promise.all([
          notificationApi.getNotifications(),
          notificationApi.getMentions()
        ]);
        
        setNotifications(notificationsData);
        setMentions(mentionsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (value: string) => {
    if (value === "all") {
      markAllAsRead();
    } else if (value === "mentions") {
      markMentionsAsRead();
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Navigate to the appropriate page based on notification type
    if (notification.tweet) {
      // Navigate to tweet
      window.location.href = `/tweet/${notification.tweet.id}`;
    } else if (notification.notificationType === "FOLLOW") {
      // Navigate to user profile
      window.location.href = `/profile/${notification.user.id}`;
    } else if (notification.list) {
      // Navigate to list
      window.location.href = `/lists/${notification.list.id}`;
    }
  };

  return (
    <div className="timeline-container p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="p-4 text-center">Loading notifications...</div>
          ) : (
            <NotificationList 
              notifications={notifications} 
              onNotificationClick={handleNotificationClick}
            />
          )}
        </TabsContent>
        
        <TabsContent value="mentions">
          {loading ? (
            <div className="p-4 text-center">Loading mentions...</div>
          ) : (
            <div className="space-y-4">
              {mentions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No mentions yet
                </div>
              ) : (
                mentions.map(tweet => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}