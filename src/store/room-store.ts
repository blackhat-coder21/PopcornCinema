import { create } from 'zustand';
import { Room, ChatMessage, Reaction, RoomParticipant } from '../types';
import { generateRoomId } from '../lib/utils';

interface RoomState {
  currentRoom: Room | null;
  myRooms: Room[];
  
  // Room actions
  createRoom: (hostId: string, movieId: string, name: string, isPrivate: boolean, password?: string) => Room;
  joinRoom: (roomId: string, participant: RoomParticipant, password?: string) => boolean;
  leaveRoom: (userId: string) => void;
  endRoom: (roomId: string) => void;
  
  // Playback controls
  updatePlayback: (time: number, isPlaying: boolean) => void;
  
  // Chat and reactions
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addReaction: (reaction: Omit<Reaction, 'id' | 'timestamp'>) => void;
  
  // Participant management
  toggleParticipantMute: (userId: string) => void;
  toggleParticipantVideo: (userId: string) => void;
  kickParticipant: (userId: string) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  myRooms: [],
  
  createRoom: (hostId, movieId, name, isPrivate, password) => {
    const newRoom: Room = {
      id: generateRoomId(),
      name,
      hostId,
      movieId,
      participants: [],
      isPrivate,
      password,
      currentTime: 0,
      isPlaying: false,
      startedAt: new Date(),
      messages: [],
      reactions: [],
    };
    
    set((state) => ({
      currentRoom: newRoom,
      myRooms: [...state.myRooms, newRoom],
    }));
    
    return newRoom;
  },
  
  joinRoom: (roomId, participant, password) => {
    const { myRooms } = get();
    const roomIndex = myRooms.findIndex((room) => room.id === roomId);
    
    if (roomIndex === -1) return false;
    
    const room = myRooms[roomIndex];
    
    // Check password if room is private
    if (room.isPrivate && room.password !== password) {
      return false;
    }
    
    // Add participant to room
    const updatedRoom = {
      ...room,
      participants: [...room.participants, participant],
    };
    
    const updatedRooms = [...myRooms];
    updatedRooms[roomIndex] = updatedRoom;
    
    set({
      currentRoom: updatedRoom,
      myRooms: updatedRooms,
    });
    
    return true;
  },
  
  leaveRoom: (userId) => {
    const { currentRoom, myRooms } = get();
    
    if (!currentRoom) return;
    
    // Remove participant from room
    const updatedParticipants = currentRoom.participants.filter(
      (p) => p.userId !== userId
    );
    
    const updatedRoom = {
      ...currentRoom,
      participants: updatedParticipants,
    };
    
    // Update rooms list
    const roomIndex = myRooms.findIndex((room) => room.id === currentRoom.id);
    const updatedRooms = [...myRooms];
    
    if (roomIndex !== -1) {
      updatedRooms[roomIndex] = updatedRoom;
    }
    
    set({
      currentRoom: null,
      myRooms: updatedRooms,
    });
  },
  
  endRoom: (roomId) => {
    const { myRooms } = get();
    
    // Remove room from list
    const updatedRooms = myRooms.filter((room) => room.id !== roomId);
    
    set({
      currentRoom: null,
      myRooms: updatedRooms,
    });
  },
  
  updatePlayback: (time, isPlaying) => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    const updatedRoom = {
      ...currentRoom,
      currentTime: time,
      isPlaying,
    };
    
    set({ currentRoom: updatedRoom });
  },
  
  sendMessage: (messageData) => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      ...messageData,
      timestamp: new Date(),
    };
    
    const updatedRoom = {
      ...currentRoom,
      messages: [...currentRoom.messages, newMessage],
    };
    
    set({ currentRoom: updatedRoom });
  },
  
  addReaction: (reactionData) => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    const newReaction: Reaction = {
      id: `reaction_${Date.now()}`,
      ...reactionData,
      timestamp: new Date(),
    };
    
    const updatedRoom = {
      ...currentRoom,
      reactions: [...currentRoom.reactions, newReaction],
    };
    
    set({ currentRoom: updatedRoom });
  },
  
  toggleParticipantMute: (userId) => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    const updatedParticipants = currentRoom.participants.map((p) =>
      p.userId === userId ? { ...p, isMuted: !p.isMuted } : p
    );
    
    const updatedRoom = {
      ...currentRoom,
      participants: updatedParticipants,
    };
    
    set({ currentRoom: updatedRoom });
  },
  
  toggleParticipantVideo: (userId) => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    const updatedParticipants = currentRoom.participants.map((p) =>
      p.userId === userId ? { ...p, isVideoEnabled: !p.isVideoEnabled } : p
    );
    
    const updatedRoom = {
      ...currentRoom,
      participants: updatedParticipants,
    };
    
    set({ currentRoom: updatedRoom });
  },
  
  kickParticipant: (userId) => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    const updatedParticipants = currentRoom.participants.filter(
      (p) => p.userId !== userId
    );
    
    const updatedRoom = {
      ...currentRoom,
      participants: updatedParticipants,
    };
    
    set({ currentRoom: updatedRoom });
  },
}));