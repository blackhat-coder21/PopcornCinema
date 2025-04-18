import React from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, LogOut, UserX } from 'lucide-react';
import { RoomParticipant } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ParticipantsListProps {
  participants: RoomParticipant[];
  isHost: boolean;
  currentUserId: string;
  onToggleMute: (userId: string) => void;
  onToggleVideo: (userId: string) => void;
  onKickParticipant: (userId: string) => void;
  onLeaveRoom: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  isHost,
  currentUserId,
  onToggleMute,
  onToggleVideo,
  onKickParticipant,
  onLeaveRoom
}) => {
  // Sort participants: host first, then alphabetically
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isHost && !b.isHost) return -1;
    if (!a.isHost && b.isHost) return 1;
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-100 dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Participants ({participants.length})
        </h3>
        <div className="flex space-x-2">
          {isHost && (
            <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-dark-300">
              <Settings size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <button 
            onClick={onLeaveRoom}
            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
          >
            <LogOut size={18} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
      
      <div className="p-2 max-h-[400px] overflow-y-auto">
        {sortedParticipants.map((participant) => (
          <div 
            key={participant.userId}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
          >
            <div className="flex items-center">
              <Avatar
                src={participant.avatar}
                alt={participant.username}
                status={participant.userId === currentUserId ? "online" : undefined}
                className="mr-3"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white flex items-center gap-1">
                  {participant.username}
                  {participant.isHost && (
                    <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-1.5 py-0.5 rounded-full">
                      Host
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Joined {new Date(participant.joinedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-1">
              {/* Mic status */}
              <button 
                onClick={() => onToggleMute(participant.userId)}
                disabled={!isHost && participant.userId !== currentUserId}
                className={`p-1.5 rounded-full ${
                  !isHost && participant.userId !== currentUserId 
                    ? 'opacity-50 cursor-not-allowed' 
                    : participant.isMuted 
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                      : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                }`}
              >
                {participant.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              
              {/* Video status */}
              <button 
                onClick={() => onToggleVideo(participant.userId)}
                disabled={!isHost && participant.userId !== currentUserId}
                className={`p-1.5 rounded-full ${
                  !isHost && participant.userId !== currentUserId 
                    ? 'opacity-50 cursor-not-allowed' 
                    : participant.isVideoEnabled 
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                }`}
              >
                {participant.isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
              </button>
              
              {/* Kick participant (only shown to host and not for self) */}
              {isHost && participant.userId !== currentUserId && (
                <button 
                  onClick={() => onKickParticipant(participant.userId)}
                  className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                >
                  <UserX size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};