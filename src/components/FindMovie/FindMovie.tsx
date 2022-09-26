import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

// eslint-disable-next-line max-len
const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAddMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [requestError, setRequestError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setRequestError(false);
  };

  const handleAddMovie = () => {
    if (newMovie) {
      onAddMovie(newMovie);
    }

    setQuery('');
    setNewMovie(null);
  };

  const handleSirchMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(movieData => {
        if (movieData.Response === 'True') {
          setRequestError(false);
          const pictureUrl = movieData.Poster === 'N/A'
            ? defaultPicture
            : movieData.Poster;

          setNewMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: pictureUrl,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        }

        if (movieData.Response === 'False') {
          setRequestError(true);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSirchMovie}
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
              onChange={handleChangeQuery}
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
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {newMovie && (
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

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
