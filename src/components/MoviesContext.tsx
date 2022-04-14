import {
  createContext, Dispatch, FC, SetStateAction, useState,
} from 'react';

interface MoviesContextInterface {
  query: string,
  setQuery: Dispatch<SetStateAction<string>>,
  foundMovie: Movie | null,
  setFoundMovie: Dispatch<SetStateAction<Movie | null>>,
  storedMovies: Movie[],
  setStoredMovies: Dispatch<SetStateAction<Movie[]>>,
  searchError: boolean,
  setSearchError: Dispatch<SetStateAction<boolean>>,
}

export const MoviesContext = createContext<MoviesContextInterface>({
  query: '',
  setQuery: () => {},
  foundMovie: null,
  setFoundMovie: () => {},
  storedMovies: [],
  setStoredMovies: () => {},
  searchError: false,
  setSearchError: () => {},
});

export const MoviesProvider: FC = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [storedMovies, setStoredMovies] = useState<Movie[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  const contextValues = {
    query,
    setQuery,
    foundMovie,
    setFoundMovie,
    storedMovies,
    setStoredMovies,
    searchError,
    setSearchError,
  };

  return (
    <MoviesContext.Provider value={contextValues}>
      {children}
    </MoviesContext.Provider>
  );
};
