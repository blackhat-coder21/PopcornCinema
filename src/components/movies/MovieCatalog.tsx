import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Movie } from '../../types';
import { MovieCard } from './MovieCard';
import { MovieFilters } from '../../store/movie-store';

interface MovieCatalogProps {
  title: string;
  movies: Movie[];
  onWatchMovie: (movie: Movie) => void;
  onAddToWatchlist?: (movie: Movie) => void;
}

export const MovieCatalog: React.FC<MovieCatalogProps> = ({
  title,
  movies,
  onWatchMovie,
  onAddToWatchlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MovieFilters>({});
  
  // Extract unique genres from all movies
  const genres = [...new Set(movies.flatMap(movie => movie.genres))];
  
  // Extract unique languages from all movies
  const languages = [...new Set(movies.map(movie => movie.language))];
  
  const filteredMovies = movies.filter(movie => {
    // Search filter
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Genre filter
    const matchesGenre = !filters.genre || movie.genres.includes(filters.genre);
    
    // Language filter
    const matchesLanguage = !filters.language || movie.language === filters.language;
    
    // Premium filter
    const matchesPremium = 
      filters.isPremium === undefined || 
      movie.isPremium === filters.isPremium;
    
    // Rating filter
    const matchesRating = 
      !filters.minRating || movie.rating >= filters.minRating;
    
    return matchesSearch && matchesGenre && matchesLanguage && matchesPremium && matchesRating;
  });

  const handleFilterChange = (key: keyof MovieFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">{title}</h2>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4 py-2 w-full md:w-64"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-dark-100 rounded-lg shadow-md animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value || undefined)}
                className="input w-full"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
              <select
                value={filters.language || ''}
                onChange={(e) => handleFilterChange('language', e.target.value || undefined)}
                className="input w-full"
              >
                <option value="">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={filters.isPremium === undefined ? '' : filters.isPremium ? 'premium' : 'free'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'premium') {
                    handleFilterChange('isPremium', true);
                  } else if (value === 'free') {
                    handleFilterChange('isPremium', false);
                  } else {
                    handleFilterChange('isPremium', undefined);
                  }
                }}
                className="input w-full"
              >
                <option value="">All</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Rating</label>
              <select
                value={filters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                className="input w-full"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+</option>
                <option value="4">4+</option>
                <option value="3.5">3.5+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No movies found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWatch={onWatchMovie}
              onAddToWatchlist={onAddToWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};