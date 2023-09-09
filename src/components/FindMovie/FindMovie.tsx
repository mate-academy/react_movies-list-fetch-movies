import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovies: (movies: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovies }) => {
  const [title, setTitle] = useState('');
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMoviePreview = moviePreview !== null;

  const handleOnChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const handleFindMovie = () => {
    const query = title.trim();

    setIsLoading(true);

    if (query) {
      getMovie(query)
        .then(movie => {
          const { Response } = movie as ResponseError;

          if (Response === 'False') {
            setIsError(true);
          } else {
            const {
              Poster, Title, Plot, imdbID,
            } = movie as MovieData;

            setMoviePreview({
              title: Title,
              description: Plot,
              imdbId: imdbID,
              imdbUrl: imdbID,
              imgUrl: Poster,
            });

            setIsError(false);
          }
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  };

  const handleAddMovie = () => {
    if (moviePreview) {
      onAddMovies(moviePreview);
    }

    setTitle('');
    setMoviePreview(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
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
              className={classNames('input', { 'is-danger': isError })}
              value={title}
              onChange={handleOnChangeTitle}
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
              className={classNames(
                'button is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              onClick={() => handleFindMovie()}
              disabled={title.trim().length === 0}
            >
              {moviePreview !== null ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {isMoviePreview && (
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

      {isMoviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
