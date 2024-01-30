import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovieToList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [movie, setMovie] = useState({} as Movie);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage(false);
  };

  const handleAddClick = () => {
    setLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setErrorMessage(true);
        }

        if ('Title' in response) {
          const findedMovie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(findedMovie as Movie);
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleAddClick();
  };

  const handleAddMovieToList = () => {
    addMovieToList(movie);
    setMovie({} as Movie);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
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
              className={`input ${errorMessage ? 'is-danger' : ''}`}
              value={query}
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': loading },
              )}
              disabled={!query}
            >
              {movie.title ? 'Search again' : 'Find a movie'}
            </button>
          </div>
        </div>

        <div className="contol">
          {movie.title && (
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddMovieToList}
            >
              Add to the list
            </button>
          )}
        </div>
      </form>
      {movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
