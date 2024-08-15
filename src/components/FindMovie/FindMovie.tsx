import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { transformData } from '../../services';
import classNames from 'classnames';

type Props = {
  onAdd?: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd = () => {} }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const onHandleSubmit = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();
    setLoading(true);

    getMovie(query.trim()).then(res => {
      setLoading(false);
      setError(false);
      if (transformData(res)) {
        setFindedMovie(transformData(res));

        return;
      }

      setError(true);
    });
  };

  const onAddingFilm = () => {
    if (findedMovie) {
      onAdd(findedMovie);
    }

    setQuery('');
    setFindedMovie(null);
  };

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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={eve => {
                setQuery(eve.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query.length}
              onClick={onHandleSubmit}
            >
              {findedMovie !== null ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddingFilm}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
