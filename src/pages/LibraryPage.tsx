import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Clock, PlusSquare } from 'lucide-react';
import { useMovieStore } from '../store/movie-store';
import { useUserStore } from '../store/user-store';
import { useRoomStore } from '../store/room-store';
import { Button } from '../components/ui/Button';
import { Movie } from '../types';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { movies, ownedMovies } = useMovieStore();
  const { currentUser } = useUserStore();
  const { createRoom } = useRoomStore();
  
  const [activeTab, setActiveTab] = useState<'owned' | 'recent' | 'watchlist'>('owned');
  
  // Mock data for recently watched
  const recentlyWatched = [
    { id: 'movie_1', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: 'movie_8', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ];
  
  // Mock data for watchlist
  const watchlist = ['movie_2', 'movie_7'];
  
  const handleStartRoom = (movie: Movie) => {
    if (currentUser) {
      const room = createRoom(
        currentUser.id,
        movie.id,
        `${currentUser.username}'s Room`,
        false
      );
      navigate(`/rooms/${room.id}`);
    }
  };
  
  // Get movies based on active tab
  const getMoviesForTab = () => {
    switch (activeTab) {
      case 'owned':
        return movies.filter(movie => ownedMovies.includes(movie.id));
      case 'recent':
        return recentlyWatched.map(item => {
          const movie = movies.find(m => m.id === item.id);
          return movie ? { ...movie, watchedAt: item.timestamp } : null;
        }).filter(Boolean) as (Movie & { watchedAt: Date })[];
      case 'watchlist':
        return movies.filter(movie => watchlist.includes(movie.id));
      default:
        return [];
    }
  };
  
  const tabMovies = getMoviesForTab();
  
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Not logged in</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your library.</p>
        <Button onClick={() => navigate('/login')}>Log in</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Library</h1>
        
        <div className="flex space-x-1 bg-gray-100 dark:bg-dark-200 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'owned'
                ? 'bg-white dark:bg-dark-100 shadow text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('owned')}
          >
            Owned Movies
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'bg-white dark:bg-dark-100 shadow text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recently Watched
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-white dark:bg-dark-100 shadow text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watch Later
          </button>
        </div>
      </div>
      
      {tabMovies.length === 0 ? (
        <div className="bg-white dark:bg-dark-100 rounded-xl p-12 text-center shadow-md">
          <div className="flex justify-center mb-4">
            {activeTab === 'owned' && <Film size={48} className="text-gray-400" />}
            {activeTab === 'recent' && <Clock size={48} className="text-gray-400" />}
            {activeTab === 'watchlist' && <PlusSquare size={48} className="text-gray-400" />}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {activeTab === 'owned' && "You don't own any movies yet"}
            {activeTab === 'recent' && "You haven't watched any movies recently"}
            {activeTab === 'watchlist' && "Your watch list is empty"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {activeTab === 'owned' && "Purchase premium movies to add them to your collection."}
            {activeTab === 'recent' && "Start watching movies to see your history here."}
            {activeTab === 'watchlist' && "Add movies you want to watch later to your list."}
          </p>
          <Button onClick={() => navigate('/')}>
            Browse Movies
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tabMovies.map((movie) => (
            <div key={movie.id} className="bg-white dark:bg-dark-100 rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
              <div className="relative h-48">
                <img 
                  src={movie.thumbnailUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>{movie.releaseYear}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex flex-wrap gap-1 mb-4">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                
                {'watchedAt' in movie && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Watched {new Date(movie.watchedAt).toLocaleDateString()}
                  </p>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleStartRoom(movie)}
                  >
                    Start Watch Party
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};