import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, X } from "lucide-react";
import { tweetApi, imageApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ComposeTweetProps = {
  onTweetCreated?: () => void;
};

export function ComposeTweet({ onTweetCreated }: ComposeTweetProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<Array<{id: number, src: string}>>([]);
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() && images.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const tweetData = {
        text,
        images: images.length > 0 ? images : undefined,
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > 4) {
      toast({
        variant: "destructive",
        title: "Maximum images reached",
        description: "You can only add up to 4 images per tweet.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const uploadPromises = Array.from(files).map(file => imageApi.uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Store the complete image objects with id and src
      setImages([...images, ...uploadedImages]);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${uploadedImages.length} image(s).`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        variant: "destructive",
        title: "Error uploading images",
        description: "There was an error uploading your images. Please try again.",
      });
    } finally {
      setIsLoading(false);
      // Reset the input value so the same file can be selected again
      if (e.target) e.target.value = '';
    }
  };
  
  const removeImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
  };
  
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex">
        <div className="flex-shrink-0 mr-4">
          <img 
            src={user.avatar || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop"}
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
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <img 
                      src={img.src}
                      alt={`Tweet image ${img.id}`}
                      className="rounded-lg w-full h-auto object-contain"
                      style={{ maxHeight: '250px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      <X size={16} />
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
                  className="text-twitter-primary rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image size={20} />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isLoading || images.length >= 4}
                />
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
