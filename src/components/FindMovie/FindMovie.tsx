import React, { useCallback, useState } from 'react';
import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';
import './FindMovie.scss';
/* eslint-disable max-len */

interface Props {
  addMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const getMovie = useCallback(
    (event: React.FormEvent<HTMLFormElement>
    | React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      request(title)
        .then(({
          Response, Poster, Title, Plot, imdbID,
        }) => {
          setError(Response !== 'True');

          if (Response === 'True') {
            setPreview({
              Plot, Poster, Title, imdbID,
            });
          } else {
            setPreview(null);
          }
        });
    }, [title],
  );

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setTitle(event.target.value);
  }, []);

  const onAdd = useCallback(() => {
    if (preview) {
      addMovie(preview);
    }

    setTitle('');
    setPreview(null);
  }, [preview]);

  return (
    <>
      <form className="find-movie" onSubmit={getMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error && 'is-danger'}`}
              value={title}
              onChange={changeHandler}
            />
          </div>

          {error && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {preview && <MovieCard movie={preview} />}
      </div>
    </>
  );
});
