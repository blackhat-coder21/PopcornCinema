import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Clock, Heart, Settings, LogOut } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../store/user-store';
import { useRoomStore } from '../store/room-store';
import { useMovieStore } from '../store/movie-store';
import { getTimeAgo } from '../lib/utils';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserStore();
  const { myRooms } = useRoomStore();
  const { movies, ownedMovies } = useMovieStore();
  
  // Mock data for recently watched
  const recentlyWatched = [
    { id: 'movie_1', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: 'movie_8', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ];
  
  // Mock data for favorite movies
  const favoriteMovies = ['movie_3', 'movie_5'];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Not logged in</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your profile.</p>
        <Button onClick={() => navigate('/login')}>Log in</Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar 
            src={currentUser.avatar} 
            alt={currentUser.username}
            size="lg"
            status="online"
            className="w-24 h-24"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {currentUser.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentUser.email} • Joined {getTimeAgo(currentUser.joinDate)}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Settings size={16} />}
                onClick={() => navigate('/settings')}
              >
                Edit Profile
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                leftIcon={<LogOut size={16} />}
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{ownedMovies.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Movies</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{myRooms.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rooms</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{favoriteMovies.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Recently Watched */}
        <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-primary-600 dark:text-primary-400" />
              Recently Watched
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentlyWatched.map((item) => {
              const movie = movies.find(m => m.id === item.id);
              if (!movie) return null;
              
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Watched {getTimeAgo(item.timestamp)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/library`)}>
                    Watch
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Owned Movies */}
        <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Film size={20} className="text-primary-600 dark:text-primary-400" />
              Your Library
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {ownedMovies.map((movieId) => {
              const movie = movies.find(m => m.id === movieId);
              if (!movie) return null;
              
              return (
                <div key={movieId} className="flex items-center gap-3">
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {movie.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/library`)}>
                    Watch
                  </Button>
                </div>
              );
            })}
            
            {ownedMovies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No purchased movies yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Browse Movies
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Favorite Movies */}
        <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart size={20} className="text-primary-600 dark:text-primary-400" />
              Favorites
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {favoriteMovies.map((movieId) => {
              const movie = movies.find(m => m.id === movieId);
              if (!movie) return null;
              
              return (
                <div key={movieId} className="flex items-center gap-3">
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {movie.genres.join(', ')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/`)}>
                    Watch
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};