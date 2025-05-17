
export type User = {
  id: number;
  email?: string;
  fullName: string;
  username: string;
  location?: string;
  about?: string;
  website?: string;
  countryCode?: string;
  country?: string;
  phoneCode?: string;
  phoneNumber?: number;
  gender?: string;
  language?: string;
  birthday?: string;
  registrationDate?: string;
  tweetCount?: number;
  mediaTweetCount?: number;
  likeCount?: number;
  notificationsCount?: number;
  mentionsCount?: number;
  active?: boolean;
  profileCustomized?: boolean;
  profileStarted?: boolean;
  isMutedDirectMessages?: boolean;
  isPrivateProfile?: boolean;
  backgroundColor?: string;
  colorScheme?: string;
  avatar?: string;
  wallpaper?: string;
  pinnedTweetId?: number;
  followersCount?: number;
  followingCount?: number;
  followerRequestsCount?: number;
  unreadMessagesCount?: number;
  isFollower?: boolean;
};

export type SimpleUser = {
  id: number;
  fullName: string;
  username: string;
  about?: string;
  avatar?: string;
  isPrivateProfile?: boolean;
  isMutedDirectMessages?: boolean;
  isUserBlocked?: boolean;
  isMyProfileBlocked?: boolean;
  isWaitingForApprove?: boolean;
  isFollower?: boolean;
};

export type TweetImage = {
  id: number;
  src: string;
};

export type TweetGif = {
  id: number;
  url: string;
  width: number;
  height: number;
};

export type PollChoice = {
  id: number;
  choice: string;
  votedCount: number;
  isUserVoted: boolean;
};

export type Poll = {
  id: number;
  createdAt: string;
  pollChoices: PollChoice[];
};

export type TweetList = {
  id: number;
  name: string;
  altWallpaper: string;
  wallpaper: string;
  isPrivate: boolean;
};

export type SimpleTweet = {
  id: number;
  text: string;
  tweetType: string;
  createdAt: string;
  link?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkCover?: string;
  linkCoverSize?: string;
  author: SimpleUser;
  isDeleted: boolean;
};

export type Tweet = {
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
  gifImage?: TweetGif;
  linkCoverSize?: string;
  author: SimpleUser;
  images?: TweetImage[];
  imageDescription?: string;
  taggedImageUsers?: SimpleUser[];
  quoteTweet?: SimpleTweet;
  retweet?: Tweet;
  tweetList?: TweetList;
  poll?: Poll;
  retweetsCount: number;
  likesCount: number;
  repliesCount: number;
  quotesCount: number;
  isDeleted: boolean;
  isTweetLiked: boolean;
  isTweetRetweeted: boolean;
  isUserFollowByOtherUser?: boolean;
  isTweetDeleted: boolean;
  isTweetBookmarked: boolean;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
