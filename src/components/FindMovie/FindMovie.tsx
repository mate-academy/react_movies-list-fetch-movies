import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { request } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [film, setFilm] = useState<Movie | null>();
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const movie = await request(title);

    if (!movie) {
      setError(true);
    }

    setTitle('');
    setFilm(movie);
    setError(false);
  };

  const handleClick = () => {
    if (!film) {
      return;
    }

    addMovie(film);
    setTitle('');
    setFilm(null);
    setError(false);
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
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>

          {(error) && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClick}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard
          movie={film || null}
        />
      </div>
    </>
  );
};
