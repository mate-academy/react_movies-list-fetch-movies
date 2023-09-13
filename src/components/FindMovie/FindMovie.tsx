import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  movie: Movie | null;
  handleAddMovie: (val: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  movie,
  handleAddMovie,
}) => {
  const [isMovieExist, setIsMovieExist] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const [load, setLoad] = useState(false);

  const checkIfMovieExist = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoad(true);

    if (!movie) {
      setIsMovieExist(true);
    } else {
      setCurrentMovie(movie);
      setShowPreview(true);
      setIsMovieExist(false);
    }

    setTimeout(() => {
      setLoad(false);
    }, 100);
  };

  const reset = () => {
    setShowPreview(false);
    setQuery('');
    setCurrentMovie(null);
  };

  useEffect(() => {
    setIsMovieExist(false);
  }, [query]);

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
              className={classnames(
                'input',
                {
                  'is-danger': isMovieExist,
                },
              )}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {isMovieExist && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classnames(
                'button',
                'is-light',
                {
                  'is-loading': load,
                },
              )}
              onClick={checkIfMovieExist}
            >
              {currentMovie
                ? ('Search again')
                : ('Find a movie')}
            </button>
          </div>

          <div className="control">
            {showPreview && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (currentMovie) {
                    handleAddMovie(currentMovie);
                    reset();
                  }
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {showPreview && currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
