import React, { memo, useCallback, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

interface Props {
  addMovie: (movie:Movie) => void,
}

export const FindMovie: React.FC<Props> = memo(({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [findError, setFindError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFindError(false);

    setTitle(event.target.value);
  };

  const fetchMovie = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      request(title)
        .then(({
          Response, Poster, Title, Plot, imdbID,
        }) => {
          setFindError(Response !== 'True');

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

  const addToTheList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTitle('');
    if (preview !== null) {
      addMovie(preview);
    }

    setPreview(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event => addToTheList(event))}
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
              className={cn('input', { 'is-danger': findError })}
              value={title}
              onChange={event => handleChange(event)}
            />
          </div>

          {
            findError
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={event => fetchMovie(event)}
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
        {preview && <MovieCard movie={preview} />}
      </div>
    </>
  );
});
