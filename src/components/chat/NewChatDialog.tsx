
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquarePlus, Search, Loader2 } from "lucide-react";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NewChatDialogProps {
  onChatCreated: () => void;
}

const NewChatDialog = ({ onChatCreated }: NewChatDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { toast } = useToast();

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ["chatUserSearch", searchTerm],
    queryFn: () => chatApi.searchChatParticipants(searchTerm),
    enabled: searchTerm.length > 0,
  });

  const handleSearch = async () => {
    if (searchTerm.length > 0) {
      await refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreateChat = async (userId: number) => {
    setIsCreatingChat(true);
    try {
      await chatApi.createChat(userId);
      toast({
        title: "Conversation created",
        description: "You can now start messaging",
      });
      onChatCreated();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create chat:", error);
      toast({
        title: "Failed to create conversation",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-gray-100"
        >
          <MessageSquarePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search for people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading || !searchTerm}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          
          {searchResults && searchResults.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {searchResults.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleCreateChat(user.id)}
                    disabled={isCreatingChat}
                    size="sm"
                  >
                    {isCreatingChat ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Message"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : searchTerm && !isLoading ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
