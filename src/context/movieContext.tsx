import React, { useState } from 'react';
import { Movie } from '../types/Movie';
import { getMovie } from '../api';
import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

type MovieContextType = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  movieData: MovieData | null;
  setMovieData: React.Dispatch<React.SetStateAction<MovieData | null>>;
  movieIsFound: boolean;
  setMovieIsFound: React.Dispatch<React.SetStateAction<boolean>>;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddToList: (movie: Movie) => void;
  submitSearch: () => void;
};

export const MovieContext = React.createContext<MovieContextType>({
  movies: [],
  setMovies: () => {},
  query: '',
  setQuery: () => {},
  movieData: null,
  setMovieData: () => {},
  movieIsFound: false,
  setMovieIsFound: () => {},
  hasError: false,
  setHasError: () => {},
  isLoading: false,
  setIsLoading: () => {},
  handleSearch: () => {},
  handleAddToList: () => {},
  submitSearch: () => {},
});

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = React.useState('');
  const [movieData, setMovieData] = React.useState<MovieData | null>(null);
  const [movieIsFound, setMovieIsFound] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const submitSearch = () => {
    setIsLoading(true);
    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ((data as ResponseError).Response === 'False') {
          throw new Error((data as ResponseError).Error);
        }

        setMovieData(data as MovieData);
        setMovieIsFound(true);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddToList = (movie: Movie) => {
    const sameMovieFound = movies.some(m => m.imdbId === movie.imdbId);

    if (!sameMovieFound) {
      setMovies([...movies, movie]);
    }

    setQuery('');
    setMovieIsFound(false);
    setMovieData(null);
  };

  const value = {
    movies,
    setMovies,
    query,
    setQuery,
    movieData,
    setMovieData,
    movieIsFound,
    setMovieIsFound,
    hasError,
    setHasError,
    isLoading,
    setIsLoading,
    handleSearch,
    handleAddToList,
    submitSearch,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
