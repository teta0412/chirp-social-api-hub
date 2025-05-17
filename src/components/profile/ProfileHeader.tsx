
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useState } from "react";
import { userApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ProfileHeaderProps = {
  user: User;
  isCurrentUser?: boolean;
};

export function ProfileHeader({ user, isCurrentUser = false }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollower || false);
  const { toast } = useToast();

  const handleFollow = async () => {
    try {
      const result = await userApi.followUser(user.id);
      setIsFollowing(result);
      
      toast({
        title: result ? "Followed successfully" : "Unfollowed successfully",
        description: result 
          ? `You are now following @${user.username}`
          : `You are no longer following @${user.username}`,
      });
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not follow/unfollow this user. Please try again.",
      });
    }
  };

  return (
    <div>
      {/* Banner/Wallpaper */}
      <div className="h-48 bg-twitter-light relative">
        {user.wallpaper && (
          <img
            src={user.wallpaper}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile details */}
      <div className="px-4 pb-4 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop"}
            alt={user.fullName}
            className="h-32 w-32 rounded-full"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end pt-4">
          {isCurrentUser ? (
            <Button 
              variant="outline" 
              className="rounded-full font-bold"
            >
              Edit profile
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              className={isFollowing ? "bg-white text-black border border-gray-300 hover:bg-gray-100 rounded-full font-bold" : "bg-twitter-primary hover:bg-twitter-secondary text-white rounded-full font-bold"}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* User info */}
        <div className="mt-6">
          <h1 className="text-xl font-bold">{user.fullName}</h1>
          <p className="text-gray-500">@{user.username}</p>
          
          {user.about && (
            <p className="mt-3">{user.about}</p>
          )}

          <div className="flex gap-4 mt-3 text-sm">
            {user.location && (
              <span className="text-gray-500">
                📍 {user.location}
              </span>
            )}
            
            {user.website && (
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-twitter-primary hover:underline"
              >
                🔗 {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            
            {user.registrationDate && (
              <span className="text-gray-500">
                📅 Joined {new Date(user.registrationDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex gap-5 mt-3">
            <span className="hover:underline cursor-pointer">
              <span className="font-bold">{user.followingCount || 0}</span>{" "}
              <span className="text-gray-500">Following</span>
            </span>
            <span className="hover:underline cursor-pointer">
              <span className="font-bold">{user.followersCount || 0}</span>{" "}
              <span className="text-gray-500">Followers</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
