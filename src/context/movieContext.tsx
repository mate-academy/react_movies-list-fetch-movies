/* eslint-disable no-delete-var */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-useless-return */
/* eslint-disable no-prototype-builtins */
import React, { createContext, useState } from 'react';
import { Movie } from '../types/Movie';
import { getMovie } from '../api';
import { MovieData } from '../types/MovieData';

const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  children: React.ReactNode;
};

interface MovieContextType {
  movie: Movie | null;
  inputValue: string;
  changeInputValue: (str: string) => void;
  isLoadingMovie: boolean;
  isError: boolean;
  searchMovie: (movieName: string) => void;
  movies: Movie[] | [];
  addMovie: (nextMovie: Movie) => void;
  reset: () => void;
}

export const MovieContext = createContext<MovieContextType>({
  movie: null,
  inputValue: '',
  changeInputValue: () => {},
  isLoadingMovie: false,
  isError: false,
  searchMovie: () => {},
  reset: () => {},
  addMovie: () => {},
  movies: [],
});

export const MovieProvider: React.FC<Props> = ({ children }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const changeInputValue = (str: string) => {
    setIsError(false);
    setInputValue(str);
  };

  const searchMovie = async (movieName: string) => {
    setIsLoadingMovie(true);
    try {
      const responce = await getMovie(movieName);

      if (responce.hasOwnProperty('Error')) {
        setIsError(true);

        return;
      }

      const currentMovie = responce as MovieData;

      const imgUrl
        = currentMovie.Poster !== 'N/A' ? currentMovie.Poster : defaultImg;
      const imdbUrl = `https://www.imdb.com/title/${currentMovie.imdbID}`;

      setMovie({
        title: currentMovie.Title,
        description: currentMovie.Plot,
        imgUrl,
        imdbUrl,
        imdbId: currentMovie.imdbID,
      });
    } catch {
      setIsError(true);
    } finally {
      setIsLoadingMovie(false);
    }
  };

  const reset = () => {
    setInputValue('');
    setMovie(null);
  };

  const addMovie = (nextMovie: Movie) => {
    setMovies((prevMovies) => {
      const isMovieAlreadyAdded = prevMovies.some(
        (checkMovie) => checkMovie.imdbId === nextMovie.imdbId,
      );

      if (isMovieAlreadyAdded) {
        return prevMovies;
      }

      return [...prevMovies, nextMovie];
    });

    reset();
  };

  const value = {
    movie,
    inputValue,
    changeInputValue,
    isLoadingMovie,
    isError,
    searchMovie,
    reset,
    movies,
    addMovie,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
