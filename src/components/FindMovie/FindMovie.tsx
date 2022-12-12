import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = React.memo(({ onAdd, movies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const defaultImgUrl = useMemo(() => {
    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }, []);

  const clearForm = useCallback(() => {
    setQuery('');
    setFoundMovie(null);
    setHasError(false);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setHasError(false);

      const newMovie = await getMovie(query);

      try {
        if ('Error' in newMovie) {
          setHasError(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = newMovie;

          setFoundMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? defaultImgUrl
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, [query],
  );

  const handleAdd = useCallback(() => {
    const notNewMovie = movies.some(movie => (
      movie.imdbId === foundMovie?.imdbId));

    if (foundMovie && !notNewMovie) {
      onAdd(foundMovie);
    }

    clearForm();
  }, [foundMovie, movies]);

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
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setHasError(false);
              }}
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
              className={classNames(
                'button is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query}
            >
              {foundMovie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
});
