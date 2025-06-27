import { useState } from 'react';
import { getMovie } from '../api';
import { MovieData } from '../types/MovieData';
import { Movie } from '../types/Movie';

export const useMovie = () => {
  const [preMovie, setPreMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  function getNormalMovie(movieFromServer: MovieData): Movie {
    const normalMovie = {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl:
        movieFromServer.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    };

    return normalMovie;
  }

  const clearError = () => setIsError(false);

  async function getMovieFromServer(title: string) {
    setIsLoading(true);
    setIsError(false);

    try {
      const movie = await getMovie(title);

      if ('Error' in movie) {
        setPreMovie(null);
        setIsError(true);
      } else {
        const normalizeMovie = getNormalMovie(movie);

        setPreMovie(normalizeMovie);
      }
    } catch {
      setPreMovie(null);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    getMovieFromServer,
    preMovie,
    isError,
    isLoading,
    clearError,
    setPreMovie,
  };
};
