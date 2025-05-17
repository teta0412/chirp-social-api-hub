
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chat, User } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatApi } from "@/lib/api";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatWindowProps {
  chat: Chat;
  onMessageSent: () => void;
}

const ChatWindow = ({ chat, onMessageSent }: ChatWindowProps) => {
  const [messageText, setMessageText] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const currentUser: User = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Get the other participant (for 1:1 chats)
  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];

  // Fetch the latest chat data to ensure we have all messages
  const { data: currentChat } = useQuery({
    queryKey: ['chat', chat.id],
    queryFn: () => chatApi.getChatById(chat.id),
    initialData: chat,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [currentChat?.messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      await chatApi.sendMessage(chat.id, messageText);
      setMessageText("");
      onMessageSent();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b">
        <Avatar className="h-10 w-10 mr-3">
          <img src={otherParticipant.avatar || "/placeholder.svg"} alt={otherParticipant.username} />
        </Avatar>
        <div>
          <h3 className="font-bold">{otherParticipant.fullName}</h3>
          <p className="text-sm text-gray-500">@{otherParticipant.username}</p>
        </div>
      </div>
      
      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {currentChat?.messages?.map((message) => {
            const isCurrentUser = message.author.id === currentUser.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex max-w-[70%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <img 
                        src={otherParticipant.avatar || "/placeholder.svg"} 
                        alt={otherParticipant.username} 
                      />
                    </Avatar>
                  )}
                  
                  <div>
                    <div 
                      className={`p-3 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-twitter-primary text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.tweet ? (
                        <div className="border rounded p-2 mb-2 text-sm">
                          <p className="font-bold">{message.tweet.authorFullName}</p>
                          <p>{message.tweet.text}</p>
                        </div>
                      ) : null}
                      <p>{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 mr-2"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!messageText.trim()}
            className="bg-twitter-primary hover:bg-twitter-secondary text-white"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
