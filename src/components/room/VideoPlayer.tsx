import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Rewind, FastForward } from 'lucide-react';
import { Room } from '../../types';

interface VideoPlayerProps {
  videoUrl: string;
  roomData: Room | null;
  onPlaybackChange: (time: number, isPlaying: boolean) => void;
  isHost: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  roomData,
  onPlaybackChange,
  isHost,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Set video from room data
  useEffect(() => {
    if (roomData && videoRef.current) {
      videoRef.current.currentTime = roomData.currentTime;
      if (roomData.isPlaying && !isPlaying) {
        videoRef.current.play().catch(err => console.error('Error playing video:', err));
        setIsPlaying(true);
      } else if (!roomData.isPlaying && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [roomData]);
  
  // Hide controls after inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      setShowControls(true);
      
      timeoutId = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetTimeout();
    
    return () => clearTimeout(timeoutId);
  }, [isPlaying]);
  
  const handlePlay = () => {
    if (!isHost) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(err => console.error('Error playing video:', err));
        setIsPlaying(true);
      }
      
      onPlaybackChange(videoRef.current.currentTime, !isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isHost) return;
    
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      onPlaybackChange(newTime, isPlaying);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const toggleFullscreen = () => {
    const container = document.getElementById('video-container');
    
    if (!container) return;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(h > 0 ? 2 : 1, '0'),
      String(s).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':');
  };
  
  const handleSkip = (seconds: number) => {
    if (!isHost || !videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onPlaybackChange(newTime, isPlaying);
  };

  return (
    <div 
      id="video-container" 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={handlePlay}
      />
      
      {!isHost && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
          View-only Mode
        </div>
      )}
      
      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <div>{formatTime(currentTime)}</div>
            <div>{formatTime(duration)}</div>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button 
              onClick={handlePlay}
              className={`text-white hover:text-primary-400 transition-colors ${!isHost && 'opacity-50 cursor-not-allowed'}`}
              disabled={!isHost}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            {/* Rewind 10s */}
            <button 
              onClick={() => handleSkip(-10)}
              className={`text-white hover:text-primary-400 transition-colors ${!isHost && 'opacity-50 cursor-not-allowed'}`}
              disabled={!isHost}
            >
              <Rewind size={20} />
            </button>
            
            {/* Forward 10s */}
            <button 
              onClick={() => handleSkip(10)}
              className={`text-white hover:text-primary-400 transition-colors ${!isHost && 'opacity-50 cursor-not-allowed'}`}
              disabled={!isHost}
            >
              <FastForward size={20} />
            </button>
            
            {/* Volume Controls */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white hover:text-primary-400 transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>
          
          {/* Right Controls */}
          <div>
            <button onClick={toggleFullscreen} className="text-white hover:text-primary-400 transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};