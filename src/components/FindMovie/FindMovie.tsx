import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovieByTitle } from '../../api/api';

import { MovieCard } from '../MovieCard';

interface Props {
  addNewMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addNewMovie } = props;
  const [title, setTitle] = useState('');
  const [loadedMovie, setLoadedMovie] = useState<Movie | null>(null);
  const [searchMovieError, setSearchMovieError] = useState(false);
  const [changedTitle, isTitleChanged] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loadedMovie) {
      addNewMovie(loadedMovie);
    }

    setTitle('');
    setSearchMovieError(false);
    isTitleChanged(false);
  }

  const loadMovie = async () => {
    try {
      const movieFromServer = await getMovieByTitle(title);

      setLoadedMovie(movieFromServer);
      setSearchMovieError(false);
    } catch {
      setLoadedMovie(null);
      setSearchMovieError(true);
      isTitleChanged(false);
    }
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    isTitleChanged(true);

    return setTitle(value);
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
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn(
                  'input',
                  { 'is-danger': (searchMovieError && !changedTitle) },
                )}
                value={title}
                onChange={inputHandler}
              />
            </div>
          </label>
          {(searchMovieError && !changedTitle) && (
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
              onClick={loadMovie}
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
        {loadedMovie && (<MovieCard movie={loadedMovie} />)}
      </div>
    </>
  );
};
