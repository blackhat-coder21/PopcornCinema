import React from 'react';
import { Play, Heart, Plus, DollarSign } from 'lucide-react';
import { cn, formatCurrency, formatDuration } from '../../lib/utils';
import { Movie } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  onWatch: (movie: Movie) => void;
  onAddToWatchlist?: (movie: Movie) => void;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onWatch,
  onAddToWatchlist,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn('movie-card group h-[280px] md:h-[320px]', className)}
    >
      <img
        src={movie.thumbnailUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      
      <div className="movie-card-overlay flex flex-col justify-between p-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-1">
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="secondary" size="sm">
                {genre}
              </Badge>
            ))}
          </div>
          
          <Badge variant={movie.isPremium ? 'premium' : 'free'} size="sm">
            {movie.isPremium 
              ? <span className="flex items-center gap-0.5"><DollarSign size={12} /> {formatCurrency(movie.price!)}</span> 
              : 'Free'}
          </Badge>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-xl font-semibold text-white group-hover:text-primary-300 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center text-gray-300 text-sm mt-1">
            <span>{movie.releaseYear}</span>
            <span className="mx-2">•</span>
            <span>{formatDuration(movie.duration)}</span>
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
          
          <div className="flex mt-3 space-x-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onWatch(movie)}
              leftIcon={<Play size={16} />}
              className="flex-1"
            >
              {movie.isPremium ? 'Buy & Watch' : 'Watch Now'}
            </Button>
            
            {onAddToWatchlist && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddToWatchlist(movie)}
                className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
              >
                <Plus size={16} />
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              <Heart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};