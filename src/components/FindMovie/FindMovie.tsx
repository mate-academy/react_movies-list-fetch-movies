import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie, normaliseMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie?: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie = () => {} }) => {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState('');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchClick, setSearchClick] = useState(false);

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);
    setValue(newValue);
    setTitleError(false);
  };

  const searchMovie = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    setSearchClick(true);

    getMovie(query)
      .then(result => {
        if (!('Error' in result)) {
          setPreview(true);
          setMovie(normaliseMovie(result));
        } else {
          setTitleError(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const addMovieFunction = () => {
    if (movie) {
      addMovie(movie);
    }

    setValue('');
    setQuery('');
    setPreview(false);
    setSearchClick(false);
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
              value={value}
              onChange={event => {
                inputChange(event);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': titleError })}
            />
          </div>

          {titleError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              onClick={e => {
                searchMovie(e);
              }}
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!value}
            >
              {!loading && !searchClick && 'Find a movie'}
              {!loading && searchClick && 'Search again'}
            </button>
          </div>

          <div className="control">
            {preview && (
              <button
                data-cy="addButton"
                type="button"
                onClick={() => {
                  addMovieFunction();
                }}
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {preview && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
