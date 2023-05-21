import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { convertDataIntoMovie } from '../Convertation';
import { MovieCard } from '../MovieCard/MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<MovieData | null>(null);
  const [errorValue, setErrorValue] = useState('');

  const sendQuery = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsMovieLoading(true);

    getMovie(query).then((response: MovieData | ResponseError) => {
      if ('Title' in response) {
        setResult(response);
      } else {
        setError(true);
        setErrorValue(response.Error);
      }
    })
      .finally(() => setIsMovieLoading(false));
  };

  const reset = () => {
    setQuery('');
    setResult(null);
  };

  const isDisabled = query.trim();

  const addToMovieList = () => {
    if (result) {
      addMovie(convertDataIntoMovie(result));
      reset();
    }
  };

  useEffect(() => {
    setError(false);
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={sendQuery}>
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
              className={classNames('input',
                { 'is-danger': error })}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorValue}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': isMovieLoading })}
              disabled={!isDisabled}
            >
              Find a movie
            </button>
          </div>

          {result && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToMovieList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {result && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={convertDataIntoMovie(result)} />
        </div>
      )}
    </>
  );
};
