import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

interface Props {
  onAddMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [inputValue, setinputValue] = useState('');
  const [, setIsFocused] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setErrorMessage(true);
      setMovie(null);

      return;
    }

    if (inputValue.trim() !== '' || movie === null) {
      setIsLoading(true);

      getMovie(inputValue)
        .then(response => {
          if ('Error' in response) {
            setErrorMessage(true);
            setError(response.Error);
          } else {
            setErrorMessage(false);
            setMovie({
              title: response.Title || '',
              description: response.Plot || '',
              imgUrl:
                response.Poster !== 'N/A'
                  ? response.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
              imdbId: response.imdbID || '',
            });
          }
        })
        .catch(() => {
          setMovie(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setinputValue(event.target.value);
    setErrorMessage(false);
  };

  const handleAddMovie = () => {
    setinputValue('');

    if (movie) {
      onAddMovie(movie);
      setMovie(null);
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
              // className="input is-danger"
              className="input"
              value={inputValue}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleInputChange}
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
                'is-loading': isLoading,
              })}
              disabled={inputValue.trim() === ''}
            >
              {movie === null ? `Find a movie` : `Search again`}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
