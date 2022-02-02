import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { getMovies } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addMovie: (Movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = React.memo(
  ({ addMovie }) => {
    const [Movie, setMovie] = useState<Movie>();

    const [currentTitle, setCurrentTitle] = useState('');
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
            setCurrentTitle('');
          }
        });
    }, [title]);

    const disabled = Boolean(Movie);

    // eslint-disable-next-line no-console
    console.log('rendering', Movie);

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
                  value={currentTitle}
                  onChange={({ target }) => {
                    setIsMovie(true);
                    setCurrentTitle(target.value);
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
                  setTitle(currentTitle);
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
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          </div>
        </form>

        {Movie && isMovie && (
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
