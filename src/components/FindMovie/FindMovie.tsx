import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorFromServer, setErrorFromServer] = useState(false);

  const titleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
    setErrorFromServer(false);
  };

  const findMovie = async () => {
    if (!title) {
      return;
    }

    const newMovie = await getMovie(title);

    if (newMovie.Response === 'False') {
      setErrorFromServer(true);
    }

    if (!newMovie.Title) {
      setHasError(true);

      return;
    }

    setMovie(newMovie);
    setHasError(false);
  };

  const handleSubmit = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                value={title}
                onChange={titleChange}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': hasError })}
              />
            </div>
          </label>
          {hasError && (
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
              onClick={handleSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!errorFromServer && movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
