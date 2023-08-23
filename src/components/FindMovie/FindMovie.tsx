import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [titleMovie, setTitleMovie] = useState('');
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleMovie(event.target.value);
    setError(false);
  };

  const handleClickedSerch = () => {
    setLoading(true);
    getMovie(titleMovie.trim())
      .then(movie => {
        if (movie.Response === 'False') {
          setError(true);

          return;
        }

        setError(false);

        setMoviePreview({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleClickAddMovie = (movie: Movie) => {
    addMovie(movie);
    setMoviePreview(null);
    setTitleMovie('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
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
              onChange={handleChangeTitle}
              className={classNames('input', { 'is-danger': hasError })}
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
              disabled={!titleMovie}
              onClick={handleClickedSerch}
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              {moviePreview ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {moviePreview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleClickAddMovie(moviePreview)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {moviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
