import React, { useCallback, useMemo, useState } from 'react';
import { MovieData } from '../../types/MovieData';

export const MovieContext = React.createContext<{
  query: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
  onAddMovies: React.Dispatch<React.SetStateAction<MovieData>>,
  movies: MovieData[],
}>({
  query: '',
  setQuery: () => { },
  movies: [],
  onAddMovies: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<MovieData[]>([]);

  const onAddMovies = useCallback((newMovie) => {
    setMovies(prevMovies => {
      const exists = prevMovies.some(
        (movie) => movie.imdbID === newMovie.imdbID,
      );

      if (exists) {
        return prevMovies;
      }

      return [...prevMovies, newMovie];
    });
  }, []);

  const value = useMemo(() => ({
    query,
    setQuery,
    movies,
    onAddMovies,
  }), [query, movies, onAddMovies]);

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
