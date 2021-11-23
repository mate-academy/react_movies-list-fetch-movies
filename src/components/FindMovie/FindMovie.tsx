/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);

  const findMovie = () => {
    getMovie(title)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setMovie(null);
          setError(true);
        } else {
          setMovie(newMovie);
          setError(false);
        }
      });
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
      setError(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              className={classNames('input',
                { 'is-danger': error })}
              onChange={event => {
                setTitle(event.target.value);
                setError(false);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such title
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
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        { movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
