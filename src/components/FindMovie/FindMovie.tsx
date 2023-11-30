import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (m: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(response  => {
        if ('imdbID' in response
          && 'Title' in response
          && 'Plot' in response
          && 'Poster' in response ) {
          const newMovie: Movie = {
            imdbId: response.imdbID,
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          };

          setMovie(newMovie);
        }

        if ('Error' in response) {
          setErrorMessage(response.Error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              onChange={event => {
                setQuery(event.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
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
              disabled={!query}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
