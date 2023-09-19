import React, { useState } from 'react';
import { Movie } from '../../types/Movie';

interface Context {
  movies: Movie[],
  handleNewFilm: (newFilm: Movie) => void,
}

export const MovieContext = React.createContext<Context>({
  movies: [],
  handleNewFilm: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const MoviesProvider: React.FC<Props> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleNewFilm = (newFilm: Movie) => {
    setMovies((prevMovies) => [...prevMovies, newFilm]);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        handleNewFilm,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
