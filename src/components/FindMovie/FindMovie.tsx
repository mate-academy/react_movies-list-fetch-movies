/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieContext } from '../Store/Store';
import { MovieCard } from '../MovieCard';
import { isResponseError } from '../../services/isResponseError';

export const FindMovie: React.FC = () => {
  const {
    loading,
    searchMovie,
    setSearchMovie,
    movie,
    setMovie,
    movieData,
    setMoviesList,
    setCount,
  } = useContext(MovieContext);

  const [title, setTitile] = useState('');
  const [hasError, setHasError] = useState(false);

  const isDisabled = !title;

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitile(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setSearchMovie(title.toLowerCase().trim());
    setCount(currentCount => currentCount + 1);
  };

  const handleAddMovie = () => {
    if (movie) {
      setMoviesList(prevList => {
        const includeMovie = prevList.some(mov => mov.imdbId === movie.imdbId);

        if (includeMovie) {
          return prevList;
        }

        return [...prevList, movie];
      });

      setTitile('');
      setMovie(null);
    }
  };

  useEffect(() => { // useEffect for reset hasError
    if (title !== searchMovie) {
      setHasError(false);
    }
  }, [title]);

  useEffect(() => { // useEffect for check movieData isResponseError
    if (isResponseError(movieData) && title) {
      setHasError(true);
    }
  }, [movieData]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={cn('input', { 'is-danger': hasError })}
              value={title}
              onChange={handleTitle}
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
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': loading })}
              onClick={handleSubmit}
              disabled={isDisabled}
            >
              {movie
                ? <span>Search again</span>
                : <span>Find a movie</span>}
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
