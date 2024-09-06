import React, { useMemo, useState } from 'react';
import { MovieData } from './types/MovieData';

interface MoviesContextProps {
  movieData: MovieData;
  setMovieData: React.Dispatch<React.SetStateAction<MovieData>>;
}

const initialMovie: MovieData = {
  Poster: '',
  Title: '',
  Plot: '',
  imdbID: '',
};

export const MoviesContext = React.createContext<MoviesContextProps>({
  movieData: initialMovie,
  setMovieData: () => {},
});

interface MoviesFindProps {
  findMovie: string;
  setFindMovie: React.Dispatch<React.SetStateAction<string>>;
}

export const FindContext = React.createContext<MoviesFindProps>({
  findMovie: '',
  setFindMovie: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const MoviesProvider: React.FC<Props> = ({ children }) => {
  const [movieData, setMovieData] = useState<MovieData>(initialMovie);
  const [findMovie, setFindMovie] = useState<string>('');

  const valueOfMovie = useMemo(
    () => ({
      movieData,
      setMovieData,
    }),
    [movieData],
  );
  const valueOfFind = useMemo(
    () => ({
      findMovie,
      setFindMovie,
    }),
    [findMovie],
  );

  return (
    <FindContext.Provider value={valueOfFind}>
      <MoviesContext.Provider value={valueOfMovie}>
        {children}
      </MoviesContext.Provider>
    </FindContext.Provider>
  );
};
