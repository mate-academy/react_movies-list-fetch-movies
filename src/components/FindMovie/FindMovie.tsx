import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  onAddMovie: (arg0: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsError(false);
  }, [movieTitle]);

  const searchMovie = async () => {
    setIsLoading(true);
    setIsError(false);

    const result = await getMovie(movieTitle);

    if (result.Error) {
      setIsError(true);
    } else {
      setFoundedMovie(result);
    }

    setIsLoading(false);
  };

  const handleAddMovie = () => {
    if (foundedMovie) {
      onAddMovie(foundedMovie);
    }

    setMovieTitle('');
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
              className={classnames('input',
                { 'is-danger': isError })}
              value={movieTitle}
              onChange={event => setMovieTitle(event.target.value)}
            />
          </div>

          {isError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isLoading && (
            <p className="help">
              Searching...
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              disabled={isLoading}
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              disabled={!foundedMovie}
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundedMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundedMovie} />
        </div>
      )}
    </>
  );
};
