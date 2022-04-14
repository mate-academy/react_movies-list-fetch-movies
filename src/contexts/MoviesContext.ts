import React from 'react';

type MoviesContextType = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const MoviesContext = React.createContext<MoviesContextType>({
  movies: [],
  setMovies: () => {},
});
