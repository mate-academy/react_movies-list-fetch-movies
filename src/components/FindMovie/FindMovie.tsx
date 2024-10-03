import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (val: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasError(false);
  };

  const handleFind = () => {
    // setFoundMovie(null);
    setLoading(true);
    getMovie(query)
      .then(movie => {
        if ('Error' in movie) {
          setHasError(true);
        } else {
          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster
              ? movie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: 'https://www.imdb.com/title/' + movie.imdbID + '/',
            imdbId: movie.imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (foundMovie) {
      onAdd(foundMovie);
    }

    setFoundMovie(null);
    setQuery('');
  };

  useEffect(() => {
    const enterEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && query !== '') {
        handleFind();
      }
    };

    window.addEventListener('keypress', enterEvent);

    return () => {
      window.removeEventListener('keypress', enterEvent);
    };
  }, []);

  return (
    <>
      <form className="find-movie">
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
              onChange={handleQuery}
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
              type="button"
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              onClick={handleFind}
              disabled={query === ''}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="submit"
                className="button is-primary"
                onClick={handleAdd}
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
          {<MovieCard movie={foundMovie} />}
        </div>
      )}
    </>
  );
};
