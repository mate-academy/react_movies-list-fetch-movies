import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { normalizeMovieData } from '../../utils/normalizeMovieData';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setErrorMessage("Can't find a movie with such a title");
        } else {
          const currentMovie = normalizeMovieData(response);

          setMovie(currentMovie);
          setErrorMessage('');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddClick = useCallback(() => {
    if (movie !== null) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
    setErrorMessage('');
  }, [addMovie, movie]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setErrorMessage('');
    },
    [],
  );

  return (
    <>
      <form className="find-movie" onSubmit={submitForm}>
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
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {movie === null ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
