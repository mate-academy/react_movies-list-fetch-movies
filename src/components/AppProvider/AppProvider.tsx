import React, { useState, useMemo } from 'react';
import { Movie } from '../../types/Movie';

type Context = {
  movies: Movie[],
  setMovies: (newMovies: Movie[]) => void,
  query: string,
  setQuery: (newQuery: string) => void,
  movie: Movie | null,
  setMovie: (newMovie: Movie | null) => void,
  isMovieExist: boolean,
  setIsMovieExist: (newCheck: boolean) => void,
  isSearch: boolean,
  setIsSearch: (newStatus: boolean) => void,
};

export const AppContext = React.createContext<Context>({
  movies: [],
  setMovies: () => {},
  query: '',
  setQuery: () => {},
  movie: null,
  setMovie: () => {},
  isMovieExist: false,
  setIsMovieExist: () => {},
  isSearch: false,
  setIsSearch: () => {},
});

export const AppProvider: React.FC = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieExist, setIsMovieExist] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const contextValue = useMemo(() => ({
    movies,
    setMovies,
    query,
    setQuery,
    movie,
    setMovie,
    isMovieExist,
    setIsMovieExist,
    isSearch,
    setIsSearch,
  }),
  [
    movies,
    query,
    movie,
    isMovieExist,
    isSearch,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
