import React, { useContext, useMemo, useState } from 'react';

import { Movie } from '../types/Movie';
import { InitialState } from '../types/InitialState';

const initialValue: InitialState = [
  [],
  () => {},
];

const MoviesContext = React.createContext(initialValue);

type Props = {
  children: React.ReactNode,
};

export const MoviesContextProvider: React.FC<Props> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const value: InitialState = useMemo(() => [
    movies,
    setMovies,
  ], [movies, setMovies]);

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);
