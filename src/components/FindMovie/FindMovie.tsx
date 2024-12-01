import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setHasError(false);
    getMovie(query)
      .then(movie => {
        if ('Error' in movie) {
          setHasError(true);
        } else {
          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl:
              movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: movie.imdbID,
            imdbUrl: 'https://www.imdb.com/title/' + movie.imdbID,
          });
        }
      })

      .catch(() => {
        setHasError(true);
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (foundMovie) {
      onAdd(foundMovie);
    }

    setFoundMovie(null);
    setQuery('');
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
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleInputChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={query === ''}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
