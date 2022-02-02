import React, { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({} as Movie);
  const [isMovieFound, setMovieFound] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const addMovie = () => {
    onAdd(movie);

    setTitle('');
    setMovieFound(false);
  };

  const findMovie = async () => {
    if (!isMovieFound || movie.Title.localeCompare(title, undefined, { sensitivity: 'accent' })) {
      try {
        setLoading(true);
        const foundMovie = await getMovie(title.trim());

        setMovie(foundMovie);
        setMovieFound(true);
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
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
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': isError })}
                value={title}
                onChange={handleChange}
              />
            </div>
          </label>

          {isError && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
              disabled={!isMovieFound}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isLoading && (
        <progress className="progress is-small is-primary" max="100" />
      )}

      {isMovieFound && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
