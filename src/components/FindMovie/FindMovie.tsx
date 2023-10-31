import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { prepareMovie } from '../../utils/prepareMovie';
import { MovieCard } from '../MovieCard';

type Props = {
  onSetMovie(newMovie: Movie): void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onSetMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFindMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(false);
    setIsLoading(true);

    getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setError(true);
          setMovie(null);
        } else {
          setMovie(prepareMovie(data));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setTitle(event.target.value);
  };

  const handleResetForm = () => {
    setTitle('');
    setMovie(null);
  };

  const onAddMovie = () => {
    const existMovie = movies.find(
      (elem: Movie): boolean => elem.imdbId === movie?.imdbId,
    );

    if (existMovie) {
      handleResetForm();

      return;
    }

    if (movie) {
      onSetMovie(movie);
      handleResetForm();
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFindMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={onTitleChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn(
                'input',
                { 'is-danger': error },
              )}
            />
          </div>
          {error
            && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!title}
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => onAddMovie()}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>

            <MovieCard movie={movie} />
          </div>
        )}

    </>
  );
};
