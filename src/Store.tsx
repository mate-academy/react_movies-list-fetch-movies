import React, { useState } from 'react';
import { Movie } from './types/Movie';

type Value = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

type Props = {
  children: React.ReactNode;
};

const initialValue: Value = {
  movies: [],
  setMovies: () => {},
};

export const moviesContext = React.createContext(initialValue);

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const value: Value = {
    movies,
    setMovies,
  };

  return (
    <moviesContext.Provider value={value}>{children}</moviesContext.Provider>
  );
};
