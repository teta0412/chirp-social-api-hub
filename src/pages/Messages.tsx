
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/lib/api";
import { Chat } from "@/types";
import { Separator } from "@/components/ui/separator";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import NewChatDialog from "@/components/chat/NewChatDialog";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { data: chats, isLoading, error, refetch } = useQuery({
    queryKey: ['chats'],
    queryFn: chatApi.getUserChats,
  });

  // When chats are loaded, select the first one if none is selected
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleMessageSent = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-red-500">Error loading messages</h2>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <NewChatDialog onChatCreated={refetch} />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r overflow-y-auto">
          <ConversationList 
            chats={chats || []} 
            selectedChatId={selectedChat?.id} 
            onSelectChat={handleChatSelect} 
          />
        </div>
        
        <div className="w-2/3 flex flex-col">
          {selectedChat ? (
            <ChatWindow 
              chat={selectedChat} 
              onMessageSent={handleMessageSent} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">Select a conversation or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
