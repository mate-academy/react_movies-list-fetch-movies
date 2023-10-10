import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(responce => {
        if ('Error' in responce) {
          throw new Error('Error from server');
        }

        const movieImage = responce.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : responce.Poster;

        setPreviewMovie({
          title: responce.Title,
          description: responce.Plot,
          imgUrl: movieImage,
          imdbUrl: `https://www.imdb.com/title/${responce.imdbID}`,
          imdbId: responce.imdbID,
        });
      })
      .catch(() => setErrorMessage(
        'Can&apos;t find a movie with such a title',
      ))
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setQuery(event.target.value);
  };

  const handleAddButton = () => {
    const inTheList = movies
      .some(movie => movie.imdbId === previewMovie?.imdbId);

    if (!inTheList && previewMovie) {
      setMovies([
        ...movies,
        previewMovie,
      ]);
    }

    setPreviewMovie(null);
    setQuery('');
    setErrorMessage('');
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
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleInputChange}
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
              Find a movie
            </button>
          </div>

          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
