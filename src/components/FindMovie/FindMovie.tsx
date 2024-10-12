import React, { ChangeEvent, FormEvent, useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { convertMovieDataToMovie } from '../../utils/convertMovieDataToMovie';
import { DEFAULT_MOVIE } from '../../mocks';

type Callback = (current: Movie[]) => Movie[];

type Props = {
  onAddMovie: (callback: Callback) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [foundMovie, setFoundMovie] = useState<Movie>(DEFAULT_MOVIE);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasFoundMovie = foundMovie !== DEFAULT_MOVIE;

  const handleLoadMovie = (event: FormEvent) => {
    setLoading(true);

    event.preventDefault();

    getMovie(searchQuery)
      .then(movieData => {
        if (!('Error' in movieData)) {
          const movie = convertMovieDataToMovie(movieData);

          setFoundMovie(movie);
        } else {
          setErrorMessage(`Can't find a movie with such a title`);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    onAddMovie(currentMovies => {
      const hasSameMovie = currentMovies.some(
        movie => movie.imdbId === foundMovie.imdbId,
      );

      if (!hasSameMovie) {
        return [...currentMovies, foundMovie];
      }

      return currentMovies;
    });
    setFoundMovie(DEFAULT_MOVIE);
    setSearchQuery('');
  };

  const handleChangeSearchQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <form className="find-movie">
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
              className={cn('input', { 'is-danger': errorMessage })}
              value={searchQuery}
              onChange={handleChangeSearchQuery}
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!searchQuery}
              onClick={handleLoadMovie}
            >
              Find a movie
            </button>
          </div>

          {hasFoundMovie && (
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

      {hasFoundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
