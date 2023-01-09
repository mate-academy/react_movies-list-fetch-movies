import { useEffect, useState } from 'react';
import type { MovieData } from '../types/MovieData';
import type { ResponseError } from '../types/ReponseError';
import { getMovie } from '../api';
import { Movie } from '../types/Movie';

export interface UseMovie {
  movie: Movie;
  isLoading: boolean;
  isError: boolean;
}

const isMovieData = (data: MovieData | ResponseError): data is MovieData => {
  return (data as MovieData).Title !== undefined;
};

export const movieDataToMovie = (
  movieData: MovieData | null,
): Movie => {
  return {
    title: movieData?.Title || '',
    description: movieData?.Plot || '',
    imgUrl:
      movieData?.Poster
      || 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${movieData?.imdbID}`,
    imdbId: movieData?.imdbID || '',
  };
};

export const useMovie = (query: string): UseMovie => {
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const movie = movieDataToMovie(movieData);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const data = await getMovie(query);

      if (isMovieData(data)) {
        setMovieData(data);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.length === 0) {
      return;
    }

    fetchData();
  }, [query]);

  return {
    movie,
    isLoading,
    isError,
  };
};
