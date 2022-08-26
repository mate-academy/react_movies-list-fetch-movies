import React, { FormEvent, useCallback, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setIsLoaded(true);
    getMovie(query)
      .then(res => {
        if ('Error' in res) {
          return Promise.reject();
        }

        const {
          Title, Poster, Plot, imdbID, imdbUrl,
        }
          = res as MovieData;

        setMovie({
          title: Title,
          description: Plot,
          imdbUrl,
          imgUrl: Poster
            || 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbId: imdbID,
        });
        setIsError(false);

        return Promise.resolve();
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoaded(false));
  }, [query]);

  const addMovieToList = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

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
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoaded },
              )}
              disabled={!query.length}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
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
};
