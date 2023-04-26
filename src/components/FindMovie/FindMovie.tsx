import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { normalizeMovieData } from '../../utils/normalizeMovieData';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: (newMovie: Movie) => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>
};

export const FindMovie: React.FC<Props> = ({ addMovie, error, setError }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const findMovie = async () => {
    setIsLoading(true);
    try {
      const dataFromServer = await getMovie(query);

      if ('Error' in dataFromServer) {
        setError(dataFromServer.Error);
      } else {
        setMovie(normalizeMovieData(dataFromServer as MovieData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChangeQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    if (error) {
      setError('');
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    findMovie();
  };

  const handleOnClickAddMovie = () => {
    if (!movie) {
      return;
    }

    addMovie(movie);
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
              {error}
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
