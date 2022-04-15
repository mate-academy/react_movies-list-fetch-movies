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
  checkIfStored: (array: Movie[], element: Movie) => boolean | void,
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
  checkIfStored: () => {},
});

export const MoviesProvider: FC = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [storedMovies, setStoredMovies] = useState<Movie[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  const checkIfStored = (array: Movie[], element: Movie) => {
    const index = array.findIndex(item => item.imdbID === element.imdbID);

    if (index === -1) {
      return false;
    }

    return true;
  };

  const contextValues = {
    query,
    setQuery,
    foundMovie,
    setFoundMovie,
    storedMovies,
    setStoredMovies,
    searchError,
    setSearchError,
    checkIfStored,
  };

  return (
    <MoviesContext.Provider value={contextValues}>
      {children}
    </MoviesContext.Provider>
  );
};
