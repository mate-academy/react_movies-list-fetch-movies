import React, { useState } from 'react';
import cn from 'classnames';

import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

import './FindMovie.scss';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

const DEFAULT_PICTURE
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

const getImgUrl = (url: string) => {
  return url === 'N/A'
    ? DEFAULT_PICTURE
    : url;
};

const normalizedMovie = ({
  Title,
  Plot,
  Poster,
  imdbID,
}: MovieData) => {
  return {
    title: Title,
    description: Plot,
    imgUrl: getImgUrl(Poster),
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((movieData) => ('imdbID' in movieData
        ? setMovie(movieData)
        : setIsError(true)))
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = (newMovie: Movie) => {
    if (!movies.find((m) => m.imdbId === newMovie.imdbId)) {
      setMovies([...movies, newMovie]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': isError,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(normalizedMovie(movie))}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={normalizedMovie(movie)} />
        </div>
      )}
    </>
  );
};
