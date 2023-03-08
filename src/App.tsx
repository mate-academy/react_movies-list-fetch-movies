import { useState } from 'react';

import './App.scss';

import {
  BASE_IMDB_URL,
  getMovie,
  emptyImg,
} from './api';

import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const onFindMovie = async (query: string) => {
    if (movie) {
      setMovie(null);
    }

    setLoading(true);

    try {
      const response = await getMovie(query);

      if ('Error' in response) {
        setError(true);
      } else {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        }: MovieData = response;

        const foundMovie: Movie = {
          title: Title,
          description: Plot,
          imgUrl: Poster !== 'N/A'
            ? Poster
            : emptyImg,
          imdbUrl: BASE_IMDB_URL + imdbID,
          imdbId: imdbID,
        };

        setMovie(foundMovie);
      }
    } catch (error) {
      throw new Error('Error');
    } finally {
      setLoading(false);
    }
  };

  const onAddMovie = () => {
    const isSameMovie = movies.some(listMovie => {
      return listMovie.imdbId === movie?.imdbId;
    });

    if (movie && !isSameMovie) {
      setMovies(currMovies => ([
        ...currMovies,
        movie,
      ]));
    }

    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          onFindMovie={onFindMovie}
          onAddMovie={onAddMovie}
          isLoading={isLoading}
          isError={isError}
          changeLoading={setLoading}
          changeError={setError}
        />
      </div>
    </div>
  );
};
