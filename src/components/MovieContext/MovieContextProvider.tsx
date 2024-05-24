import { Movie } from '../../types/Movie';
import React, { useState } from 'react';

interface MovieType {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

export const MovieContext = React.createContext<MovieType>({
  movies: [],
  setMovies: () => {},
});

export const MovieContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [movies, setMoviesM] = useState<Movie[]>([]);

  return (
    <MovieContext.Provider
      value={{
        movies: movies,
        setMovies: m => setMoviesM(m),
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
