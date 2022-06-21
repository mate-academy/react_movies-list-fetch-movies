import React, { Dispatch, SetStateAction, useState } from 'react';
import classnames from 'classnames';
import './FindMovie.scss';
import { getFilmByTitle } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  choosedMovie: Dispatch<SetStateAction<Movie[]>>,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ choosedMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  return (
    <>
      <form
        className="find-movie"
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
              className={classnames(
                'input',
                {
                  'is-danger': error,
                },
              )}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
            />
          </div>

          {error
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
              data-cy="find"
              className="button is-light"
              disabled={!title}
              onClick={() => {
                getFilmByTitle(title)
                  .then(film => {
                    if (film.Error) {
                      setError(true);
                    } else {
                      return setPreview(film);
                    }

                    return null;
                  });
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              data-cy="add"
              className="button is-primary"
              disabled={error}
              onClick={() => {
                if (preview !== null
                  && movies.every(movie => movie.imdbID !== preview.imdbID)) {
                  choosedMovie(current => [...current, preview]);
                }

                setPreview(null);
                setTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {preview
        && (
          <MovieCard movie={preview} />
        )}
      </div>
    </>
  );
};
