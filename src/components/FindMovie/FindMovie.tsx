import React, { useState } from 'react';
import './FindMovie.scss';
import classname from 'classnames';
import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';
import { Loader } from '../Loader/Loader';

interface Props {
  onAddMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());

    setIsLoaded(false);
    setHasError(false);
  };

  const findMovie = () => {
    setIsLoaded(true);
    setHasError(false);
    setFoundedMovie(null);

    request(title)
      .then((res) => {
        setIsLoaded(false);

        if (!res) {
          setHasError(true);
          setFoundedMovie(null);
        } else {
          setFoundedMovie(res);
        }
      })
      .catch(() => setHasError(true));
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement>
    | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (foundedMovie) {
      onAddMovie(foundedMovie);

      setTitle('');
      setFoundedMovie(null);
      setIsLoaded(false);
      setHasError(false);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classname(
                'input',
                { 'is-danger': hasError },
              )}
              value={title}
              onChange={handleChange}
            />
          </div>

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
              disabled={title.length < 1}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleSubmit}
              disabled={!foundedMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundedMovie && (
          <MovieCard movie={foundedMovie} />
        )}

        {isLoaded
        && !hasError
        && (
          <Loader />
        )}
      </div>

    </>
  );
};
