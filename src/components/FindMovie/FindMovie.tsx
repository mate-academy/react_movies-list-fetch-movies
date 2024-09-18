/* eslint-disable max-len */
import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setTitle(event.target.value);
    setError(false);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(title)
      .then(loadedMovie => {
        if (loadedMovie.hasOwnProperty('Error')) {
          throw new Error();
        }

        return loadedMovie as MovieData;
      })
      .then(loadedMovie =>
        setMovie({
          title: loadedMovie.Title,
          description: loadedMovie.Plot,
          imgUrl:
            (loadedMovie.Poster !== 'N/A' && loadedMovie.Poster) ||
            'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}`,
          imdbId: loadedMovie.imdbID,
        }),
      )
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  const onAddClick = () => {
    if (movie) {
      onAdd(movie);
      setTitle('');
      setError(false);
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={cn('input', { 'is-danger': error })}
              value={title}
              onChange={handleTitleChange}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!title.length}
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
                onClick={onAddClick}
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
