import React from 'react';
import { Movie } from '../types/Movie';

type MoviesContextType = {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  foundMovie: Movie | null;
  setFoundMovie: (movie: Movie | null) => void;
};

export const MoviesContext = React.createContext<MoviesContextType | null>(
  null,
);

type Props = {
  children: React.ReactNode;
};

export const MoviesProvider: React.FC<Props> = ({ children }) => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = React.useState<Movie | null>(null);

  const addMovie = (movie: Movie) => {
    setMovies(prevMovies => [...prevMovies, movie]);
  };

  return (
    <MoviesContext.Provider
      value={{ movies, addMovie, foundMovie, setFoundMovie }}
    >
      {children}
    </MoviesContext.Provider>
  );
};
