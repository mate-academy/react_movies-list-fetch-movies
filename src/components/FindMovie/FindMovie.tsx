import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { getMovies } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addMovie: (Movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = React.memo(
  ({ addMovie }) => {
    const [Movie, setMovie] = useState<Movie | null>();

    const [typedTitle, setTypedTitle] = useState('');
    const [title, setTitle] = useState('');

    const [isMovie, setIsMovie] = useState(true);

    useEffect(() => {
      getMovies(title)
        .then(result => {
          if (result.Error === 'Movie not found!') {
            setIsMovie(false);
          }

          if (result.Title) {
            const {
              Poster,
              Title,
              Plot,
              imdbID,
            } = result;

            setMovie({
              Poster,
              Title,
              Plot,
              imdbID,
            });

            setTitle('');
            setTypedTitle('');
          }
        });
    }, [title]);

    const disabled = useMemo(() => {
      return Boolean(Movie);
    }, [Movie]);

    return (
      <>
        <form className="find-movie">
          <div className="field">
            <label className="label" htmlFor="movie-title">
              <div className="control">
                <input
                  type="text"
                  id="movie-title"
                  placeholder="Enter a title to search"
                  className={classNames('input', { 'is-danger': !isMovie })}
                  value={typedTitle}
                  onChange={({ target }) => {
                    setIsMovie(true);
                    setTypedTitle(target.value);
                  }}
                />
              </div>

              {!isMovie && (
                <p className="help is-danger">
                  Can&apos;t find a movie with such a title
                </p>
              )}
            </label>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={() => {
                  setTitle(typedTitle);
                }}
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              <button
                disabled={!disabled}
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (Movie) {
                    addMovie(Movie);
                    setMovie(null);
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          </div>
        </form>

        {Movie && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard
              movie={Movie}
            />
          </div>
        )}
      </>
    );
  },
);
