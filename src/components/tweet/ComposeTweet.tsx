
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "lucide-react";
import { tweetApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ComposeTweetProps = {
  onTweetCreated?: () => void;
};

export function ComposeTweet({ onTweetCreated }: ComposeTweetProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() && images.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, you'd actually upload these images and get their URLs
      const tweetData = {
        text,
        images: images.length > 0 ? images.map((src, id) => ({ id, src })) : undefined,
      };
      
      await tweetApi.createTweet(tweetData);
      
      toast({
        title: "Tweet posted!",
        description: "Your tweet has been posted successfully.",
      });
      
      // Reset form
      setText("");
      setImages([]);
      
      // Notify parent component
      if (onTweetCreated) {
        onTweetCreated();
      }
    } catch (error) {
      console.error("Error posting tweet:", error);
      toast({
        variant: "destructive",
        title: "Error posting tweet",
        description: "There was an error posting your tweet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUpload = () => {
    // In a real app, this would be replaced with actual image upload functionality
    // For now, we'll just simulate adding a placeholder image
    if (images.length < 4) {
      setImages([...images, "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop"]);
    } else {
      toast({
        variant: "destructive",
        title: "Maximum images reached",
        description: "You can only add up to 4 images per tweet.",
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex">
        <div className="flex-shrink-0 mr-4">
          <img 
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop"
            alt="Your avatar"
            className="h-12 w-12 rounded-full"
          />
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <Textarea
              className="min-h-[80px] border-none resize-none placeholder-gray-500 text-xl py-2 focus-visible:ring-0"
              placeholder="What's happening?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((src, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={src}
                      alt={`Tweet image ${index + 1}`}
                      className="rounded-lg w-full h-auto object-cover"
                      style={{ maxHeight: '150px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleImageUpload}
                  className="text-twitter-primary rounded-full"
                >
                  <Image size={20} />
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="bg-twitter-primary hover:bg-twitter-secondary text-white font-bold rounded-full px-5"
                disabled={isLoading || (!text.trim() && images.length === 0)}
              >
                {isLoading ? "Posting..." : "Tweet"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ComposeTweet;
