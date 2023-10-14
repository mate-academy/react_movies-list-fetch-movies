import { createContext, useState } from 'react';
import { Movie } from '../types/Movie';

export const movieContext = createContext<ContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export type ContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  fetchedMovie: Movie | null;
  setFetchedMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const AppContext: React.FC<Props> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [fetchedMovie, setFetchedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const states: ContextType = {
    query,
    setQuery,
    fetchedMovie,
    setFetchedMovie,
    movies,
    setMovies,
  };

  return (
    <movieContext.Provider value={{ ...states }}>
      {children}
    </movieContext.Provider>
  );
};
