import React, { useState } from 'react';
import { Movie } from './types/Movie';

type ContProps = {
  movie: Movie | undefined;
  setMovie: (mov: Movie | undefined) => void,
  isLoading: boolean;
  setIsLoading: (arg: boolean) => void,
};

export const MovieContext = React.createContext<ContProps>({
  movie: {} as Movie,
  setMovie: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const MovieProvider: React.FC<Props> = ({ children }) => {
  const [movie, setMovie] = useState<Movie>();
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    movie,
    setMovie,
    isLoading,
    setIsLoading,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
