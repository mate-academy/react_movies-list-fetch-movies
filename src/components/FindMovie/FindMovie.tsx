import React, { useState, memo, useCallback } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = memo(({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = useCallback(async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setIsLoading(true);

    const movieData = await getMovie(title);

    setIsLoading(false);

    if ('Error' in movieData) {
      setHasError(true);
    } else {
      const foundMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster !== 'N/A'
          ? movieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setMovie(foundMovie);
    }
  }, [title]);

  const handleQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasError(false);
  }, [title]);

  const handleAdd = useCallback(() => {
    if (movie) {
      onAdd(movie);
      setMovie(null);
      setTitle('');
      setHasError(false);
    }
  }, [movie]);

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
              className="input is-dander"
              value={title}
              onChange={e => handleQuery(e)}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>

          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
});
