import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie, normalizeData } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onMovieAdition: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = React.memo(
  ({ onMovieAdition }) => {
    const [title, setTitle] = useState<string>('');
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      setIsError(false);
    };

    const handleSubmitForm = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      try {
        const response = await getMovie(title.trim());

        if ('Error' in response) {
          throw new Error(response.Error);
        }

        setMovie(normalizeData(response));
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const handleAddMovieButton = (newMovie: Movie) => {
      onMovieAdition(newMovie);
      setTitle('');
      setMovie(null);
    };

    return (
      <>
        <form
          className="find-movie"
          onSubmit={handleSubmitForm}
        >
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
                value={title}
                onChange={handleTitleInput}
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
                disabled={!title}
              >
                {!movie
                  ? 'Find a movie'
                  : 'Search again'}

              </button>
            </div>

            {movie && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => handleAddMovieButton(movie)}
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
  },
);
