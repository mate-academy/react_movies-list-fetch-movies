import React, {
  FC, createContext, useContext, useState,
} from 'react';
import { Movie } from '../types/Movie';

type Props = {
  children: React.ReactNode
};

type ContextType = {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
};

export const MoviesContext = createContext<ContextType>({
  movies: [],
  addMovie: () => undefined,
});

export const useMovies = () => useContext(MoviesContext);

export const MoviesProvider: FC<Props> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    setMovies(
      [...movies, movie],
    );
  };

  return (
    <MoviesContext.Provider value={{ movies, addMovie }}>
      {children}
    </MoviesContext.Provider>
  );
};
