import React, { useState } from 'react';
import classNames from 'classnames';
import { requestApi } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const loadMovieFromServer = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const loadResult = await requestApi(searchQuery);

    setMovie(loadResult);

    setSearchQuery('');
  };

  const submitAddMovie = () => {
    if (movie !== null && movie.Response === 'True') {
      onAdd(movie);

      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={searchQuery}
                placeholder="Enter a title to search"
                className={classNames('input', {
                  'is-danger': movie !== null
                    && movie.Response === 'False'
                    && searchQuery === '',
                })}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
              />
            </div>
          </label>

          {movie !== null
            && movie.Response === 'False'
            && searchQuery === ''
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={loadMovieFromServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={movie === null || movie.Response === 'False'}
              onClick={submitAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie !== null && movie.Response === 'True' && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
