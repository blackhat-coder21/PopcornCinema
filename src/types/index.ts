export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: Date;
  isOnline?: boolean;
  friendIds?: string[];
  paymentMethods?: PaymentMethod[];
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number; // in minutes
  releaseYear: number;
  genres: string[];
  language: string;
  isPremium: boolean;
  price?: number; // undefined if free
  rating: number; // out of 5
  videoUrl: string;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  movieId: string;
  participants: RoomParticipant[];
  isPrivate: boolean;
  password?: string;
  currentTime: number; // current playback position in seconds
  isPlaying: boolean;
  startedAt: Date;
  messages: ChatMessage[];
  reactions: Reaction[];
}

export interface RoomParticipant {
  userId: string;
  username: string;
  avatar: string;
  joinedAt: Date;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isHost: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

export interface Reaction {
  id: string;
  userId: string;
  emoji: string;
  timestamp: Date;
  position: { x: number; y: number }; // position on video player
}

export interface PaymentMethod {
  id: string;
  type: 'CARD' | 'UPI' | 'WALLET';
  details: {
    cardNumber?: string;
    upiId?: string;
    walletId?: string;
  };
  isDefault: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  movieId: string;
  amount: number;
  timestamp: Date;
  sharedWith?: string[]; // user IDs if payment was split
}