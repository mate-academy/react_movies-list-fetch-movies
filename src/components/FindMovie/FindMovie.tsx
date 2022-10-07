/* eslint-disable max-len */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setNewMoviesHandler: (param: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setNewMoviesHandler }) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const placeHolderImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(inputValue)
      .then(movie => {
        if (!('Error' in movie)) {
          setRequestError(false);

          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster === 'N/A' ? placeHolderImg : movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
        }

        if (('Error' in movie)) {
          setRequestError(true);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    setInputValue('');
    if (foundMovie) {
      setNewMoviesHandler(foundMovie);
    }

    setRequestError(false);
    setFoundMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmitHandler}

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
              autoComplete="off"
              className="input is-dander"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {requestError && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!inputValue}
            >
              Find a movie
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

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {foundMovie && <MovieCard movie={foundMovie} />}
      </div>
    </>
  );
};
