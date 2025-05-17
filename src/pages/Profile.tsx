
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Tweet } from "@/types";
import { userApi, tweetApi } from "@/lib/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TweetCard from "@/components/tweet/TweetCard";

export function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingTweets, setIsLoadingTweets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if the profile is the current user's profile
  const isCurrentUser = !userId; // Assuming no userId means current user's profile
  
  useEffect(() => {
    const fetchUserAndTweets = async () => {
      try {
        setIsLoadingUser(true);
        setError(null);
        
        // Fetch user data
        let userData: User;
        if (isCurrentUser) {
          const response = await userApi.getCurrentUser();
          userData = response.user;
        } else {
          userData = await userApi.getUserById(parseInt(userId!, 10));
        }
        setUser(userData);
        setIsLoadingUser(false);
        
        // Fetch user's tweets
        setIsLoadingTweets(true);
        const userTweets = await tweetApi.getUserTweets(userData.id);
        setTweets(userTweets);
        setIsLoadingTweets(false);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Loading Profile",
          description: "We couldn't load this profile. Please refresh the page.",
        });
        setIsLoadingUser(false);
        setIsLoadingTweets(false);
      }
    };
    
    fetchUserAndTweets();
  }, [userId, isCurrentUser, toast]);
  
  const handleTweetUpdate = (updatedTweet: Tweet) => {
    setTweets(prev =>
      prev.map(tweet => (tweet.id === updatedTweet.id ? updatedTweet : tweet))
    );
  };
  
  if (isLoadingUser) {
    return (
      <div className="timeline-container pb-16 md:pb-0">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="timeline-container pb-16 md:pb-0">
        <div className="p-8 text-center text-red-500">
          {error || "User not found"}
        </div>
      </div>
    );
  }
  
  return (
    <div className="timeline-container pb-16 md:pb-0">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <h1 className="p-4 font-bold text-xl">{user.fullName}</h1>
      </div>
      
      <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
      
      {/* Tweets section */}
      <div className="border-t border-gray-200 mt-4">
        <div className="flex justify-around">
          <button className="flex-1 py-4 font-medium hover:bg-gray-50 border-b-2 border-twitter-primary">Tweets</button>
          <button className="flex-1 py-4 text-gray-500 hover:bg-gray-50">Replies</button>
          <button className="flex-1 py-4 text-gray-500 hover:bg-gray-50">Media</button>
          <button className="flex-1 py-4 text-gray-500 hover:bg-gray-50">Likes</button>
        </div>
        
        {isLoadingTweets ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-primary"></div>
          </div>
        ) : tweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tweets yet.
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
    </div>
  );
}

export default Profile;
