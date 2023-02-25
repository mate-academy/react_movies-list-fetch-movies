import React, { useState } from 'react';
import classNames from 'classnames';

import { isResponceOK, normalizeData } from '../helpers';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  handleQueryChange: (value: string) => void,
  addNewMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  handleQueryChange,
  addNewMovie,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoad, setIsLoad] = useState(false);
  const [catchError, setCatchError] = useState(false);

  const LoadMovie = async () => {
    setIsLoad(true);

    if (query !== ' ' && query.length > 0) {
      const movieData = await getMovie(query);

      setIsLoad(false);

      if (isResponceOK(movieData)) {
        const normalizedMovie = normalizeData(movieData as MovieData);

        setMovie(normalizedMovie);
      } else {
        setCatchError(true);
      }
    }

    handleQueryChange('');
  };

  const onFindMovie = (event: React.FormEvent) => {
    event.preventDefault();
    LoadMovie();
  };

  const onButtonAdd = () => {
    if (movie !== null) {
      addNewMovie(movie);
    }
  };

  const onResetMovie = () => {
    setMovie(null);
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
              className="input is-dander"
              value={query}
              onChange={(event) => (
                // eslint-disable-next-line no-sequences
                handleQueryChange(event.target.value),
                setCatchError(false)
              )}
            />
          </div>
          {catchError && (
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
                { 'is-loading': isLoad },
              )}
              onClick={onFindMovie}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => (
                // eslint-disable-next-line no-sequences
                  onButtonAdd(),
                  onResetMovie()
                )}
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
