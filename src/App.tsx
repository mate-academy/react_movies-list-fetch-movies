import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useState,
} from 'react';

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
  const [query, setQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const onChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    if (isError) {
      setError(false);
    }

    setQuery(e.target.value);
  };

  const onFindMovie = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (movie) {
      setMovie(null);
    }

    setLoading(true);

    try {
      const request = await getMovie(query);

      if ('Error' in request) {
        setError(true);
      } else {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        }: MovieData = request;

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

  const onAddMovie = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isSameMovie = movies.some(listMovie => {
      return listMovie.imdbId === movie?.imdbId;
    });

    if (movie && !isSameMovie) {
      setMovies(currMovies => ([
        ...currMovies,
        movie,
      ]));
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onChangeQuery={onChangeQuery}
          onFindMovie={onFindMovie}
          movie={movie}
          isLoading={isLoading}
          isError={isError}
          onAddMovie={onAddMovie}
        />
      </div>
    </div>
  );
};
