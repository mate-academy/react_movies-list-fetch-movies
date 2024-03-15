import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [query, setQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    setTimeout(() => {
      getMovie(query)
        .then(data => {
          if ('Error' in data) {
            setErrorMessage(true);
          } else {
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster !== 'N/A'
                  ? data.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
          }
        })
        .finally(() => setLoading(false));
    }, 300);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setQuery('');
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(false);
    setQuery(event.target.value);
  };

  const handleOnAdd = (newMovie: Movie) => {
    addMovie(newMovie);
    setQuery('');
    setMovie(undefined);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmit}>
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
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={onInputChange}
              onKeyUp={handleKeyUp}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
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
                onClick={() => handleOnAdd(movie)}
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
