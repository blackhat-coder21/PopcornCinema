import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { ChatPanel } from '../components/room/ChatPanel';
import { ParticipantsList } from '../components/room/ParticipantsList';
import { ReactionOverlay } from '../components/room/ReactionOverlay';
import { Button } from '../components/ui/Button';
import { useRoomStore } from '../store/room-store';
import { useUserStore } from '../store/user-store';
import { useMovieStore } from '../store/movie-store';
import { RoomParticipant, ChatMessage } from '../types';
import { Copy, Users, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { mockRooms } from '../data/mock-data';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [inviteLink, setInviteLink] = useState('');
  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  
  const { currentRoom, myRooms, joinRoom, leaveRoom, endRoom, updatePlayback, sendMessage, toggleParticipantMute, toggleParticipantVideo, kickParticipant } = useRoomStore();
  const { currentUser } = useUserStore();
  const { getMovieById } = useMovieStore();
  
  // For the demo, use the mock room if no room is found
  useEffect(() => {
    if (!currentRoom && myRooms.length === 0 && roomId) {
      // Add the mock room to myRooms if it's not there
      const mockRoom = mockRooms.find(room => room.id === roomId);
      if (mockRoom && currentUser) {
        // Join the mock room
        const participant: RoomParticipant = {
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          joinedAt: new Date(),
          isMuted: false,
          isVideoEnabled: true,
          isHost: mockRoom.hostId === currentUser.id,
        };
        
        joinRoom(mockRoom.id, participant);
      }
    }
  }, [roomId, currentRoom, myRooms, currentUser]);
  
  useEffect(() => {
    if (roomId) {
      setInviteLink(`${window.location.origin}/rooms/${roomId}`);
    }
  }, [roomId]);
  
  useEffect(() => {
    const updateSize = () => {
      if (videoContainerRef.current) {
        setVideoSize({
          width: videoContainerRef.current.offsetWidth,
          height: videoContainerRef.current.offsetHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  const handlePlaybackChange = (time: number, isPlaying: boolean) => {
    updatePlayback(time, isPlaying);
  };
  
  const handleSendMessage = (content: string) => {
    if (currentUser) {
      sendMessage({
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        content,
      });
    }
  };
  
  const handleLeaveRoom = () => {
    if (currentUser) {
      leaveRoom(currentUser.id);
      navigate('/');
    }
  };
  
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setShowCopiedMsg(true);
    setTimeout(() => {
      setShowCopiedMsg(false);
    }, 2000);
  };
  
  // Get the movie info for the current room
  const movie = currentRoom ? getMovieById(currentRoom.movieId) : undefined;
  
  // Determine if current user is host
  const isHost = currentRoom && currentUser ? currentRoom.hostId === currentUser.id : false;
  
  // If no room found, show a message
  if (!currentRoom || !movie || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Room not found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">This room doesn't exist or you don't have access to it.</p>
        <Button
          onClick={() => navigate('/')}
          leftIcon={<LinkIcon size={16} />}
        >
          Go back to home
        </Button>
      </div>
    );
  }
  
  // Main layout for the room
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentRoom.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span>Watching:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{movie.title}</span>
          </p>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<LinkIcon size={16} />}
              onClick={handleCopyInviteLink}
            >
              Copy Invite Link
            </Button>
            {showCopiedMsg && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow">
                Copied!
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<MessageSquare size={16} />}
            onClick={() => setShowChat(!showChat)}
            className={showChat ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : ''}
          >
            Chat
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Users size={16} />}
            onClick={() => setShowParticipants(!showParticipants)}
            className={`ml-2 ${showParticipants ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : ''}`}
          >
            Participants
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video Area (spans 3 columns on large screens) */}
        <div className={`${showChat || showParticipants ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <div ref={videoContainerRef} className="relative rounded-lg overflow-hidden h-[60vh]">
            <VideoPlayer
              videoUrl={movie.videoUrl}
              roomData={currentRoom}
              onPlaybackChange={handlePlaybackChange}
              isHost={isHost}
            />
            
            <ReactionOverlay
              reactions={currentRoom.reactions}
              videoWidth={videoSize.width}
              videoHeight={videoSize.height}
            />
          </div>
          
          <div className="mt-4 bg-white dark:bg-dark-100 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{movie.title}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres.map((genre) => (
                <span 
                  key={genre}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{movie.description}</p>
          </div>
        </div>
        
        {/* Sidebar for Chat and Participants */}
        {(showChat || showParticipants) && (
          <div className="lg:col-span-1 space-y-6">
            {showParticipants && (
              <ParticipantsList
                participants={currentRoom.participants}
                isHost={isHost}
                currentUserId={currentUser.id}
                onToggleMute={toggleParticipantMute}
                onToggleVideo={toggleParticipantVideo}
                onKickParticipant={kickParticipant}
                onLeaveRoom={handleLeaveRoom}
              />
            )}
            
            {showChat && (
              <div className="h-[400px]">
                <ChatPanel
                  messages={currentRoom.messages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};