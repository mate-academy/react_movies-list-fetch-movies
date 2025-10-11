import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie, getMovieInfo, isError } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  getAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ getAddMovie }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setTitleError(false);
    setTitle(newValue);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(title)
      .then(data => {
        if (isError(data)) {
          throw new Error((data as ResponseError).Error);
        }

        return getMovieInfo(data as MovieData);
      })
      .then(movieInfo => {
        setMovie(movieInfo);
        setTitleError(false);
      })

      .catch(() => {
        setMovie(undefined);
        setTitleError(true);
      })
      .finally(() => setLoading(false));
  };

  const getReset = () => {
    setMovie(undefined);
    setTitle('');
    setTitleError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              value={title}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': titleError,
              })}
              onChange={handleTitle}
            />
          </div>

          {titleError && (
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
              className={cn('button is-light', {
                'is-loading': loading,
              })}
              disabled={title.length === 0}
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
                onClick={() => {
                  getAddMovie(movie);
                  getReset();
                }}
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
