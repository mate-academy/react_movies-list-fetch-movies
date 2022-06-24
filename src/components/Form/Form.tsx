import React from 'react';
import classNames from 'classnames';

interface Props {
  title: string,
  setTitle: (value: string) => void;
  setIsMovieFound: (value: boolean) => void;
  isMovieFound: boolean,
  findMovieCatch: () => void,
  onSubmit: () => void,
  movie: Movie | null,
}

export const Form: React.FC<Props> = ({
  title,
  setTitle,
  setIsMovieFound,
  isMovieFound,
  findMovieCatch,
  onSubmit,
  movie,
}) => {
  return (
    <form className="find-movie">
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setIsMovieFound(false);
            }}
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            className={classNames('input', { 'is-danger': isMovieFound })}
          />
        </div>

        {isMovieFound
        && (

          <p className="help is-danger">
            Can&apos;t find such a movie
          </p>
        )}

      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            data-cy="find"
            type="button"
            className="button is-light"
            onClick={findMovieCatch}
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            data-cy="add"
            type="button"
            className="button is-primary"
            onClick={() => {
              if (movie !== null) {
                onSubmit();
              }
            }}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>
  );
};
