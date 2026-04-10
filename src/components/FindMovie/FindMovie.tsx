import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { getMovie, isResponseError } from '../../api';

import { isNoData, MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { DEFAULT_PLACEHOLDER_IMAGE_MOVIE_POSTER } from '../../constants';

type Props = {
  addMovie: (movie: Movie) => void;
};

const FindMovieBase: React.FC<Props> = ({ addMovie }) => {
  const [foundMovie, setFoundMovie] = useState<MovieData | null>(null);

  const [title, setTitle] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const prepareMovie = (movie: MovieData): Movie => {
    return {
      title: movie.Title,
      description: movie.Plot,
      imgUrl: isNoData(movie.Poster)
        ? DEFAULT_PLACEHOLDER_IMAGE_MOVIE_POSTER
        : movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      imdbId: movie.imdbID,
    };
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasError(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);

    setIsLoading(true);
    getMovie(title)
      .then(res => {
        if (isResponseError(res)) {
          setHasError(true);
        } else {
          setFoundMovie(res);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = (movie: Movie) => {
    addMovie(movie);
    setTitle('');
    setHasError(false);
    setFoundMovie(null);
  };

  const movie = foundMovie && prepareMovie(foundMovie);

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={handleTitleChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': hasError,
              })}
            />
          </div>
          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!title}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                onClick={() => handleAddMovie(movie)}
                data-cy="addButton"
                type="button"
                className="button is-primary"
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

export const FindMovie = React.memo(FindMovieBase);
