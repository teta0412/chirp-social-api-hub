
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tweet } from "@/types";
import { tweetApi } from "@/lib/api";
import TweetCard from "@/components/tweet/TweetCard";
import ComposeTweet from "@/components/tweet/ComposeTweet";

export function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTweets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tweetApi.getTweets();
      setTweets(data);
    } catch (err) {
      setError("Failed to load tweets. Please try again.");
      toast({
        variant: "destructive",
        title: "Error Loading Tweets",
        description: "We couldn't load the latest tweets. Please refresh the page.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweetUpdate = (updatedTweet: Tweet) => {
    setTweets(prev =>
      prev.map(tweet => (tweet.id === updatedTweet.id ? updatedTweet : tweet))
    );
  };

  return (
    <div className="timeline-container pb-16 md:pb-0">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <h1 className="p-4 font-bold text-xl">Home</h1>
      </div>

      <ComposeTweet onTweetCreated={fetchTweets} />

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-primary"></div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : tweets.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No tweets yet. Be the first to tweet!
        </div>
      ) : (
        tweets.map(tweet => (
          <TweetCard 
            key={tweet.id} 
            tweet={tweet} 
            onTweetUpdate={handleTweetUpdate}
          />
        ))
      )}
    </div>
  );
}

export default Home;
