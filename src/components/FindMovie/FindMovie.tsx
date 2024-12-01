import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
<<<<<<< HEAD
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
=======
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
<<<<<<< HEAD
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [query, setQuery] = useState<string>('');

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
=======
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMessage, setIsErrorMesage] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
    event.preventDefault();

    if (query) {
      setIsLoading(true);

      getMovie(query)
        .then((res) => {
          if ('Error' in res) {
            throw new Error();
          }

          setMovie({
            title: res.Title,
            description: res.Plot,
            imgUrl: res.Poster !== 'N/A'
              ? res.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          });
        })
<<<<<<< HEAD
        .catch(() => setIsErrorMessage(true))
=======
        .catch(() => setIsErrorMesage(true))
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
        .finally(() => setIsLoading(false));
    }

    setQuery('');
  };

<<<<<<< HEAD
  const handleCahngeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsErrorMessage(false);
=======
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsErrorMesage(false);
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
<<<<<<< HEAD
        onSubmit={handleSubmitForm}
=======
        onSubmit={handleSubmit}
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
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
              value={query}
              onChange={handleCahngeQuery}
              placeholder="Enter a title to search"
<<<<<<< HEAD
              className={classNames('input', { 'is-danger': isErrorMessage })}
            />
          </div>
=======
              className="input is-danger"
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
          {isErrorMessage && (
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
<<<<<<< HEAD
              disabled={query === ''}
=======
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
              className={classNames('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
<<<<<<< HEAD
=======
              disabled={query === ''}
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
            >
              {movie ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>
<<<<<<< HEAD
=======

>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
