import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorMessage(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (query) {
      setErrorMessage(false);

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
        .catch(() => setErrorMessage(true))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
            <>
              <p
                className="help is-danger"
                data-cy="errorMessage"
              >
                Can&apos;t find a movie with such a title
              </p>
              <br />
            </>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
