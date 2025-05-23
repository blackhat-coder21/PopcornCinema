import { Movie, User, Room, RoomParticipant } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'cinephile42',
    email: 'movie.lover@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: new Date('2023-01-15'),
    isOnline: true,
  },
  {
    id: 'user_2',
    username: 'filmBuff99',
    email: 'film.buff@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: new Date('2023-03-22'),
    isOnline: true,
  },
  {
    id: 'user_3',
    username: 'reelExplorer',
    email: 'reel.explorer@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: new Date('2023-05-10'),
    isOnline: false,
  },
];

export const mockMovies: Movie[] = [
  {
    id: 'movie_1',
    title: 'The Neon Horizon',
    description: 'In a dystopian future, a rogue AI and a human detective form an unlikely alliance to solve a series of mysterious disappearances.',
    thumbnailUrl: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 118,
    releaseYear: 2023,
    genres: ['Sci-Fi', 'Thriller'],
    language: 'English',
    isPremium: false,
    rating: 4.5,
    videoUrl: 'https://example.com/videos/neon-horizon'
  },
  {
    id: 'movie_2',
    title: 'Whispers in the Woods',
    description: 'A family vacation takes a terrifying turn when they discover their remote cabin holds supernatural secrets.',
    thumbnailUrl: 'https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 102,
    releaseYear: 2022,
    genres: ['Horror', 'Mystery'],
    language: 'English',
    isPremium: true,
    price: 299,
    rating: 4.2,
    videoUrl: 'https://example.com/videos/whispers-woods'
  },
  {
    id: 'movie_3',
    title: 'Quantum Leap',
    description: 'A brilliant physicist discovers time travel, but altering the past has catastrophic consequences for the present.',
    thumbnailUrl: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 135,
    releaseYear: 2023,
    genres: ['Sci-Fi', 'Adventure'],
    language: 'English',
    isPremium: true,
    price: 349,
    rating: 4.7,
    videoUrl: 'https://example.com/videos/quantum-leap'
  },
  {
    id: 'movie_4',
    title: 'Sunset Boulevard Heist',
    description: 'A team of expert thieves plans the perfect crime on Hollywood\'s most famous street.',
    thumbnailUrl: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 110,
    releaseYear: 2021,
    genres: ['Action', 'Crime'],
    language: 'English',
    isPremium: false,
    rating: 4.0,
    videoUrl: 'https://example.com/videos/sunset-heist'
  },
  {
    id: 'movie_5',
    title: 'Eternal Echoes',
    description: 'A love story that spans centuries, as two souls continue to find each other in different lives.',
    thumbnailUrl: 'https://images.pexels.com/photos/3389817/pexels-photo-3389817.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 128,
    releaseYear: 2023,
    genres: ['Romance', 'Drama'],
    language: 'Hindi',
    isPremium: true,
    price: 249,
    rating: 4.8,
    videoUrl: 'https://example.com/videos/eternal-echoes'
  },
  {
    id: 'movie_6',
    title: 'Monsoon Memories',
    description: 'During a particularly heavy monsoon season, three estranged siblings reunite in their childhood home to confront their past.',
    thumbnailUrl: 'https://images.pexels.com/photos/9898528/pexels-photo-9898528.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 145,
    releaseYear: 2022,
    genres: ['Drama', 'Family'],
    language: 'Hindi',
    isPremium: false,
    rating: 4.4,
    videoUrl: 'https://example.com/videos/monsoon-memories'
  },
  {
    id: 'movie_7',
    title: 'The Last Stand',
    description: 'A retired special forces operator must defend his small town from a dangerous criminal and his gang.',
    thumbnailUrl: 'https://images.pexels.com/photos/1547827/pexels-photo-1547827.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 98,
    releaseYear: 2023,
    genres: ['Action', 'Thriller'],
    language: 'English',
    isPremium: true,
    price: 299,
    rating: 4.1,
    videoUrl: 'https://example.com/videos/last-stand'
  },
  {
    id: 'movie_8',
    title: 'Virtual Reality',
    description: 'A groundbreaking VR game turns deadly when players discover they can\'t log out.',
    thumbnailUrl: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 112,
    releaseYear: 2021,
    genres: ['Sci-Fi', 'Thriller'],
    language: 'English',
    isPremium: false,
    rating: 3.9,
    videoUrl: 'https://example.com/videos/virtual-reality'
  }
];

export const mockParticipants: RoomParticipant[] = [
  {
    userId: 'user_1',
    username: 'cinephile42',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedAt: new Date(),
    isMuted: false,
    isVideoEnabled: true,
    isHost: true,
  },
  {
    userId: 'user_2',
    username: 'filmBuff99',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedAt: new Date(),
    isMuted: true,
    isVideoEnabled: false,
    isHost: false,
  },
  {
    userId: 'user_3',
    username: 'reelExplorer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedAt: new Date(),
    isMuted: false,
    isVideoEnabled: true,
    isHost: false,
  },
];

export const mockRooms: Room[] = [
  {
    id: 'room_1',
    name: 'Sci-Fi Movie Night',
    hostId: 'user_1',
    movieId: 'movie_1',
    participants: mockParticipants,
    isPrivate: false,
    currentTime: 1250,
    isPlaying: true,
    startedAt: new Date(),
    messages: [
      {
        id: 'msg_1',
        userId: 'user_1',
        username: 'cinephile42',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Welcome everyone to movie night!',
        timestamp: new Date(Date.now() - 600000),
      },
      {
        id: 'msg_2',
        userId: 'user_2',
        username: 'filmBuff99',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'This movie has amazing visuals!',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: 'msg_3',
        userId: 'user_3',
        username: 'reelExplorer',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'The plot twist coming up is insane',
        timestamp: new Date(Date.now() - 60000),
      },
    ],
    reactions: [],
  },
];