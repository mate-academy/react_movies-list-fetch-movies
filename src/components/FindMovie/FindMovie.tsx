import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ResponseError';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  interface MovieData {
    Poster: string;
    Title: string;
    Plot: string;
    imdbID: string;
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(value)
      .then((result: MovieData | ResponseError) => {
        if ('Response' in result && result.Response === 'False') {
          setIsError(true);
          setMovie(null);
        } else {
          setIsError(false);

          const defaultIMD =
            'https://via.placeholder.com/360x270.png?text=no%20preview';

          if ('Title' in result) {
            const elem: Movie = {
              title: result.Title,
              description: result.Plot,
              imgUrl: result.Poster !== 'N/A' ? result.Poster : defaultIMD,
              imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
              imdbId: result.imdbID,
            };

            setMovie(elem);
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (movie) {
      addMovie(movie);
      setValue('');
      setMovie(null);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={value}
              onChange={e => {
                setValue(e.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={value?.length === 0}
              onClick={handleSubmit}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
