import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Tweet } from "@/types";
import { Heart, MessageCircle, Repeat, Share } from "lucide-react";
import { tweetApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type TweetCardProps = {
  tweet: Tweet;
  onTweetUpdate?: (updatedTweet: Tweet) => void;
};

export function TweetCard({ tweet, onTweetUpdate }: TweetCardProps) {
  const [isLiked, setIsLiked] = useState(tweet.isTweetLiked);
  const [isRetweeted, setIsRetweeted] = useState(tweet.isTweetRetweeted);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweetsCount);
  const userId = localStorage.getItem("user-id")
  const handleLike = async () => {
    try {
      await tweetApi.likeTweet(parseInt(userId), tweet.id);
      
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikesCount(prevCount => newLikeStatus ? prevCount + 1 : prevCount - 1);
      
      if (onTweetUpdate) {
        onTweetUpdate({
          ...tweet,
          isTweetLiked: newLikeStatus,
          likesCount: newLikeStatus ? tweet.likesCount + 1 : tweet.likesCount - 1
        });
      }
    } catch (error) {
      console.error("Error liking tweet:", error);
    }
  };
  
  const handleRetweet = async () => {
    try {
      await tweetApi.retweetTweet(parseInt(userId), tweet.id);
      
      const newRetweetStatus = !isRetweeted;
      setIsRetweeted(newRetweetStatus);
      setRetweetsCount(prevCount => newRetweetStatus ? prevCount + 1 : prevCount - 1);
      
      if (onTweetUpdate) {
        onTweetUpdate({
          ...tweet,
          isTweetRetweeted: newRetweetStatus,
          retweetsCount: newRetweetStatus ? tweet.retweetsCount + 1 : tweet.retweetsCount - 1
        });
      }
    } catch (error) {
      console.error("Error retweeting tweet:", error);
    }
  };
  
  const formatTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };
  
  if (tweet.isDeleted || tweet.isTweetDeleted) {
    return (
      <div className="tweet-card opacity-50">
        <p className="text-gray-500">This tweet has been deleted</p>
      </div>
    );
  }
  
  return (
    <div className="tweet-card">
      <div className="flex">
        <Link to={`/profile/${tweet.author.id}`} className="flex-shrink-0 mr-3">
          <img 
            src={tweet.author.avatar || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop"} 
            alt={tweet.author.fullName}
            className="h-12 w-12 rounded-full"
          />
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center">
            <Link to={`/profile/${tweet.author.id}`} className="font-bold hover:underline">{tweet.author.fullName}</Link>
            <span className="ml-2 text-gray-500">@{tweet.author.username}</span>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500">{formatTimeAgo(tweet.createdAt)}</span>
          </div>
          
          <p className="mt-1">{tweet.text}</p>
          
          {tweet.images && tweet.images.length > 0 && (
            <div className={cn(
              "mt-3 grid gap-2",
              tweet.images.length === 1 && "grid-cols-1",
              tweet.images.length === 2 && "grid-cols-2",
              tweet.images.length === 3 && "grid-cols-2",
              tweet.images.length === 4 && "grid-cols-2"
            )}>
              {tweet.images.map((image, index) => (
                <img 
                  key={image.id}
                  src={image.src} 
                  alt={`Tweet image ${index + 1}`}
                  className="rounded-lg w-full h-auto object-contain"
                  style={{ maxHeight: tweet.images.length === 1 ? '400px' : '250px' }}
                />
              ))}
            </div>
          )}
          
          {/* Quote tweet */}
          {tweet.quoteTweet && (
            <div className="mt-3 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center">
                <span className="font-bold">{tweet.quoteTweet.author.fullName}</span>
                <span className="ml-2 text-gray-500">@{tweet.quoteTweet.author.username}</span>
              </div>
              <p className="mt-1">{tweet.quoteTweet.text}</p>
            </div>
          )}
          
          <div className="mt-3 flex justify-between max-w-md">
            <button className="tweet-action">
              <MessageCircle size={18} />
              <span>{tweet.repliesCount > 0 ? tweet.repliesCount : ""}</span>
            </button>
            
            <button 
              className={cn("tweet-action", isRetweeted && "text-green-500")} 
              onClick={handleRetweet}
            >
              <Repeat size={18} />
              <span>{retweetsCount > 0 ? retweetsCount : ""}</span>
            </button>
            
            <button 
              className={cn("tweet-action", isLiked && "text-red-500")} 
              onClick={handleLike}
            >
              <Heart size={18} />
              <span>{likesCount > 0 ? likesCount : ""}</span>
            </button>
            
            <button className="tweet-action">
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
