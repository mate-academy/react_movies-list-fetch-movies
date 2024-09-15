import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie:(film: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    if (query) {
      setHasError(false);

      getMovie(query)
        .then(response => {
          if (Object.hasOwn(response, 'Error')) {
            throw new Error();
          }

          const newMovie = response as MovieData;

          setMovie({
            title: newMovie.Title || 'No title',
            description: newMovie.Plot || 'No description',
            imgUrl: newMovie.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : newMovie.Poster,
            imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
            imdbId: newMovie.imdbID,
          });
        })
        .catch(() => setHasError(true))
        .finally(() => setLoading(false));
    }
  };

  const handleMovieAdd = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleChangeQuery}
              autoComplete="off"
            />
          </div>
          {hasError && (
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
              className={classNames('button', {
                'is-light': !loading,
                'is-loading': loading,
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
                onClick={handleMovieAdd}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
