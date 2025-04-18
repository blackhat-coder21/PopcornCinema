import { create } from 'zustand';
import { Movie } from '../types';

interface MovieState {
  movies: Movie[];
  ownedMovies: string[]; // IDs of movies owned by the user
  loadMovies: (movies: Movie[]) => void;
  addOwnedMovie: (movieId: string) => void;
  isMovieOwned: (movieId: string) => boolean;
  getMovieById: (id: string) => Movie | undefined;
  filterMovies: (query: string, filters: MovieFilters) => Movie[];
}

export interface MovieFilters {
  genre?: string;
  language?: string;
  isPremium?: boolean;
  minRating?: number;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  ownedMovies: [],
  loadMovies: (movies) => set({ movies }),
  addOwnedMovie: (movieId) =>
    set((state) => ({
      ownedMovies: [...state.ownedMovies, movieId],
    })),
  isMovieOwned: (movieId) => get().ownedMovies.includes(movieId),
  getMovieById: (id) => get().movies.find((movie) => movie.id === id),
  filterMovies: (query, filters) => {
    const { movies } = get();
    return movies.filter((movie) => {
      // Search by title
      const matchesQuery =
        query === '' ||
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase());

      // Apply filters
      const matchesGenre =
        !filters.genre || movie.genres.includes(filters.genre);
      const matchesLanguage =
        !filters.language || movie.language === filters.language;
      const matchesPremium =
        filters.isPremium === undefined || movie.isPremium === filters.isPremium;
      const matchesRating =
        !filters.minRating || movie.rating >= filters.minRating;

      return (
        matchesQuery &&
        matchesGenre &&
        matchesLanguage &&
        matchesPremium &&
        matchesRating
      );
    });
  },
}));