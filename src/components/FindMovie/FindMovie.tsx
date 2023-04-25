import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { normalizeMovieData } from '../../utils/normalizeMovieData';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const findMovie = async () => {
    setIsLoading(true);
    try {
      const dataFromServer = await getMovie(query);

      if ('Error' in dataFromServer) {
        setError(true);
      } else {
        setMovie(normalizeMovieData(dataFromServer as MovieData));
      }
    } catch (err) {
      setError(true);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChangeQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    findMovie();
  };

  const handleOnClickAddMovie = () => {
    addMovie((movies : Movie[]) => {
      return [...movies, movie as Movie];
    });
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmit}>
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
              className="input is-dander"
              value={query}
              onChange={handleOnChangeQuery}
            />
          </div>

          {error && (
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
              className={classNames(
                'button is-light', {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query}
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
                onClick={handleOnClickAddMovie}
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
