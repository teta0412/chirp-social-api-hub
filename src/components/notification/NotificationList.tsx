import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/avatar";
import { HeartIcon, RepeatIcon, MessageCircleIcon, UserPlusIcon, AtSignIcon, ListIcon } from "lucide-react";
import { Notification, NotificationType } from "@/types";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationList({ notifications, onNotificationClick }: NotificationListProps) {
  if (!notifications.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications yet
      </div>
    );
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LIKE:
        return <HeartIcon className="h-4 w-4 text-red-500" />;
      case NotificationType.RETWEET:
        return <RepeatIcon className="h-4 w-4 text-green-500" />;
      case NotificationType.REPLY:
        return <MessageCircleIcon className="h-4 w-4 text-blue-500" />;
      case NotificationType.FOLLOW:
        return <UserPlusIcon className="h-4 w-4 text-purple-500" />;
      case NotificationType.MENTION:
        return <AtSignIcon className="h-4 w-4 text-yellow-500" />;
      case NotificationType.TWEET:
        return <MessageCircleIcon className="h-4 w-4 text-blue-500" />;
      case NotificationType.LISTS:
        return <ListIcon className="h-4 w-4 text-indigo-500" />;
      default:
        return <MessageCircleIcon className="h-4 w-4" />;
    }
  };

  const getNotificationContent = (notification: Notification) => {
    const username = notification.user.username;
    
    switch (notification.notificationType) {
      case NotificationType.LIKE:
        return (
          <>
            <span className="font-semibold">@{username}</span> liked your tweet
            {notification.tweet && (
              <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                "{notification.tweet.text}"
              </div>
            )}
          </>
        );
      case NotificationType.RETWEET:
        return (
          <>
            <span className="font-semibold">@{username}</span> retweeted your tweet
            {notification.tweet && (
              <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                "{notification.tweet.text}"
              </div>
            )}
          </>
        );
      case NotificationType.REPLY:
        return (
          <>
            <span className="font-semibold">@{username}</span> replied to your tweet
            {notification.tweet && (
              <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                "{notification.tweet.text}"
              </div>
            )}
          </>
        );
      case NotificationType.FOLLOW:
        return (
          <>
            <span className="font-semibold">@{username}</span> followed you
          </>
        );
      case NotificationType.MENTION:
        return (
          <>
            <span className="font-semibold">@{username}</span> mentioned you in a tweet
            {notification.tweet && (
              <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                "{notification.tweet.text}"
              </div>
            )}
          </>
        );
      case NotificationType.TWEET:
        return (
          <>
            <span className="font-semibold">@{username}</span> posted a new tweet
            {notification.tweet && (
              <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                "{notification.tweet.text}"
              </div>
            )}
          </>
        );
      case NotificationType.LISTS:
        return (
          <>
            <span className="font-semibold">@{username}</span> 
            {notification.isAddedToList 
              ? ` added you to list ${notification.list?.listName}`
              : ` removed you from list ${notification.list?.listName}`}
          </>
        );
      default:
        return "You have a new notification";
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onNotificationClick?.(notification)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Avatar>
                <img src={notification.user.avatar} alt={notification.user.username}>
                </img>
            </Avatar> 
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                {getNotificationIcon(notification.notificationType)}
                <p className="text-sm text-gray-800">
                  {getNotificationContent(notification)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}