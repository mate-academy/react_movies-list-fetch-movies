import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (item: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestError, setIsRequestError] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const placeHolderImg
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(movie => {
        if (!('Error' in movie)) {
          setIsRequestError(false);
          setIsErrorMessage(false);

          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster === 'N/A' ? placeHolderImg : movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
        } else {
          setIsRequestError(true);
          setIsErrorMessage(true);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleMovie = () => {
    setQuery('');
    if (foundMovie) {
      addMovie(foundMovie);
    }

    setIsRequestError(false);
    setFoundMovie(null);
    setIsErrorMessage(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsErrorMessage(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-dander"
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {(isRequestError && isErrorMessage) && (
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
              disabled={!query}
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
                onClick={handleMovie}
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
