
import { Chat } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/lib/api";

interface ConversationListProps {
  chats: Chat[];
  selectedChatId?: number;
  onSelectChat: (chat: Chat) => void;
}

const ConversationList = ({ chats, selectedChatId, onSelectChat }: ConversationListProps) => {
  // Helper function to get the other participant (for 1:1 chats)
  const getOtherParticipant = (chat: Chat) => {
    const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    return chat.participants.find(p => p.user.id !== currentUserId);
  };

  // Helper function to get the last message preview
  const getLastMessagePreview = (chat: Chat) => {
    const { data: messages } = useQuery({
      queryKey: ['chat-messages', chat.id],
      queryFn: () => chatApi.getChatMessages(chat.id),
      initialData: [],
    });
    chat.messages = messages;
    if (!chat.messages || chat.messages.length === 0) return "No messages yet";
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.tweet 
      ? `Shared a tweet: ${lastMessage.tweet.text.substring(0, 20)}...` 
      : lastMessage.text.substring(0, 30) + (lastMessage.text.length > 30 ? '...' : '');
  };

  return (
    <div className="flex flex-col">
      {chats.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No conversations yet
        </div>
      ) : (
        chats.map(chat => {
          const otherUser = getOtherParticipant(chat).user;
          const lastMessageTime = chat.messages && chat.messages.length > 0
            ? new Date(chat.messages[chat.messages.length - 1].createdAt)
            : new Date(chat.createdAt);
          
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={cn(
                "flex items-start p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedChatId === chat.id ? "bg-gray-100" : ""
              )}
            >
              <Avatar className="h-12 w-12 mr-3">
                <img src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.username} />
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold truncate">{otherUser.fullName}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(lastMessageTime, { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 truncate">@{otherUser.username}</p>
                
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {getLastMessagePreview(chat)}
                </p>
                
                {chat.unreadMessagesCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full bg-twitter-primary text-white mt-1">
                    {chat.unreadMessagesCount}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
