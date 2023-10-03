import React, { useState, useMemo } from 'react';
import { Movie } from '../types/Movie';

export const MoviesContect = React.createContext<{
  movies: Movie[] | null;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}>({
  movies: [],
  setMovies: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const MoviesProvider: React.FC<Props> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const value = useMemo(() => ({
    movies,
    setMovies,
  }), [movies]);

  return (
    <MoviesContect.Provider value={value}>
      {children}
    </MoviesContect.Provider>
  );
};
