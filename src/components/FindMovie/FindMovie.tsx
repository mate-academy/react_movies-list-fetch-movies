import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

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
        .finally(() => setLoading(false));
    }
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
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
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
              className={cn('button', {
                'is-light': !loading,
                'is-loading': loading,
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
