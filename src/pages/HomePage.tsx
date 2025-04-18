import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCatalog } from '../components/movies/MovieCatalog';
import { MoviePurchaseModal } from '../components/purchase/MoviePurchaseModal';
import { useMovieStore } from '../store/movie-store';
import { useUserStore } from '../store/user-store';
import { useRoomStore } from '../store/room-store';
import { Movie } from '../types';
import { Film, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { movies, addOwnedMovie } = useMovieStore();
  const { currentUser } = useUserStore();
  const { createRoom } = useRoomStore();
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const freeMovies = movies.filter(movie => !movie.isPremium);
  const premiumMovies = movies.filter(movie => movie.isPremium);
  
  const handleWatchMovie = (movie: Movie) => {
    if (movie.isPremium) {
      // Show purchase modal for premium movies
      setSelectedMovie(movie);
      setShowPurchaseModal(true);
    } else {
      // Create a room with the selected movie
      if (currentUser) {
        const room = createRoom(
          currentUser.id,
          movie.id,
          `${currentUser.username}'s Room`,
          false
        );
        navigate(`/rooms/${room.id}`);
      }
    }
  };
  
  const handlePurchase = (paymentMethod: string, splitPayment: boolean) => {
    // In a real app, this would process the payment
    if (selectedMovie) {
      addOwnedMovie(selectedMovie.id);
      setShowPurchaseModal(false);
      
      // Create a room with the purchased movie
      if (currentUser) {
        const room = createRoom(
          currentUser.id,
          selectedMovie.id,
          `${currentUser.username}'s Room`,
          false
        );
        navigate(`/rooms/${room.id}`);
      }
    }
  };
  
  const handleAddToWatchlist = (movie: Movie) => {
    // In a real app, this would add to user's watchlist
    console.log('Added to watchlist:', movie.title);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12">
        <img 
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Watch movies with friends" 
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent flex items-center">
          <div className="p-8 md:p-12 max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Watch Movies Together, Anywhere
            </h1>
            <p className="text-lg text-gray-200 mb-6">
              Synchronize movies with friends, chat in real-time, and create the perfect movie night experience.
            </p>
            <Button
              size="lg"
              leftIcon={<Plus size={20} />}
              onClick={() => navigate('/rooms')}
            >
              Create Watch Party
            </Button>
          </div>
        </div>
      </div>
      
      {/* Free Movies Section */}
      <section>
        <MovieCatalog
          title="🎥 Free to Watch"
          movies={freeMovies}
          onWatchMovie={handleWatchMovie}
          onAddToWatchlist={handleAddToWatchlist}
        />
      </section>
      
      {/* Premium Movies Section */}
      <section className="mt-12">
        <MovieCatalog
          title="💰 Premium Movies"
          movies={premiumMovies}
          onWatchMovie={handleWatchMovie}
          onAddToWatchlist={handleAddToWatchlist}
        />
      </section>
      
      {/* Purchase Modal */}
      {showPurchaseModal && selectedMovie && (
        <MoviePurchaseModal
          movie={selectedMovie}
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};