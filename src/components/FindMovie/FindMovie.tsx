import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard/MovieCard';

type Props = {
  addNewMovie: (newMovie: MovieData | null) => void,
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [movieTitleQuery, setMovieTitleQuery] = useState('');
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(false);

  const handleLoadMovieFromServer = async () => {
    setLoadingMovie(true);

    try {
      const newMovie = await getMovie(movieTitleQuery);

      if (!newMovie.imdbID) {
        setMovie(null);
        setHasLoadingError(true);
      } else {
        setMovie(newMovie);
        setHasLoadingError(false);
      }
    } catch (error) {
      alert('Error loading data from the server');
    } finally {
      setLoadingMovie(false);
    }
  };

  const handleFindMovie = (query: string) => {
    if (query !== movieTitleQuery) {
      setHasLoadingError(false);
    }

    setMovieTitleQuery(query);
  };

  const handleAddNewMovieToTheList = (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    addNewMovie(movie);
    setMovie(null);
    setMovieTitleQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleAddNewMovieToTheList(event)}
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
              value={movieTitleQuery}
              onChange={(event) => handleFindMovie(event.target.value)}
            />
          </div>

          {hasLoadingError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">

            <button
              disabled={!movieTitleQuery}
              data-cy="searchButton"
              type="button"
              className={classNames(
                'button is-light',
                { 'is-loading': loadingMovie },
              )}
              onClick={handleLoadMovieFromServer}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>

          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="submit"
                className="button is-primary"
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
