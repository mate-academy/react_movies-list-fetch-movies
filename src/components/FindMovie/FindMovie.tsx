import classNames from 'classnames';
import React, { useState } from 'react';
import { getMoviesFromServer } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addFilm: (film: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addFilm }) => {
  const [title, setTitle] = useState('');
  const [film, setFilm] = useState<Movie | null>(null);
  const [hasFilm, setHasFilm] = useState(false);

  const searchFilm = () => {
    getMoviesFromServer(title)
      .then(movie => {
        if (!movie.Error) {
          setFilm(movie);
        } else {
          setHasFilm(true);
        }
      });
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={title}
              className={classNames({ 'is-danger': hasFilm }, 'input')}
              onChange={(event) => {
                setHasFilm(false);
                setTitle(event.target.value);
              }}
            />
          </div>
          {hasFilm && (
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
              onClick={searchFilm}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={() => {
                if (film) {
                  addFilm(film);
                  setTitle('');
                  setFilm(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {film && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={film} />
        </div>
      )}
    </>
  );
};
