import React, {
  useCallback,
  useState,
  FormEvent,
} from 'react';
import './FindMovie.scss';

import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

interface Props {
  addMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorText, setErrorText] = useState(false);
  const [title, setTitle] = useState('');
  const [emptyTitle, setEmptyTitle] = useState(false);

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (movie && !errorText) {
      addMovie(movie);
      setMovie(null);
      setTitle('');
    }
  }, [movie, errorText]);

  const onFindMovieTitle = async () => {
    if (!title) {
      setErrorText(false);
      setEmptyTitle(true);

      return;
    }

    const newMovie = await getMovie(title);

    if (!newMovie.Title) {
      setEmptyTitle(false);
      setErrorText(true);

      return;
    }

    setMovie(newMovie);
    setErrorText(false);
    setEmptyTitle(false);
  };

  const onChangeTitle = useCallback((event => {
    setTitle(event.target.value);
  }), []);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onAddMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorText })}
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          {errorText && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {emptyTitle && (
            <p className="help is-danger">
              Enter the title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFindMovieTitle}

            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}
              disabled={movie === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}
    </>
  );
};
