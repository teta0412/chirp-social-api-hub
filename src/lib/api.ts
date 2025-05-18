import { AuthResponse, Chat, ChatMessage, LoginData, SimpleUser, Tweet, User } from "@/types";

const API_BASE_URL = "http://localhost:8000/ui/v1";

// Utility function to handle fetch requests
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user-id");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { "X-auth-user-Id": userId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return await response.json();
}

// Authentication
export const authApi = {
  login: (data: LoginData): Promise<AuthResponse> =>
    fetchWithAuth<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (email: string): Promise<string> =>
    fetchWithAuth<string>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (
    password: string,
    password2: string,
    code: string
  ): Promise<string> =>
    fetchWithAuth<string>("/auth/reset", {
      method: "POST",
      body: JSON.stringify({ password, password2, code }),
    }),

  getUserByResetCode: (code: string): Promise<User> =>
    fetchWithAuth<User>(`/auth/reset/${code}`),
};

// User
export const userApi = {
  getCurrentUser: (): Promise<AuthResponse> =>
    fetchWithAuth<AuthResponse>("/user/token"),

  getUserById: (userId: number): Promise<User> =>
    fetchWithAuth<User>(`/user/${userId}`),

  getAllUsers: (page = 0, size = 15): Promise<SimpleUser[]> =>
    fetchWithAuth<SimpleUser[]>(`/user/all?page=${page}&size=${size}`),

  getRelevantUsers: (): Promise<SimpleUser[]> =>
    fetchWithAuth<SimpleUser[]>("/user/relevant"),

  searchUsersByUsername: (
    username: string,
    page = 0,
    size = 15
  ): Promise<SimpleUser[]> =>
    fetchWithAuth<SimpleUser[]>(
      `/user/items/search/${username}?page=${page}&size=${size}`
    ),

  updateUserProfile: (profileData: Partial<User>): Promise<User> =>
    fetchWithAuth<User>("/user", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  followUser: (userId: number): Promise<boolean> =>
    fetchWithAuth<boolean>(`/user/follow/${userId}`),

  getFollowers: (userId: number, page = 0, size = 15): Promise<SimpleUser[]> =>
    fetchWithAuth<SimpleUser[]>(
      `/user/followers/${userId}?page=${page}&size=${size}`
    ),

  getFollowing: (userId: number, page = 0, size = 15): Promise<SimpleUser[]> =>
    fetchWithAuth<SimpleUser[]>(
      `/user/following/${userId}?page=${page}&size=${size}`
    ),
};

// Tweet
export const tweetApi = {
  getTweets: (page = 0, size = 20): Promise<Tweet[]> =>
    fetchWithAuth<Tweet[]>(`/tweets?page=${page}&size=${size}`),

  createTweet: (tweetData: Partial<Tweet>): Promise<Tweet> =>
    fetchWithAuth<Tweet>("/tweets", {
      method: "POST",
      body: JSON.stringify(tweetData),
    }),

  getTweetById: (tweetId: number): Promise<Tweet> =>
    fetchWithAuth<Tweet>(`/tweets/${tweetId}`),

  deleteTweet: (tweetId: number): Promise<string> =>
    fetchWithAuth<string>(`/tweets/${tweetId}`, {
      method: "DELETE",
    }),

  likeTweet: (userId: number, tweetId: number): Promise<any> =>
    fetchWithAuth<any>(`/tweets/like/${userId}/${tweetId}`),

  retweetTweet: (userId: number, tweetId: number): Promise<any> =>
    fetchWithAuth<any>(`/tweets/retweet/${userId}/${tweetId}`),

  getUserTweets: (userId: number, page = 0, size = 20): Promise<Tweet[]> =>
    fetchWithAuth<Tweet[]>(`/tweets/user/${userId}?page=${page}&size=${size}`),
};

// Chat
export const chatApi = {
  getUserChats: (): Promise<Chat[]> =>
    fetchWithAuth<Chat[]>("/chat/users"),

  getChatById: (chatId: number): Promise<Chat> =>
    fetchWithAuth<Chat>(`/chat/${chatId}`),

  getChatMessages: (chatId: number): Promise<ChatMessage[]> =>
    fetchWithAuth<ChatMessage[]>(`/chat/${chatId}/messages`),

  createChat: (userId: number): Promise<Chat> =>
    fetchWithAuth<Chat>(`/chat/create/${userId}`),

  sendMessage: (chatId: number, text: string): Promise<ChatMessage> =>
    fetchWithAuth<ChatMessage>("/chat/add/message", {
      method: "POST",
      body: JSON.stringify({ chatId, text }),
    }),

  sendMessageWithTweet: (text: string, tweetId: number, usersIds: number[]): Promise<ChatMessage> =>
    fetchWithAuth<ChatMessage>("/chat/messages/tweet", {
      method: "POST",
      body: JSON.stringify({ text, tweetId, usersIds }),
    }),

  getChatParticipant: (participantId: number, chatId: number): Promise<SimpleUser> =>
    fetchWithAuth<SimpleUser>(`/chat/participant/${participantId}/${chatId}`),

  leaveChat: (participantId: number, chatId: number): Promise<string> =>
    fetchWithAuth<string>(`/chat/leave/${participantId}/${chatId}`),

  searchChatParticipants: (username: string, page = 0, size = 15): Promise<SimpleUser[]> =>
    fetchWithAuth<SimpleUser[]>(`/chat/participant/search/${username}?page=${page}&size=${size}`),
};

// Image Upload
export const imageApi = {
  uploadImage: (file: File): Promise<{ id: number, src: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${API_BASE_URL}/tweets/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message || 'Failed to upload image');
        });
      }
      return response.json();
    });
  },
};
