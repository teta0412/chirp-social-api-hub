
// User types
export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  username: string;
  location: string;
  about: string;
  website: string;
  countryCode: string;
  country: string;
  phoneCode: string;
  phoneNumber: number;
  gender: string;
  language: string;
  birthday: string;
  registrationDate: string;
  tweetCount: number;
  mediaTweetCount: number;
  likeCount: number;
  notificationsCount: number;
  mentionsCount: number;
  active: boolean;
  profileCustomized: boolean;
  profileStarted: boolean;
  isMutedDirectMessages: boolean;
  isPrivateProfile: boolean;
  backgroundColor: string;
  colorScheme: string;
  avatar: string;
  wallpaper: string;
  pinnedTweetId: number;
  followersCount: number;
  followingCount: number;
  followerRequestsCount: number;
  unreadMessagesCount: number;
  isFollower?: boolean; // Added this property as optional
}

export interface SimpleUser {
  id: number;
  fullName: string;
  username: string;
  about: string;
  avatar: string;
  isPrivateProfile?: boolean;
  isMutedDirectMessages?: boolean;
  isUserBlocked?: boolean;
  isMyProfileBlocked?: boolean;
  isWaitingForApprove?: boolean;
  isFollower?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Chat related types
export interface ChatParticipant {
  id: number;
  fullName: string;
  username: string;
  about: string;
  avatar: string;
  isUserBlocked?: boolean;
  isMyProfileBlocked?: boolean;
}

export interface ChatMessage {
  id: number;
  text: string;
  createdAt: string;
  tweet?: {
    id: number;
    text: string;
    authorId: number;
    authorFullName: string;
    authorUsername: string;
    authorAvatar: string;
  };
  author: {
    id: number;
  };
  chat: {
    id: number;
  };
}

export interface Chat {
  id: number;
  createdAt: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  unreadMessagesCount: number;
}

// Tweet types
export interface Tweet {
  id: number;
  text: string;
  tweetType: string;
  createdAt: string;
  scheduledDate?: string;
  addressedUsername?: string;
  addressedId?: number;
  addressedTweetId?: number;
  replyType?: string;
  link?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkCover?: string;
  gifImage?: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  linkCoverSize?: string;
  author: {
    id: number;
    fullName: string;
    username: string;
    avatar: string;
    isPrivateProfile: boolean;
    isFollower: boolean;
  };
  images?: {
    id: number;
    src: string;
  }[];
  imageDescription?: string;
  taggedImageUsers?: SimpleUser[];
  quoteTweet?: any; // Simplified for now
  retweet?: any; // Simplified for now
  tweetList?: {
    id: number;
    name: string;
    altWallpaper: string;
    wallpaper: string;
    isPrivate: boolean;
  };
  poll?: {
    id: number;
    createdAt: string;
    pollChoices: {
      id: number;
      choice: string;
      votedCount: number;
      isUserVoted: boolean;
    }[];
  };
  retweetsCount: number;
  likesCount: number;
  repliesCount: number;
  quotesCount: number;
  isDeleted: boolean;
  isTweetLiked: boolean;
  isTweetRetweeted: boolean;
  isUserFollowByOtherUser?: boolean;
  isTweetDeleted?: boolean;
  isTweetBookmarked?: boolean;
}
