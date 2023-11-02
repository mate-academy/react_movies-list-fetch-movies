import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (error) {
      setError(false);
    }

    setTitle(event.target.value);
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(false);

    getMovie(title.trim())
      .then((data) => {
        if ('Error' in data) {
          setError(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = data as MovieData;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A'
              ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const resetForm = () => {
    setTitle('');
    setMovie(null);
  };

  const addMovieHandler = () => {
    if (movie) {
      onAddMovie(movie);
      resetForm();
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': error,
              })}
              onChange={inputChangeHandler}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={title.trim() === ''}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieHandler}
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
