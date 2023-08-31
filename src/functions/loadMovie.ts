import React from 'react';
import { getMovie } from '../api';
import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

const defaultPic
= 'https://dummyimage.com/360x270/e3e3e3/000000&text=no+preview';

interface Arguments {
  queryTitle: string;
  setMovieFoundError: React.Dispatch<React.SetStateAction<boolean>>;
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  setIsFindingAgain: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMovieWasAskedOnce: React.Dispatch<React.SetStateAction<boolean>>;
}

export const loadMovie = (propsAndSetters: Arguments) => {
  const {
    queryTitle,
    setMovieFoundError,
    setMovie,
    setIsFindingAgain,
    setIsLoading,
    setMovieWasAskedOnce,
  } = propsAndSetters;

  setIsLoading(true);

  getMovie(queryTitle.trim())
    .catch(() => setMovieFoundError(true))
    .then(movieFromServer => {
      const { Response } = movieFromServer as ResponseError;

      if (Response !== 'False') {
        const {
          Title, Poster, Plot, imdbID,
        } = movieFromServer as MovieData;

        const newMovie: Movie = {
          title: Title,
          imgUrl: Poster || defaultPic,
          description: Plot,
          imdbId: imdbID,
          imdbUrl: imdbID ? `https://www.imdb.com/title/${imdbID}` : defaultPic,
        };

        setMovie(newMovie);
      } else {
        setMovieFoundError(true);
        setIsFindingAgain(false);
        setMovie(null);
      }

      setIsLoading(false);
      setMovieWasAskedOnce(true);
    });
};
