
import { Notification, Tweet } from "../types";

type MessageHandler = (data: any) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private userId: string | null = null;

  constructor() {
    this.userId = localStorage.getItem("user-id");
  }

  connect() {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket("ws://localhost:8000/websocket");

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.subscribe(`/topic/notifications/${this.userId}`);
      this.subscribe(`/topic/mentions/${this.userId}`);
      this.subscribe(`/topic/feed`);
      this.subscribe(`/topic/chat/${this.userId}`);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(message);
        const { destination, payload } = message;

        if (this.handlers.has(destination)) {
          const handlers = this.handlers.get(destination) || [];
          handlers.forEach((handler) => handler(payload));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  subscribe(destination: string, handler?: MessageHandler) {
    if (!this.handlers.has(destination)) {
      this.handlers.set(destination, []);
    }

    if (handler) {
      const handlers = this.handlers.get(destination) || [];
      handlers.push(handler);
      this.handlers.set(destination, handlers);
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ command: "SUBSCRIBE", destination }));
    }
  }

  unsubscribe(destination: string, handler?: MessageHandler) {
    if (handler && this.handlers.has(destination)) {
      const handlers = this.handlers.get(destination) || [];
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
        this.handlers.set(destination, handlers);
      }
    } else if (!handler) {
      this.handlers.delete(destination);
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ command: "UNSUBSCRIBE", destination }));
    }
  }

  onNotification(handler: (notification: Notification) => void) {
    this.subscribe(`/topic/notifications/${this.userId}`, handler);
  }

  onMention(handler: (tweet: Tweet) => void) {
    this.subscribe(`/topic/mentions/${this.userId}`, handler);
  }

  onChat(handler: (message: any) => void) {
    this.subscribe(`/topic/chat/${this.userId}`, handler);
  }

  onFeed(handler: (tweet: Tweet) => void) {
    this.subscribe(`/topic/feed`, handler);
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();